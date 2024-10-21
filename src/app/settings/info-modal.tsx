import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import React from 'react';

const InfoModal = ({
  children,
  data,
  title,
}: {
  title: string;
  children: React.ReactNode;
  data: { heading: string; content: string[] }[];
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='max-w-md max-h-[70svh] p-4 mx-auto before:[content("")] before:absolute before:inset-0 before:z-[-1] before:modalDefaultBg before:rounded-[inherit] rounded-[16px]'>
        <DialogHeader>
          <DialogTitle className='text-left text-xl'>{title}</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-4 overflow-y-auto max-h-[calc(70svh-85px)]'>
          {data.map((item, index) => (
            <div key={index}>
              <h4 className='text-md font-semibold'>{item.heading}</h4>
              <ul className='list-disc list-inside mt-1'>
                {item.content.map((content, index2) => (
                  <li className='text-sm font-normal ml' key={index2}>
                    {content}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoModal;
