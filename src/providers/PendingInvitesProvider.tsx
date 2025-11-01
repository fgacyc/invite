import React, { createContext, useContext, ReactNode } from "react";

interface PendingInvite {
  cg_id: string;
  status: string;
  created_at: string;
  connect_group: {
    id: string;
    name: string;
    satellite: {
      id: string;
      name: string;
    };
  };
}

interface PendingInvitesContextType {
  pendingInvitesMap: Map<string, PendingInvite>;
}

const PendingInvitesContext = createContext<
  PendingInvitesContextType | undefined
>(undefined);

export const PendingInvitesProvider: React.FC<{
  children: ReactNode;
  pendingInvitesMap: Map<string, PendingInvite>;
}> = ({ children, pendingInvitesMap }) => {
  return (
    <PendingInvitesContext.Provider value={{ pendingInvitesMap }}>
      {children}
    </PendingInvitesContext.Provider>
  );
};

export const usePendingInvites = () => {
  const context = useContext(PendingInvitesContext);
  return context; // Return undefined if not in context
};

