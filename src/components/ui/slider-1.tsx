'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider1 = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    ref={ref}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-2 w-full grow overflow-hidden rounded-full bg-[#211E1F]/10'>
      <SliderPrimitive.Range className='absolute h-full bg-[#211E1F]' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='slider-thumb-1' />
  </SliderPrimitive.Root>
));
Slider1.displayName = SliderPrimitive.Root.displayName;

export { Slider1 };
