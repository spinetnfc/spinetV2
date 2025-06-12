'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

type SidebarContextType = {
    isExpanded: boolean;
    toggleSidebar: () => void;
    setIsExpanded: (expanded: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const toggleSidebar = () => setIsExpanded((prev) => !prev);

    return (
        <SidebarContext.Provider value={{ isExpanded, toggleSidebar, setIsExpanded }}>
            {children}
        </SidebarContext.Provider>
    );
};
