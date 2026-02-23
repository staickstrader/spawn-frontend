'use client';

import { useState, useEffect } from 'react';

const commands = [
  'spawning agent...',
  'connecting to Base...',
  'deploying $TICKER...',
  'agent.think()',
  'heartbeat: OK',
  'cycle 142 complete',
  'swapping tokens...',
  'agent.evolve()',
];

export function TerminalTyping() {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const command = commands[currentCommand];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentChar < command.length) {
          setCurrentChar(currentChar + 1);
        } else {
          // Pause before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentChar > 0) {
          setCurrentChar(currentChar - 1);
        } else {
          setIsDeleting(false);
          setCurrentCommand((currentCommand + 1) % commands.length);
        }
      }
    }, isDeleting ? 30 : 80);

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentCommand]);

  const displayText = commands[currentCommand].slice(0, currentChar);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary border border-border font-mono text-sm">
      <span className="text-accent">$</span>
      <span className="text-text-primary">{displayText}</span>
      <span className="w-2 h-5 bg-accent cursor-blink" />
    </div>
  );
}
