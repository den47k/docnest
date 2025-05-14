import {
  MoreHorizontal,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { useState } from 'react';

import { CreateTeamModalTrigger } from '@/components/features/teams/CreateTeamModal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';

// Types
interface Member {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}

interface Team {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  members: Member[];
  documentsCount: number;
  membersCount: number;
}

// Role definitions with permissions
const roleDefinitions = {
  owner: {
    name: 'Owner',
    icon: <ShieldAlert className="h-4 w-4 text-rose-500" />,
    color: 'bg-rose-100 text-rose-800',
    description: 'Full access to all team settings and can manage members',
    permissions: [
      'Manage team settings',
      'Add/remove members',
      'Assign roles',
      'Delete team',
      'Create/edit/delete documents',
      'Invite new members',
    ],
  },
  admin: {
    name: 'Admin',
    icon: <ShieldCheck className="h-4 w-4 text-amber-500" />,
    color: 'bg-amber-100 text-amber-800',
    description: 'Can manage members and most team settings',
    permissions: [
      'Add/remove members',
      'Assign roles (except owner)',
      'Create/edit/delete documents',
      'Invite new members',
    ],
  },
  editor: {
    name: 'Editor',
    icon: <Shield className="h-4 w-4 text-emerald-500" />,
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Can create and edit documents',
    permissions: [
      'Create/edit documents',
      'Share documents',
    ],
  },
  viewer: {
    name: 'Viewer',
    icon: <Shield className="h-4 w-4 text-blue-500" />,
    color: 'bg-blue-100 text-blue-800',
    description: 'Can only view documents',
    permissions: ['View documents'],
  },
};

export default function TeamsPage({
  teams,
  selectedTeam,
  currentUserRole,
  canManageTeam,
}: {
  teams: Team[];
  selectedTeam: Team;
  currentUserRole?: 'owner' | 'admin' | 'editor' | 'viewer';
  canManageTeam?: boolean;
}) {
  const { user } = usePage().props.auth;
  // const [teams, setTeams] = useState<Team[]>(mockTeams);
  // const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('editor');

  const handleChangeRole = (userId: number, newRole: string) => {
    if (!selectedTeam) return;

    router.put(
      route('teams.members.change-role', {
        team: selectedTeam.id,
        user: userId,
      }),
      {
        role: newRole,
      },
      {
        preserveScroll: true,
      },
    );
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !selectedTeam) return;

    router.post(
      route('teams.members.invite', {
        team: selectedTeam.id,
      }),
      {
        email: inviteEmail,
        role: inviteRole,
      },
      {
        preserveScroll: true,
        onSuccess: () => setInviteDialogOpen(false),
      },
    );
  };

  const handleRemoveMember = (userId: number) => {
    if (!selectedTeam) return;

    router.delete(
      route('teams.members.remove', {
        team: selectedTeam.id,
        user: userId,
      }),
      {
        preserveScroll: true,
      },
    );
  };

  const handleUpdateTeam = () => {
    if (!selectedTeam) return;

    router.put(route('teams.update', {
      team: selectedTeam.id
    }), {
      name: (document.getElementById('team-name-settings') as HTMLInputElement).value,
      description: (document.getElementById('team-description-settings') as HTMLInputElement).value,
    }, {
      preserveScroll: true
    });
  };

  const handleDeleteTeam = () => {
    if (!selectedTeam) return;

    router.delete(route('teams.destroy', {
      team: selectedTeam.id
    }), {
      preserveScroll: true,
      onSuccess: () => router.visit(route('teams.index'))
    });
  };

  const filteredMembers =
    selectedTeam?.members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];
  const isOwner = currentUserRole === 'owner';

  return (
    <AuthenticatedLayout showExtras={false}>
      <Head title={selectedTeam ? selectedTeam.name : 'Teams'} />
      <main className="container mx-auto max-w-[1200px] space-y-8 px-4 py-6">
        <div className="flex flex-col space-y-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Team Management
            </h1>
            <p className="text-muted-foreground">
              Manage your teams, members, and their access permissions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            {/* Teams Sidebar */}
            <div className="space-y-4 md:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Your Teams</h2>
                <CreateTeamModalTrigger />
              </div>

              <div className="space-y-2">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                      selectedTeam?.id === team.id ? 'border-primary' : ''
                    }`}
                    onClick={() =>
                      router.get(route('teams.show', { team: team.id }))
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="truncate font-medium">{team.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {team.membersCount} members
                          </p>
                        </div>
                        <Badge variant="outline">
                          {team.documentsCount} docs
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-9">
              {selectedTeam ? (
                <Tabs defaultValue="members" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <TabsList>
                      <TabsTrigger value="members">
                        <Users className="mr-2 h-4 w-4" />
                        Members
                      </TabsTrigger>
                      <TabsTrigger value="settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    {canManageTeam && (
                      <Dialog
                        open={inviteDialogOpen}
                        onOpenChange={setInviteDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite a team member</DialogTitle>
                            <DialogDescription>
                              Invite someone to join the {selectedTeam.name}{' '}
                              team.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <label
                                htmlFor="email"
                                className="text-sm font-medium"
                              >
                                Email address
                              </label>
                              <Input
                                id="email"
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@example.com"
                              />
                            </div>
                            <div className="grid gap-2">
                              <label
                                htmlFor="role"
                                className="text-sm font-medium"
                              >
                                Role
                              </label>
                              <Select
                                value={inviteRole}
                                onValueChange={setInviteRole}
                              >
                                <SelectTrigger id="role">
                                  <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {isOwner && (
                                    <SelectItem value="admin">Admin</SelectItem>
                                  )}
                                  <SelectItem value="editor">Editor</SelectItem>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                </SelectContent>
                              </Select>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {
                                  roleDefinitions[
                                    inviteRole as keyof typeof roleDefinitions
                                  ].description
                                }
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setInviteDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleInviteMember}>
                              Send Invitation
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>

                  <TabsContent value="members" className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle>Team Members</CardTitle>
                          <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="search"
                              placeholder="Search members..."
                              className="pl-8"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        <CardDescription>
                          Manage members and their roles in {selectedTeam.name}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => {
                              const isCurrentUser = user.id === member.id;
                              const isOwnerMember = member.role === 'owner';
                              const showRoleActions = canManageTeam && !isCurrentUser && (isOwner ? true : !isOwnerMember);
                              const showOwnerActions = isOwner && !isCurrentUser;
                              const showAdminActions =
                                currentUserRole === 'admin' &&
                                ['editor', 'viewer'].includes(member.role);

                              return (
                                <div
                                  key={member.id}
                                  className="flex items-center justify-between py-2"
                                >
                                  <div className="flex items-center gap-3">
                                    <Avatar>
                                      <AvatarFallback>
                                        {member.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .toUpperCase()
                                          .slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="font-medium">
                                        {member.name}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {member.email}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <Badge
                                      variant="outline"
                                      className={`flex items-center gap-1 ${roleDefinitions[member.role].color}`}
                                    >
                                      {roleDefinitions[member.role].icon}
                                      {roleDefinitions[member.role].name}
                                    </Badge>

                                    {showRoleActions && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">
                                              Actions
                                            </span>
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          {(showOwnerActions ||
                                            showAdminActions) && (
                                            <>
                                              <DropdownMenuLabel>
                                                Change Role
                                              </DropdownMenuLabel>

                                              {showOwnerActions &&
                                                member.role !== 'owner' && (
                                                  <DropdownMenuItem
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                      handleChangeRole(
                                                        member.id,
                                                        'owner',
                                                      )
                                                    }
                                                  >
                                                    <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />
                                                    Make Owner
                                                  </DropdownMenuItem>
                                                )}

                                              {showOwnerActions && member.role !== 'admin' && (
                                                <DropdownMenuItem
                                                  className="cursor-pointer"
                                                  onClick={() =>
                                                    handleChangeRole(
                                                      member.id,
                                                      'admin',
                                                    )
                                                  }
                                                >
                                                  <ShieldCheck className="mr-2 h-4 w-4 text-amber-500" />
                                                  Make Admin
                                                </DropdownMenuItem>
                                              )}

                                              {(showOwnerActions || showAdminActions) && member.role !== 'editor' && (
                                                <DropdownMenuItem
                                                  className="cursor-pointer"
                                                  onClick={() =>
                                                    handleChangeRole(
                                                      member.id,
                                                      'editor',
                                                    )
                                                  }
                                                >
                                                  <Shield className="mr-2 h-4 w-4 text-emerald-500" />
                                                  Make Editor
                                                </DropdownMenuItem>
                                              )}

                                              {(showOwnerActions || showAdminActions) && member.role !== 'viewer' && (
                                                <DropdownMenuItem
                                                  className="cursor-pointer"
                                                  onClick={() =>
                                                    handleChangeRole(
                                                      member.id,
                                                      'viewer',
                                                    )
                                                  }
                                                >
                                                  <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                                  Make Viewer
                                                </DropdownMenuItem>
                                              )}
                                            </>
                                          )}

                                          {(showOwnerActions || showAdminActions) && (
                                            <>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                className="cursor-pointer text-red-600"
                                                onClick={() => handleRemoveMember(member.id)}
                                              >
                                                Remove from team
                                              </DropdownMenuItem>
                                            </>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="py-4 text-center text-muted-foreground">
                              No members found matching your search
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Role Permissions</CardTitle>
                        <CardDescription>
                          Understanding what each role can do in your team
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {Object.entries(roleDefinitions).map(
                            ([role, definition]) => (
                              <div key={role} className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {definition.icon}
                                  <h3 className="font-semibold">
                                    {definition.name}
                                  </h3>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {definition.description}
                                </p>
                                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                                  {definition.permissions.map(
                                    (permission, i) => (
                                      <div
                                        key={i}
                                        className="flex items-center gap-2 text-sm"
                                      >
                                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        {permission}
                                      </div>
                                    ),
                                  )}
                                </div>
                                {role !== 'viewer' && (
                                  <Separator className="mt-4" />
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Settings</CardTitle>
                        <CardDescription>
                          Manage your team's basic information
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-2">
                          <label
                            htmlFor="team-name-settings"
                            className="text-sm font-medium"
                          >
                            Team Name
                          </label>
                          <Input
                            id="team-name-settings"
                            defaultValue={selectedTeam.name}
                            disabled={!isOwner}
                          />
                        </div>
                        <div className="grid gap-2">
                          <label
                            htmlFor="team-description-settings"
                            className="text-sm font-medium"
                          >
                            Description
                          </label>
                          <Input
                            id="team-description-settings"
                            defaultValue={selectedTeam.description || ''}
                            disabled={!isOwner}
                            placeholder="No description provided"
                          />
                        </div>
                        <div className="grid gap-2">
                          <p className="text-sm font-medium">Team Created</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              selectedTeam.createdAt,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                      {isOwner && (
                        <CardFooter className="flex justify-between border-t pt-6">
                          <Button variant="destructive" onClick={handleDeleteTeam}>
                            Delete Team
                          </Button>
                          <Button onClick={handleUpdateTeam}>
                            Save Changes
                          </Button>
                        </CardFooter>
                      )}
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <Card className="flex h-[400px] items-center justify-center">
                  <CardContent className="text-center">
                    <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">
                      No Team Selected
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select a team from the sidebar or create a new one
                    </p>
                    <CreateTeamModalTrigger className="mt-4 w-36" />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
