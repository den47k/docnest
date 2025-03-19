import { Team, Document } from '@/types';
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type WorkspaceContextType = {
  teams: Team[];
  documents: Document[];
  selectedWorkspace: Team | { id: 'personal' } | null;
  isLoading: boolean;
  isDocumentsLoading: boolean;
  updateSelectedWorkspace: (workspaceId: string | null) => Promise<void>;
  refreshWorkspace: () => Promise<void>;
};

export const WorkspaceContext = createContext<WorkspaceContextType>(null!);

export const WorkspaceProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: teams = [], isLoading: isTeamsLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => axios.get(route('teams.index')).then(res => res.data.teams),
  });

  const { data: currentTeam, isLoading: isCurrentTeamLoading } = useQuery({
    queryKey: ['current-team'],
    queryFn: () => axios.get(route('teams.current')).then(res => res.data.currentTeam),
  });

  const { data: documents = [], isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['documents', currentTeam?.id],
    queryFn: () => axios.get(route('documents.index'), {
      params: { team_id: currentTeam.id === 'personal' ? null : currentTeam.id }
    }).then(res => res.data.data),
    enabled: !!currentTeam,
  });

  const updateSelectedWorkspace = async (workspaceId: string | null) => {
    try {
      const { data } = await axios.post(route('teams.select'), {
        team_id: workspaceId ?? null,
      });

      queryClient.setQueryData(['current-team'], () => data.currentTeam);
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    }
  };

  const refreshWorkspace = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['teams', 'current-team'] }),
    ]);
  };

  const value = {
    teams,
    documents,
    selectedWorkspace: currentTeam,
    isLoading: isTeamsLoading || isCurrentTeamLoading,
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
