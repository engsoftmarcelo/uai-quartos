"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import type { LandlordListingDraft } from "@/lib/types";

const profileOptions = [
  "perfil de estudos",
  "rotina tranquila",
  "social moderado",
  "ambiente silencioso",
  "mobiliado",
  "perto do campus",
];

export function CompatibilityProfileFormSection({
  onProfileTagsChange,
  onRoomTypeChange,
  profileTags,
  roomType,
}: {
  onProfileTagsChange: (tags: string[]) => void;
  onRoomTypeChange: (roomType: LandlordListingDraft["roomType"]) => void;
  profileTags: string[];
  roomType: LandlordListingDraft["roomType"];
}) {
  function toggleTag(tag: string, checked: boolean) {
    onProfileTagsChange(
      checked ? [...profileTags, tag] : profileTags.filter((item) => item !== tag),
    );
  }

  return (
    <section className="grid gap-4">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Perfil de convivencia
        </h2>
        <p className="mt-1 text-sm text-muted">
          Ajuda o estudante a entender se a rotina da casa combina com ele.
        </p>
      </div>
      <Select
        label="Tipo de quarto"
        onChange={(event) =>
          onRoomTypeChange(event.target.value as LandlordListingDraft["roomType"])
        }
        options={[
          { label: "Individual", value: "private" },
          { label: "Compartilhado", value: "shared" },
          { label: "Suite", value: "suite" },
        ]}
        value={roomType}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {profileOptions.map((tag) => (
          <Checkbox
            checked={profileTags.includes(tag)}
            key={tag}
            label={tag}
            onChange={(event) => toggleTag(tag, event.target.checked)}
          />
        ))}
      </div>
    </section>
  );
}
