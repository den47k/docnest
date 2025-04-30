import { useWorkspace } from '@/lib/contexts/WorkspaceContext';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

export function TeamSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const { teams, currentTeam, updateSelectedWorkspace } =
    useWorkspace();

  const selectedWorkspaceName =
    currentTeam?.id === 'personal'
      ? 'Personal'
      : currentTeam && 'name' in currentTeam
        ? currentTeam.name
        : '';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[150px] justify-between rounded-full"
          title={selectedWorkspaceName}
        >
          <span className="truncate">{selectedWorkspaceName}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search team..." />
          <CommandList>
            <CommandEmpty>No team found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={'personal'}
                onSelect={() => {
                  updateSelectedWorkspace(null);
                  setIsOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    currentTeam ? 'opacity-0' : 'opacity-100',
                  )}
                />
                Personal
              </CommandItem>
              <Separator />
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.id}
                  onSelect={() => {
                    updateSelectedWorkspace(team.id);
                    setIsOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      currentTeam?.id === team.id ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {team.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
