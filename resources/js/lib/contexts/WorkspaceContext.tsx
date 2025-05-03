import { Team, User } from '@/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { createContext, useContext } from 'react';

type WorkspaceContextType = {
  teams: Team[];
  currentTeam: Team | { id: 'personal' };
  isLoading: boolean;
  updateSelectedWorkspace: (workspaceId: string | null) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
};

export const WorkspaceContext = createContext<WorkspaceContextType>(null!);

export const WorkspaceProvider = ({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) => {
  const queryClient = useQueryClient();

  const {
    data: workspaceData,
    isLoading: isWorkspaceLoading,
    refetch: refetchWorkspaces,
  } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await axios.get(route('teams.index'));
      return {
        teams: response.data.teams as Team[],
        currentTeam: response.data.current_team as Team | { id: 'personal' },
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      throw error;
    }
  };

  const refreshWorkspace = async () => {
    await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
  };

  const value = {
    teams: workspaceData?.teams || [],
    currentTeam: workspaceData?.currentTeam || { id: 'personal' },
    isLoading: isWorkspaceLoading,
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
  if (!context)
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  return context;
}
