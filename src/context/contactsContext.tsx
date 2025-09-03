"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/authContext";
 import type { Contact } from "@/types/contact";
import { getContacts } from "@/lib/api/contacts";

interface ContactsContextType {
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;
  refreshContacts: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export const ContactsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    if (!user?._id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getContacts(user._id);
      setContacts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <ContactsContext.Provider value={{ contacts, isLoading, error, refreshContacts: fetchContacts }}>
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const ctx = useContext(ContactsContext);
  if (!ctx) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return ctx;
};
