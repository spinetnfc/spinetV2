import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Contact } from '@/types/contact';
import { mockContacts } from '@/mockdata/contacts';

interface ContactsState {
  // State
  contacts: Contact[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setContacts: (contacts: Contact[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, '_id'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  refreshContacts: () => Promise<void>;
  clearContacts: () => void;
}

export const useContactsStore = create<ContactsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      contacts: [],
      isLoading: true,
      error: null,

      // Actions
      setContacts: (contacts: Contact[]) => {
        set(
          () => ({
            contacts,
            error: null,
          }),
          false,
          'contacts/setContacts',
        );
      },

      setLoading: (loading: boolean) => {
        set(
          () => ({
            isLoading: loading,
          }),
          false,
          'contacts/setLoading',
        );
      },

      setError: (error: string | null) => {
        set(
          () => ({
            error,
          }),
          false,
          'contacts/setError',
        );
      },

      fetchContacts: async () => {
        const { setLoading, setError, setContacts } = get();

        setLoading(true);
        setError(null);

        // Simulate API delay
        return new Promise((resolve) => {
          setTimeout(() => {
            try {
              setContacts(mockContacts);
              console.log('Contacts fetched successfully');
              resolve();
            } catch (err: any) {
              const errorMessage = err.message || 'Failed to fetch contacts';
              setError(errorMessage);
              console.error('❌ Failed to fetch contacts:', err);
              resolve();
            } finally {
              setLoading(false);
            }
          }, 500);
        });
      },

      addContact: (newContact: Omit<Contact, '_id'>) => {
        const contact: Contact = {
          ...newContact,
          _id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        set(
          (state) => ({
            contacts: [...state.contacts, contact],
            error: null,
          }),
          false,
          'contacts/addContact',
        );

        console.log('Contact added:', contact._id);
      },

      updateContact: (id: string, updates: Partial<Contact>) => {
        set(
          (state) => ({
            contacts: state.contacts.map((contact) =>
              contact._id === id ? { ...contact, ...updates } : contact,
            ),
            error: null,
          }),
          false,
          'contacts/updateContact',
        );

        console.log('Contact updated:', id);
      },

      deleteContact: (id: string) => {
        set(
          (state) => ({
            contacts: state.contacts.filter((contact) => contact._id !== id),
            error: null,
          }),
          false,
          'contacts/deleteContact',
        );

        console.log('Contact deleted:', id);
      },

      refreshContacts: async () => {
        const { fetchContacts } = get();
        console.log('🔄 Refreshing contacts...');
        await fetchContacts();
      },

      clearContacts: () => {
        set(
          () => ({
            contacts: [],
            error: null,
            isLoading: false,
          }),
          false,
          'contacts/clearContacts',
        );

        console.log('🗑️ Contacts cleared');
      },
    }),
    { name: 'ContactsStore' },
  ),
);

// Selector hooks for better performance
export const useContacts = () => useContactsStore((state) => state.contacts);
export const useContactsLoading = () =>
  useContactsStore((state) => state.isLoading);
export const useContactsError = () => useContactsStore((state) => state.error);

// Computed selector for contact count
export const useContactsCount = () =>
  useContactsStore((state) => state.contacts.length);

// Selector for specific contact
export const useContactById = (id: string) =>
  useContactsStore((state) =>
    state.contacts.find((contact) => contact._id === id),
  );

// Action hooks - individual hooks prevent infinite loops
export const useFetchContacts = () =>
  useContactsStore((state) => state.fetchContacts);
export const useAddContact = () =>
  useContactsStore((state) => state.addContact);
export const useUpdateContact = () =>
  useContactsStore((state) => state.updateContact);
export const useDeleteContact = () =>
  useContactsStore((state) => state.deleteContact);
export const useRefreshContacts = () =>
  useContactsStore((state) => state.refreshContacts);
export const useClearContacts = () =>
  useContactsStore((state) => state.clearContacts);
export const useSetContactsError = () =>
  useContactsStore((state) => state.setError);

// Deprecated: Use individual action hooks above to prevent infinite loops
export const useContactsActions = () => ({
  fetchContacts: useContactsStore.getState().fetchContacts,
  addContact: useContactsStore.getState().addContact,
  updateContact: useContactsStore.getState().updateContact,
  deleteContact: useContactsStore.getState().deleteContact,
  refreshContacts: useContactsStore.getState().refreshContacts,
  clearContacts: useContactsStore.getState().clearContacts,
  setError: useContactsStore.getState().setError,
});
