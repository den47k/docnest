import { useWorkspace } from '@/lib/contexts/WorkspaceContext';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';

export function TeamSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    teams,
    selectedWorkspace,
    updateSelectedWorkspace,
    isLoading
  } = useWorkspace();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[150px] justify-between rounded-full"
        >
          {selectedWorkspace?.id === 'personal'
            ? 'Personal'
            : selectedWorkspace && 'name' in selectedWorkspace
            ? selectedWorkspace.name
            : ''}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                    selectedWorkspace ? 'opacity-0' : 'opacity-100',
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
                      selectedWorkspace?.id === team.id
                        ? 'opacity-100'
                        : 'opacity-0',
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
