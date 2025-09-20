import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface SidebarState {
  // State
  isExpanded: boolean;

  // Actions
  toggleSidebar: () => void;
  setIsExpanded: (expanded: boolean) => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isExpanded: true,

        // Actions
        toggleSidebar: () => {
          set(
            (state) => ({
              isExpanded: !state.isExpanded,
            }),
            false,
            'sidebar/toggle',
          );
        },

        setIsExpanded: (expanded: boolean) => {
          set(
            () => ({
              isExpanded: expanded,
            }),
            false,
            'sidebar/setExpanded',
          );
        },

        collapseSidebar: () => {
          set(
            () => ({
              isExpanded: false,
            }),
            false,
            'sidebar/collapse',
          );
        },

        expandSidebar: () => {
          set(
            () => ({
              isExpanded: true,
            }),
            false,
            'sidebar/expand',
          );
        },
      }),
      {
        name: 'sidebar-storage',
        // Persist the sidebar state
        partialize: (state) => ({
          isExpanded: state.isExpanded,
        }),
      },
    ),
    { name: 'SidebarStore' },
  ),
);

// Selector hooks for better performance
export const useIsSidebarExpanded = () =>
  useSidebarStore((state) => state.isExpanded);

// Action hooks - individual hooks prevent infinite loops
export const useToggleSidebar = () =>
  useSidebarStore((state) => state.toggleSidebar);
export const useSetSidebarExpanded = () =>
  useSidebarStore((state) => state.setIsExpanded);
export const useCollapseSidebar = () =>
  useSidebarStore((state) => state.collapseSidebar);
export const useExpandSidebar = () =>
  useSidebarStore((state) => state.expandSidebar);

// Deprecated: Use individual action hooks above to prevent infinite loops
export const useSidebarActions = () => ({
  toggleSidebar: useSidebarStore.getState().toggleSidebar,
  setIsExpanded: useSidebarStore.getState().setIsExpanded,
  collapseSidebar: useSidebarStore.getState().collapseSidebar,
  expandSidebar: useSidebarStore.getState().expandSidebar,
});
