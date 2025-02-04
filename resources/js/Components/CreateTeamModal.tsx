import { useState } from 'react';
import { Modal } from './ui/modal';
import { useModal } from '@/contexts/ModalContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { router } from '@inertiajs/react';


export function CreateTeamModal() {
  const { isCreateTeamOpen, closeCreateTeam } = useModal();
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');

  function handleCreateTeam() {
    router.post('/teams', {
      name: teamName,
      description: teamDescription,
    });
    closeCreateTeam();
  }

  return (
    <Modal
      title="Create a new team"
      description="Create a new team to collaborate with your friends and colleagues."
      isOpen={isCreateTeamOpen}
      onClose={closeCreateTeam}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="team-name"
            className="block text-sm font-medium text-gray-700"
          >
            Team name
          </label>
          <div className="mt-1">
            {/* <input
              type="text"
              name="team-name"
              id="team-name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="My Team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            /> */}
            <Input onChange={(e) => setTeamName(e.target.value)} placeholder='My Team' />
          </div>
        </div>
        <div>
          <label
            htmlFor="team-description"
            className="block text-sm font-medium text-gray-700"
          >
            Team description
          </label>
          <div className="mt-1">
            {/* <textarea
              id="team-description"
              name="team-description"
              rows={3}
              className="block w-full max-h-96 rounded-md border border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm"
              placeholder="A short description of your team"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
            ></textarea> */}
            <Textarea onChange={(e) => setTeamDescription(e.target.value)} className='max-h-40' placeholder='A short description of your team'/>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
        <Button onClick={closeCreateTeam} variant='outline'>Cancel</Button>
        <Button onClick={handleCreateTeam}>Create team</Button>
        </div>
      </div>
    </Modal>
  );
}
