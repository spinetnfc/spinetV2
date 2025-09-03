export type ProfileLink = {
  title: string;
  link: string;
};

export type Profile = {
  _id: string;
  fullName: string;
  theme?: { color?: string };
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: "male" | "female";
  companyName?: string;
  activitySector?: string;
  position?: string;
  profilePicture?: string;
  profileCover?: string;
  bio?: string;
  links?: ProfileLink[];
};

export type LeadCaptions = {
  metIn?: string;
  longitude?: number;
  latitude?: number;
  date?: string;
  tags?: string[];
  nextAction?: string;
  dateOfNextAction?: string;
  notes?: string;
};

export type Contact = {
  _id: string;
  name: string;
  description?: string;
  type?: "scan" | "manual" | "exchange" | "spinet" | "phone";
  Profile: Profile;
  leadCaptions?: LeadCaptions;
};


export type ContactInput = {
    name: string; // Required, derived from profile.fullName
    description?: string;
    type?: "scan" | "manual" | "exchange" | "spinet" | "phone";
    profile:
    | {
        fullName: string; // Required
        theme?: { color?: string };
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        gender?: "male" | "female";
        companyName?: string;
        activitySector?: string;
        position?: string;
        profilePicture?: string;
        profileCover?: string;
        bio?: string;
        links?: Array<{
            title: string; // Required
            link: string; // Required
        }>;
    }
    leadCaptions?: {
        metIn?: string;
        longitude?: number;
        latitude?: number;
        date?: string; // ISO date-time
        tags?: string[];
        nextAction?: string;
        dateOfNextAction?: string; // Date format
        notes?: string;
    };
};

export type InviteContact = {
    profile: string;
    leadCaptions: {
        metIn?: string;
        date?: string;
        tags?: string[];
        nextAction?: string;
        dateOfNextAction?: string;
        notes?: string;
    };
}