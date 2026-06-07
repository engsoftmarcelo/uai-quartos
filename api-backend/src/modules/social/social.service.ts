import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Profile, Republic } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MatchQueryDto } from './dto/match-query.dto';
import { UserProfileDto } from './dto/user-profile.dto';

type ProfileLike = Pick<
  Profile,
  | 'noiseLevel'
  | 'organization'
  | 'visitorPolicy'
  | 'sleepRoutine'
  | 'isPetFriendly'
  | 'isSmoker'
  | 'preferenceVector'
>;

interface MatchProperty extends Republic {
  owner: {
    profile: ProfileLike | null;
  };
}

export interface MatchResult {
  propertyId: string;
  propertyName: string;
  score: number;
  compatibility: 'Alta' | 'Media' | 'Baixa';
  vectorSimilarity: number;
  factors: Array<{
    key: string;
    label: string;
    score: number;
  }>;
}

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: AuthenticatedUser) {
    return this.prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        preferenceVector: this.buildVector(this.defaultProfile()),
      },
      update: {},
    });
  }

  async updateProfile(user: AuthenticatedUser, dto: UserProfileDto) {
    const preferenceVector = this.buildVector(dto);

    return this.prisma.profile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...dto,
        preferenceVector,
      },
      update: {
        ...dto,
        preferenceVector,
      },
    });
  }

  async calculateMatches(
    user: AuthenticatedUser,
    query: MatchQueryDto,
  ): Promise<MatchResult[]> {
    const studentProfile = await this.getProfile(user);
    const properties = await this.prisma.republic.findMany({
      where: {
        deletedAt: null,
        id: query.propertyId,
      },
      include: {
        owner: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: query.propertyId ? 1 : 24,
    });

    return properties
      .map((property) =>
        this.calculatePropertyMatch(studentProfile, property as MatchProperty),
      )
      .sort((a, b) => b.score - a.score);
  }

  async createConversation(
    user: AuthenticatedUser,
    dto: CreateConversationDto,
  ) {
    const property = await this.prisma.republic.findFirst({
      where: { id: dto.propertyId, deletedAt: null },
      select: { id: true, ownerId: true, name: true },
    });

    if (!property) {
      throw new NotFoundException('Republica nao encontrada.');
    }

    if (property.ownerId === user.id) {
      throw new ForbiddenException(
        'O proprietario nao pode iniciar chat consigo mesmo.',
      );
    }

    return this.prisma.conversation.upsert({
      where: {
        propertyId_studentId_landlordId: {
          propertyId: property.id,
          studentId: user.id,
          landlordId: property.ownerId,
        },
      },
      create: {
        propertyId: property.id,
        studentId: user.id,
        landlordId: property.ownerId,
      },
      update: {},
      include: this.conversationInclude(),
    });
  }

  async listConversations(user: AuthenticatedUser) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ studentId: user.id }, { landlordId: user.id }],
      },
      include: this.conversationInclude(),
      orderBy: { updatedAt: 'desc' },
    });
  }

  async listMessages(user: AuthenticatedUser, conversationId: string) {
    await this.assertConversationParticipant(user, conversationId);

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createMessage(
    user: AuthenticatedUser,
    conversationId: string,
    dto: CreateMessageDto,
  ) {
    await this.assertConversationParticipant(user, conversationId);

    if (dto.eventId) {
      const existing = await this.prisma.message.findUnique({
        where: { eventId: dto.eventId },
      });

      if (existing) {
        return existing;
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId: user.id,
          body: dto.body.trim(),
          eventId: dto.eventId,
          deliveredAt: new Date(),
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }

  async assertConversationParticipant(
    user: AuthenticatedUser,
    conversationId: string,
  ) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [{ studentId: user.id }, { landlordId: user.id }],
      },
    });

    if (!conversation) {
      throw new ForbiddenException('Conversa indisponivel para este usuario.');
    }

    return conversation;
  }

  private calculatePropertyMatch(
    studentProfile: ProfileLike,
    property: MatchProperty,
  ): MatchResult {
    const houseProfile = property.owner.profile ?? this.defaultProfile();
    const factors = [
      {
        key: 'noise',
        label: 'Ruido',
        score: this.rangeScore(
          studentProfile.noiseLevel,
          houseProfile.noiseLevel,
        ),
        weight: 0.18,
      },
      {
        key: 'organization',
        label: 'Organizacao',
        score: this.rangeScore(
          studentProfile.organization,
          houseProfile.organization,
        ),
        weight: 0.16,
      },
      {
        key: 'visitors',
        label: 'Visitas',
        score: this.rangeScore(
          studentProfile.visitorPolicy,
          houseProfile.visitorPolicy,
        ),
        weight: 0.14,
      },
      {
        key: 'sleep',
        label: 'Sono',
        score: this.rangeScore(
          studentProfile.sleepRoutine,
          houseProfile.sleepRoutine,
        ),
        weight: 0.16,
      },
      {
        key: 'smoking',
        label: 'Tabagismo',
        score: this.booleanRestrictionScore(
          studentProfile.isSmoker,
          houseProfile.isSmoker,
        ),
        weight: 0.2,
      },
      {
        key: 'pets',
        label: 'Pets',
        score: this.booleanPreferenceScore(
          studentProfile.isPetFriendly,
          houseProfile.isPetFriendly,
        ),
        weight: 0.08,
      },
    ];
    const vectorSimilarity = this.cosineSimilarity(
      this.vectorFor(studentProfile),
      this.vectorFor(houseProfile),
    );
    const weightedScore =
      factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0) +
      vectorSimilarity * 100 * 0.08;
    const score = Math.round(weightedScore);

    return {
      propertyId: property.id,
      propertyName: property.name,
      score,
      compatibility: score >= 80 ? 'Alta' : score >= 60 ? 'Media' : 'Baixa',
      vectorSimilarity: Number(vectorSimilarity.toFixed(3)),
      factors: factors.map(({ key, label, score: factorScore }) => ({
        key,
        label,
        score: Math.round(factorScore),
      })),
    };
  }

  private defaultProfile(): ProfileLike {
    return {
      noiseLevel: 5,
      organization: 5,
      visitorPolicy: 5,
      sleepRoutine: 5,
      isPetFriendly: false,
      isSmoker: false,
      preferenceVector: [1, 1, 1, 1, 0, 0],
    };
  }

  private buildVector(profile: UserProfileDto): number[] {
    return [
      this.normalizeScale(profile.noiseLevel),
      this.normalizeScale(profile.organization),
      this.normalizeScale(profile.visitorPolicy),
      this.normalizeScale(profile.sleepRoutine),
      profile.isPetFriendly ? 1 : 0,
      profile.isSmoker ? 1 : 0,
    ];
  }

  private vectorFor(profile: ProfileLike): number[] {
    return profile.preferenceVector.length
      ? profile.preferenceVector
      : this.buildVector(profile);
  }

  private normalizeScale(value: number): number {
    return (value - 1) / 4;
  }

  private rangeScore(a: number, b: number): number {
    return Math.max(0, 100 - Math.abs(a - b) * 25);
  }

  private booleanPreferenceScore(a: boolean, b: boolean): number {
    return a === b ? 100 : 75;
  }

  private booleanRestrictionScore(
    studentSmoker: boolean,
    houseSmoker: boolean,
  ) {
    if (studentSmoker && !houseSmoker) {
      return 20;
    }

    return studentSmoker === houseSmoker ? 100 : 85;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dot = a.reduce(
      (sum, value, index) => sum + value * (b[index] ?? 0),
      0,
    );
    const normA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
    const normB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));

    if (!normA || !normB) {
      return 0;
    }

    return Math.max(0, Math.min(1, dot / (normA * normB)));
  }

  private conversationInclude() {
    return {
      property: {
        select: { id: true, name: true, imageUrl: true, neighborhood: true },
      },
      student: {
        select: { id: true, name: true, email: true },
      },
      landlord: {
        select: { id: true, name: true, email: true },
      },
      messages: {
        orderBy: { createdAt: Prisma.SortOrder.desc },
        take: 1,
      },
    };
  }
}
