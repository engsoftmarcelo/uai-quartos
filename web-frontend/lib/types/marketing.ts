export interface CampusPreview {
  city: string;
  href: string;
  id: string;
  imageUrl: string;
  label: string;
  listingCount: number;
  neighborhoodHint: string;
}

export interface FAQItem {
  answer: string;
  question: string;
}

export interface FilterShortcut {
  description: string;
  href: string;
  id: string;
  label: string;
}

export interface RecentSearch {
  href: string;
  id: string;
  label: string;
  meta: string;
}

export interface SocialProofItem {
  label: string;
  value: string;
}
