
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  className,
  onComplete,
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const currentIndexRef = useRef(0);
  
  useEffect(() => {
    setDisplayedText('');
    currentIndexRef.current = 0;
    setIsComplete(false);
    
    const interval = setInterval(() => {
      if (currentIndexRef.current < text.length) {
        setDisplayedText(prev => prev + text[currentIndexRef.current]);
        currentIndexRef.current++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);
    
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);
  
  return (
    <div className={cn("font-mono", className)}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
};

export default TypingAnimation;
