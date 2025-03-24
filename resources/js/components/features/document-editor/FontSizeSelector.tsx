import { Editor } from '@tiptap/react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';

export function FontSizeSelector({ editor }: { editor: Editor }) {
  const currentFontSize = editor?.getAttributes('textStyle').fontSize
    ? editor?.getAttributes('textStyle').fontSize.replace('px', '')
    : '16';

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);

    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const incrementFontSize = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrementFontSize = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className='flex items-center gap-x-0.5'>
      <button
        className='flex h-7 w-7 items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground'
        onClick={decrementFontSize}
      >
        <MinusIcon className='size-4' />
      </button>
      {isEditing ? (
        <input
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className='h-7 w-10 rounded-md text-sm text-center border border-input hover:bg-accent bg-transparent focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent'
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            // updateFontSize(fontSize);
          }}
          className='h-7 w-10 rounded-md text-sm text-center border border-input hover:bg-accent hover:text-accent-foreground'
        >
          {currentFontSize}
        </button>
      )}
      <button
        className='flex h-7 w-7 items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground'
        onClick={incrementFontSize}
      >
        <PlusIcon className='size-4' />
      </button>
    </div>
  );
}
