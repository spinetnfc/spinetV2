import { useState, useEffect } from 'react';
import { mockContacts } from '@/mockdata/contacts';
import { mockLeads } from '@/mockdata/leads';
import { mockProfiles } from '@/mockdata/profiles';
import { mockServices } from '@/mockdata/services';

// Generic mock data hook with loading simulation
function useMockData<T>(data: T[], delay: number = 500) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(data);
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  return { data: items, isLoading, error, setItems };
}

// Contact hooks
export const useContacts = () => {
  return useMockData(mockContacts);
};

export const useContact = (id: string) => {
  const { data: contacts, isLoading } = useContacts();
  const contact = contacts.find((c) => c._id === id);

  return {
    data: contact || null,
    isLoading,
    error: !contact && !isLoading ? 'Contact not found' : null,
  };
};

// Lead hooks
export const useLeads = () => {
  return useMockData(mockLeads);
};

export const useLead = (id: string) => {
  const { data: leads, isLoading } = useLeads();
  const lead = leads.find((l) => l._id === id);

  return {
    data: lead || null,
    isLoading,
    error: !lead && !isLoading ? 'Lead not found' : null,
  };
};

// Profile hooks
export const useProfiles = () => {
  return useMockData(mockProfiles);
};

export const useProfile = (id: string) => {
  const { data: profiles, isLoading } = useProfiles();
  const profile = profiles.find((p) => p._id === id);

  return {
    data: profile || null,
    isLoading,
    error: !profile && !isLoading ? 'Profile not found' : null,
  };
};

// Service hooks
export const useServices = () => {
  return useMockData(mockServices);
};

export const useService = (id: string) => {
  const { data: services, isLoading } = useServices();
  const service = services.find((s) => s._id === id);

  return {
    data: service || null,
    isLoading,
    error: !service && !isLoading ? 'Service not found' : null,
  };
};

// CRUD operations for development (these just update local state)
export const useMockCRUD = <T extends { _id: string }>(
  items: T[],
  setItems: React.Dispatch<React.SetStateAction<T[]>>,
) => {
  const create = (newItem: Omit<T, '_id'>) => {
    const item = {
      ...newItem,
      _id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    } as T;

    setItems((prev) => [...prev, item]);
    return Promise.resolve(item);
  };

  const update = (id: string, updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, ...updates } : item)),
    );
    return Promise.resolve();
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
    return Promise.resolve();
  };

  return { create, update, remove };
};
