export type ContactSettings = {
  emailVisible: boolean;
  phone: string;
  phoneVisible: boolean;
  preferredContact: "email" | "phone";
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  schoolDomain: string;
  communityName: string;
  contact: ContactSettings;
  emailVerified: boolean;
};

export type PublicOwner = {
  id: string;
  firstName: string;
  lastName: string;
  schoolDomain: string;
  communityName: string;
  preferredContact: "email" | "phone";
  email?: string;
  phone?: string;
};

export type Item = {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  status: string;
  quantity: number;
  locationLabel: string;
  visibility: string;
  keywords: string[];
  imageUrl: string;
  estimatedValue?: {
    low?: number;
    high?: number;
    average?: number;
    currency?: string;
    checkedAt?: string;
  };
  owner?: PublicOwner;
  createdAt: string;
  updatedAt: string;
};

export type InterestSnapshot = {
  _id: string;
  keyword: string;
  ebay?: {
    totalListings?: number;
    sampleSize?: number;
    averagePrice?: number;
    lowPrice?: number;
    highPrice?: number;
    currency?: string;
    results?: Array<{
      title: string;
      price: number;
      currency: string;
      condition: string;
      imageUrl: string;
      itemUrl: string;
    }>;
  };
  youtube?: {
    resultCount?: number;
    sampledVideoCount?: number;
    totalViews?: number;
  };
  internal: {
    matchingItemCount: number;
    matchingPublicCount: number;
    matchingSchoolCount: number;
    searchCount: number;
  };
  reuseScore: number;
  recommendation: string;
};
