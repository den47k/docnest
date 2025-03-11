export type Team = {
  id: string;
  owner_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot: {
    user_id: number;
    team_id: number;
    role: string;
  };
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    teams: Team[];
    selectedTeam: Team | null,
}

export type TeamInvitation = {
  invitation_id: string;
  team_id: number;
  team_name: string;
  inviter_id: number;
  inviter_name: string;
  inviter_email: string;
  email: string;
  message: string;
  toastId?: string;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    invitations?: TeamInvitation[];
};
