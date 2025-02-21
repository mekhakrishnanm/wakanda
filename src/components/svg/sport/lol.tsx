import React from 'react';

const LolIcon = ({ ...props }) => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M2.52 6.83c0-.1-.12-.12-.16-.04a8.09 8.09 0 0 0 0 7.28c.04.09.16.06.16-.04v-7.2ZM10 2.14c-.62 0-1.21.06-1.8.18a.27.27 0 0 0-.2.26v.74c0 .18.17.3.34.27A7.4 7.4 0 0 1 10 3.4a7.1 7.1 0 0 1 7.2 7.01c0 1.72-.64 3.3-1.7 4.52a.28.28 0 0 0-.05.1L15 16.56c-.07.25.2.43.4.28a8.2 8.2 0 0 0 3.09-6.4 8.4 8.4 0 0 0-8.5-8.3Z'
        fill='currentColor'
      />
      <path
        d='M8 14.74h6.52c.09 0 .18-.04.24-.1a6.15 6.15 0 0 0 1.68-4.23 6.36 6.36 0 0 0-7.8-6.13.83.83 0 0 0-.64.83v9.63Z'
        fill='currentColor'
      />
      <path
        d='M7.23 1.45c0-.25-.2-.45-.45-.45H3.1a.45.45 0 0 0-.4.65l.55 1.11c.03.06.04.13.04.2v14.08c0 .07-.01.14-.04.2l-.55 1.11c-.15.3.07.65.4.65h10.07c.2 0 .38-.13.43-.33l.75-2.6a.45.45 0 0 0-.43-.58H7.68a.45.45 0 0 1-.45-.45V1.45Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default LolIcon;
