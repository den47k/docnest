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

export type Document = {
  id: string;
  title: string;
  content: string;
  user_id: number;
  team_id: number | null;
  created_at: string;
  updated_at: string;
};

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    teams: Team[];
    currentTeam: Team | null,
    invitations?: TeamInvitation[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
