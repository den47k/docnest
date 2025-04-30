import { Document, Team } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useContext } from 'react';

type WorkspaceContextType = {
  teams: Team[];
  documents: Document[];
  currentTeam: Team | { id: 'personal' };
  isLoading: boolean;
  isDocumentsLoading: boolean;
  updateSelectedWorkspace: (workspaceId: string | null) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
};

export const WorkspaceContext = createContext<WorkspaceContextType>(null!);

export const WorkspaceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const { data: workspaceData, isLoading: isWorkspaceLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await axios.get(route('teams.index'));
      return {
        teams: response.data.teams as Team[],
        currentTeam: response.data.current_team as Team | { id: 'personal' },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: documents = [], isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['documents', workspaceData?.currentTeam.id],
    queryFn: async () => {
      const response = await axios.get(route('documents.index'), {
        params: {
          team_id:
            workspaceData?.currentTeam.id === 'personal'
              ? null
              : workspaceData?.currentTeam.id,
        },
      });
      return response.data.data as Document[];
    },
    enabled: !!workspaceData?.currentTeam,
  });

  const updateSelectedWorkspace = async (workspaceId: string | null) => {
    try {
      const { data } = await axios.post(route('teams.select'), {
        team_id: workspaceId ?? null,
      });

      queryClient.setQueryData(['workspaces'], (prev: any) => ({
        ...prev,
        currentTeam: data.current_team,
      }));

      queryClient.invalidateQueries({ queryKey: ['documents'] });
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      throw error;
    }
  };

  const refreshWorkspace = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['teams', 'current-team'] }),
    ]);
  };

  const value = {
    teams: workspaceData?.teams || [],
    documents,
    currentTeam: workspaceData?.currentTeam || { id: 'personal' },
    isLoading: isWorkspaceLoading,
    isDocumentsLoading,
    updateSelectedWorkspace,
    refreshWorkspace,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined)
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
}
