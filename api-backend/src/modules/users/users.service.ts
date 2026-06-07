import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { PrismaService } from '../../core/prisma/prisma.service';

export type PublicUser = Pick<
  User,
  'id' | 'email' | 'name' | 'role' | 'kycStatus' | 'createdAt' | 'updatedAt'
>;

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role?: Role;
}

const publicUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  kycStatus: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  static toPublicUser(user: User): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      kycStatus: user.kycStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async create(input: CreateUserInput): Promise<PublicUser> {
    try {
      return await this.prisma.user.create({
        data: {
          email: input.email.trim().toLowerCase(),
          name: input.name.trim(),
          password: input.password,
          role: input.role ?? Role.STUDENT,
          profile: {
            create: {},
          },
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('E-mail ja cadastrado no UAI QUARTOS.');
      }

      throw error;
    }
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        deletedAt: null,
      },
    });
  }

  async findActiveById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: publicUserSelect,
    });
  }
}
