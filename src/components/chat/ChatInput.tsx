'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Type a message..." }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-bg-secondary p-4">
      <div className="flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-bg-tertiary border border-border rounded-lg px-4 py-3 
                     text-sm text-text-primary placeholder:text-text-muted
                     focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                     disabled:opacity-50 disabled:cursor-not-allowed
                     min-h-[46px] max-h-[120px]"
        />
        <Button 
          type="submit" 
          disabled={!message.trim() || disabled}
          className="h-[46px] px-6"
        >
          Send
        </Button>
      </div>
      <p className="text-xs text-text-muted mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
