
export type NewUser = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  companyName?: string;
  activitySector?: string;
  position?: string;
  phoneNumber?: string;
  website?: string;
  language?: string;
  theme: {
    color: string;
  };
}

export type LoginUser = {
  email: string;
  password: string;
}



