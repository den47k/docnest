import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorMessage } from '@hookform/error-message';
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Modal } from '../ui/modal';
import { Textarea } from '../ui/textarea';
import { useModal } from '@/lib/contexts/ModalContext';

import { router } from '@inertiajs/react';
import { PlusCircle, X } from 'lucide-react';

enum TeamRole {
  admin = 'admin',
  editor = 'editor',
  viewer = 'viewer',
}

type InviteMember = {
  email: string;
  role: TeamRole;
};

type FormInput = {
  teamName: string;
  teamDescription: string;
  invites: InviteMember[];
};


export function CreateTeamModal() {
  const { isOpen, closeModal } = useModal();
  const isCreateTeamOpen = isOpen('createTeam');

  const {
    register,
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<FormInput>({
    defaultValues: {
      teamName: '',
      teamDescription: '',
      invites: [{ email: '', role: TeamRole.viewer }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'invites',
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    router.post(route('teams.store'), data, {
      onSuccess: () => {
        handleClose();
      }
    });
  };

  const handleClose = () => {
    reset({
      teamName: '',
      teamDescription: '',
      invites: [{ email: '', role: TeamRole.viewer }],
    });

    clearErrors();

    closeModal('createTeam');
  };

  return (
    <Modal
      title="Create a new team"
      description="Create a new team to collaborate with your friends and colleagues."
      isOpen={isCreateTeamOpen}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label>Team Name</Label>
            <Input
              className="mt-1"
              {...register('teamName', { required: 'Team name is required' })}
              placeholder="My Team"
            />
            <ErrorMessage
              errors={errors}
              name="teamName"
              render={({ message }) => (
                <p className="mt-1 text-sm text-red-500">{message}</p>
              )}
            />
          </div>
          <div>
            <Label>Team description</Label>
            <Textarea
              className="mt-1 max-h-40"
              {...register('teamDescription', {
                required: 'Team description is required',
              })}
              placeholder="A short description of your team"
            />
            <ErrorMessage
              errors={errors}
              name="teamDescription"
              render={({ message }) => (
                <p className="mt-1 text-sm text-red-500">{message}</p>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Invite Team Members</Label>
            {fields.map((invite, index) => (
              <div key={invite.id} className="flex items-center space-x-2">
                <Input
                  placeholder="Email"
                  {...register(`invites.${index}.email`, {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />

                <Controller
                  name={`invites.${index}.role`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[110px]">
                        <SelectValue placeholder="Viewer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {fields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ email: '', role: TeamRole.viewer })}
                className="w-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Invite
              </Button>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={handleClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit">Create team</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export function CreateTeamModalTrigger() {
  const { openModal } = useModal();

  return (
    <button className="flex w-full h-full" onClick={() => openModal('createTeam')}>
      New Team
    </button>
  );
}
