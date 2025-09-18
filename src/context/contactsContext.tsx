"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Contact } from "@/types/contact";
import { mockContacts } from "@/mockdata/contacts";

interface ContactsContextType {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  refreshContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, '_id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      try {
        setContacts(mockContacts);
      } catch (err: any) {
        setError(err.message || "Failed to fetch contacts");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const addContact = useCallback((newContact: Omit<Contact, '_id'>) => {
    const contact: Contact = {
      ...newContact,
      _id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setContacts(prev => [...prev, contact]);
  }, []);

  const updateContact = useCallback((id: string, updates: Partial<Contact>) => {
    setContacts(prev =>
      prev.map(contact =>
        contact._id === id ? { ...contact, ...updates } : contact
      )
    );
  }, []);

  const deleteContact = useCallback((id: string) => {
    setContacts(prev => prev.filter(contact => contact._id !== id));
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <ContactsContext.Provider value={{
      contacts,
      isLoading,
      error,
      refreshContacts: fetchContacts,
      addContact,
      updateContact,
      deleteContact
    }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContactsContext = () => {
  const ctx = useContext(ContactsContext);
  if (!ctx) {
    throw new Error("useContactsContext must be used within a ContactsProvider");
  }
  return ctx;
};
