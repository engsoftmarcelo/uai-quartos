import { BadgeCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SearchResultRoommateProfile } from "@/lib/types";

export function CompatibilityPillGroup({
  profile,
}: {
  profile: SearchResultRoommateProfile;
}) {
  return (
    <div className="grid gap-2">
      <Badge
        icon={<BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
        tone={profile.compatibilityScore >= 90 ? "success" : "brand"}
      >
        {profile.compatibilityScore}% compatibilidade
      </Badge>
      <div className="flex flex-wrap gap-2">
        <Badge icon={<Users className="h-3.5 w-3.5" aria-hidden="true" />}>
          {profile.ageRange}
        </Badge>
        {profile.tags.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
