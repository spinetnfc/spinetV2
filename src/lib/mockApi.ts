// Mock API layer for development
// This file replaces all backend API calls with local mock data

import { Contact, ContactInput, InviteContact } from '@/types/contact';
import { Lead, LeadInput, LeadFilters, Note } from '@/types/leads';
import { ProfileData, profileInput } from '@/types/profile';
import {
  Service,
  ServiceInput,
  ServicesData,
  ServicesSearchParams,
} from '@/types/services';
import { User } from '@/types/user';
import { NewUser, LoginUser } from '@/types/auth';

import { mockContacts } from '@/mockdata/contacts';
import { mockLeads } from '@/mockdata/leads';
import { mockProfiles, mockInsights } from '@/mockdata/profiles';
import { mockServices, mockServicesData } from '@/mockdata/services';

// Simulate API delay
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock storage (in-memory)
let contactsStore = [...mockContacts];
let leadsStore = [...mockLeads];
let profilesStore = [...mockProfiles];
let servicesStore = [...mockServices];

export const mockApi = {
  // Auth API
  auth: {
    async register(user: NewUser): Promise<User> {
      await delay();
      console.log('🚧 Mock API: Register user', user);
      throw new Error('Registration not implemented in mock mode');
    },

    async login(user: LoginUser): Promise<User> {
      await delay();
      console.log('🚧 Mock API: Login user', user);
      throw new Error('Login not implemented in mock mode');
    },

    async signOut(): Promise<{ message: string }> {
      await delay();
      console.log('🚧 Mock API: Sign out');
      return { message: 'Signed out successfully' };
    },

    async refreshToken(): Promise<{ message: string }> {
      await delay();
      console.log('🚧 Mock API: Refresh token');
      return { message: 'Token refreshed successfully' };
    },

    async forgotPassword(email: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Forgot password', email);
      return { message: 'Password reset email sent' };
    },

    async verifyOTP(sessionId: string, code: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Verify OTP', sessionId, code);
      return { message: 'OTP verified successfully' };
    },

    async resetPassword(sessionId: string, password: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Reset password', sessionId);
      return { message: 'Password reset successfully' };
    },
  },

  // Contacts API
  contacts: {
    async getContacts(profileId: string | null): Promise<Contact[]> {
      await delay();
      console.log('🚧 Mock API: Get contacts for profile', profileId);
      return contactsStore;
    },

    async addContact(profileId: string, contact: ContactInput): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Add contact', profileId, contact);

      const newContact: Contact = {
        _id: `contact-${Date.now()}`,
        name: contact.name,
        description: contact.description,
        type: contact.type || 'manual',
        Profile: {
          _id: `profile-${Date.now()}`,
          fullName: contact.profile.fullName,
          companyName: contact.profile.companyName,
          position: contact.profile.position,
          links: contact.profile.links || [],
        },
        leadCaptions: contact.leadCaptions,
      };

      contactsStore.push(newContact);
      return { message: 'Contact added successfully' };
    },

    async updateContact(
      profileId: string,
      contactId: string,
      contact: ContactInput,
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Update contact', profileId, contactId, contact);

      const index = contactsStore.findIndex((c) => c._id === contactId);
      if (index !== -1) {
        contactsStore[index] = {
          ...contactsStore[index],
          name: contact.name,
          description: contact.description,
          type: contact.type || contactsStore[index].type,
          Profile: {
            ...contactsStore[index].Profile,
            fullName: contact.profile.fullName,
            companyName: contact.profile.companyName,
            position: contact.profile.position,
            links: contact.profile.links || contactsStore[index].Profile.links,
          },
          leadCaptions:
            contact.leadCaptions || contactsStore[index].leadCaptions,
        };
      }

      return { message: 'Contact updated successfully' };
    },

    async deleteContact(profileId: string, contactId: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Delete contact', profileId, contactId);

      contactsStore = contactsStore.filter((c) => c._id !== contactId);
      return { message: 'Contact deleted successfully' };
    },

    async deleteContacts(
      profileId: string,
      contactIds: string[],
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Delete contacts', profileId, contactIds);

      contactsStore = contactsStore.filter((c) => !contactIds.includes(c._id));
      return { message: 'Contacts deleted successfully' };
    },

    async sendInvitation(
      profileId: string,
      invite: InviteContact,
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Send invitation', profileId, invite);
      return { message: 'Invitation sent successfully' };
    },
  },

  // Leads API
  leads: {
    async filterLeads(
      profileId: string | null,
      filters: LeadFilters,
    ): Promise<Lead[]> {
      await delay();
      console.log('🚧 Mock API: Filter leads', profileId, filters);

      let filteredLeads = [...leadsStore];

      // Apply search filter
      if (filters.search) {
        filteredLeads = filteredLeads.filter(
          (lead) =>
            lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            lead.description
              ?.toLowerCase()
              .includes(filters.search.toLowerCase()),
        );
      }

      // Apply status filter
      if (filters.status && filters.status.length > 0) {
        filteredLeads = filteredLeads.filter(
          (lead) => lead.status && filters.status!.includes(lead.status),
        );
      }

      // Apply priority filter
      if (filters.priority && filters.priority.length > 0) {
        filteredLeads = filteredLeads.filter(
          (lead) => lead.priority && filters.priority!.includes(lead.priority),
        );
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        filteredLeads = filteredLeads.filter(
          (lead) =>
            lead.Tags && lead.Tags.some((tag) => filters.tags!.includes(tag)),
        );
      }

      // Apply pagination
      const start = filters.skip || 0;
      const end = start + (filters.limit || 10);

      return filteredLeads.slice(start, end);
    },

    async addLead(profileId: string, lead: LeadInput): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Add lead', profileId, lead);

      const newLead: Lead = {
        _id: `lead-${Date.now()}`,
        name: lead.name,
        description: lead.description,
        Contacts: lead.Contacts || [],
        mainContact: lead.mainContact,
        amount: lead.amount,
        status: lead.status,
        priority: lead.priority,
        lifeTime: lead.lifeTime,
        Tags: lead.Tags,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      leadsStore.push(newLead);
      return { message: 'Lead added successfully' };
    },

    async updateLead(
      profileId: string,
      leadId: string,
      lead: Partial<LeadInput>,
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Update lead', profileId, leadId, lead);

      const index = leadsStore.findIndex((l) => l._id === leadId);
      if (index !== -1) {
        // Only update specific fields, preserve notes structure
        const { notes, ...updateData } = lead;
        leadsStore[index] = {
          ...leadsStore[index],
          ...updateData,
          updatedAt: new Date().toISOString(),
        };

        // Handle notes separately if provided
        if (notes && Array.isArray(notes) && typeof notes[0] === 'string') {
          // Convert string notes to Note objects
          leadsStore[index].notes = notes.map(
            (noteStr: string, idx: number) => ({
              _id: `note-${Date.now()}-${idx}`,
              note: noteStr,
              createdAt: new Date().toISOString(),
            }),
          );
        }
      }

      return { message: 'Lead updated successfully' };
    },

    async deleteLead(profileId: string, leadId: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Delete lead', profileId, leadId);

      leadsStore = leadsStore.filter((l) => l._id !== leadId);
      return { message: 'Lead deleted successfully' };
    },

    async deleteLeads(profileId: string, leadIds: string[]): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Delete leads', profileId, leadIds);

      leadsStore = leadsStore.filter((l) => !leadIds.includes(l._id));
      return { message: 'Leads deleted successfully' };
    },

    async addNote(
      profileId: string,
      leadId: string,
      note: string,
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Add note', profileId, leadId, note);

      const leadIndex = leadsStore.findIndex((l) => l._id === leadId);
      if (leadIndex !== -1) {
        const newNote: Note = {
          _id: `note-${Date.now()}`,
          note,
          createdAt: new Date().toISOString(),
        };

        if (!leadsStore[leadIndex].notes) {
          leadsStore[leadIndex].notes = [];
        }
        leadsStore[leadIndex].notes!.push(newNote);
      }

      return { message: 'Note added successfully' };
    },
  },

  // Profile API
  profile: {
    async getAllProfiles(userId: string | null): Promise<ProfileData[]> {
      await delay();
      console.log('🚧 Mock API: Get all profiles for user', userId);
      return profilesStore;
    },

    async getProfile(profileId: string | null): Promise<ProfileData> {
      await delay();
      console.log('🚧 Mock API: Get profile', profileId);

      const profile = profilesStore.find((p) => p._id === profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      return profile;
    },

    async createProfile(userId: string, data: profileInput): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Create profile', userId, data);

      const newProfile: ProfileData = {
        _id: `profile-${Date.now()}`,
        status: data.status,
        type: 'individual',
        groupId: 'group-1',
        theme: data.theme || { color: 'blue' },
        firstName: data.firstName,
        fullName: data.fullName || '',
        lastName: data.lastName,
        birthDate: data.birthDate || '',
        gender: data.gender || 'male',
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        activitySector: data.activitySector,
        position: data.position,
        school: data.school,
        profession: data.profession,
        profilePicture: '',
        profileCover: '',
        links: [],
        lockedFeatures: {
          profileCover: false,
          logo: false,
          qrCodeLogo: false,
          displayLogo: false,
          companyName: false,
          activitySector: false,
          position: false,
          school: false,
          profession: false,
          theme: false,
          canAddLinks: true,
          canAddServices: true,
          excludedLinks: [],
        },
      };

      profilesStore.push(newProfile);
      return { message: 'Profile created successfully', data: newProfile };
    },

    async updateProfile(
      profileId: string,
      data: Partial<ProfileData>,
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Update profile', profileId, data);

      const index = profilesStore.findIndex((p) => p._id === profileId);
      if (index !== -1) {
        profilesStore[index] = {
          ...profilesStore[index],
          ...data,
        };
      }

      return { message: 'Profile updated successfully' };
    },

    async deleteProfile(profileId: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Delete profile', profileId);

      profilesStore = profilesStore.filter((p) => p._id !== profileId);
      return { message: 'Profile deleted successfully' };
    },

    async getInsights(
      profileId: string,
      period: { startDate: string; endDate: string },
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Get insights', profileId, period);
      return mockInsights;
    },
  },

  // User API
  user: {
    async updateUser(userId: string, user: Partial<User>): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Update user', userId, user);
      return { message: 'User updated successfully' };
    },
  },

  // Services API
  services: {
    async getServices(profileId: string | null): Promise<Service[]> {
      await delay();
      console.log('🚧 Mock API: Get services for profile', profileId);
      return servicesStore;
    },

    async searchServices(
      params: ServicesSearchParams,
    ): Promise<ServicesData[]> {
      await delay();
      console.log('🚧 Mock API: Search services', params);

      let results = [...mockServicesData];

      if (params.term) {
        results = results.filter(
          (service) =>
            service.name.toLowerCase().includes(params.term!.toLowerCase()) ||
            service.description
              .toLowerCase()
              .includes(params.term!.toLowerCase()),
        );
      }

      const start = params.skip || 0;
      const end = start + (params.limit || 10);

      return results.slice(start, end);
    },

    async addService(profileId: string, service: ServiceInput): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Add service', profileId, service);

      const newService: Service = {
        _id: `service-${Date.now()}`,
        name: service.name,
        description: service.description,
      };

      servicesStore.push(newService);
      return { message: 'Service added successfully' };
    },

    async updateService(
      profileId: string,
      serviceId: string,
      service: ServiceInput,
    ): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Update service', profileId, serviceId, service);

      const index = servicesStore.findIndex((s) => s._id === serviceId);
      if (index !== -1) {
        servicesStore[index] = {
          ...servicesStore[index],
          ...service,
        };
      }

      return { message: 'Service updated successfully' };
    },

    async deleteService(profileId: string, serviceId: string): Promise<any> {
      await delay();
      console.log('🚧 Mock API: Delete service', profileId, serviceId);

      servicesStore = servicesStore.filter((s) => s._id !== serviceId);
      return { message: 'Service deleted successfully' };
    },
  },
};

// Helper function to check if we're in development mode
export const isDevelopmentMode = () => {
  return process.env.NEXT_PUBLIC_SKIP_AUTH === 'true';
};
