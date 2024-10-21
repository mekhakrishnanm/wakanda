import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCounterProps {
  duration: number; // duration in seconds
  className?: string;
  onTimeUp: () => void;
  isRunning: boolean;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  duration,
  className = '',
  onTimeUp,
  isRunning,
}) => {
  const [displayValue, setDisplayValue] = useState(duration);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const countdown = useCallback(() => {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - lastUpdateTime) / 1000);

    setDisplayValue((prevValue) => {
      const newValue = Math.max(prevValue - elapsedTime, 0);
      if (newValue <= 0) {
        onTimeUp();
        return 0;
      }
      return newValue;
    });

    setLastUpdateTime(currentTime);
  }, [lastUpdateTime, onTimeUp]);

  useEffect(() => {
    let timer: number | null = null;
    if (isRunning && displayValue > 0) {
      timer = window.setInterval(countdown, 1000);
    }
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [countdown, isRunning, displayValue]);

  useEffect(() => {
    setDisplayValue(duration);
    setLastUpdateTime(Date.now());
  }, [duration]);

  return (
    <div className={`relative ${className} btn-1 !px-2`}>
      <AnimatePresence mode='wait'>
        <motion.span
          animate={{ y: 0, opacity: 1 }}
          className='relative font-semibold'
          exit={{ y: -20, opacity: 0 }}
          initial={{ y: 20, opacity: 0 }}
          key={displayValue}
          transition={{ duration: 0.2 }}
        >
          {formatTime(displayValue)}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCounter;
