import React from 'react';

const FootballIcon = ({ ...props }) => {
  return (
    <svg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0Zm4.143-4.97a5.52 5.52 0 0 0-1.888 1.473l.647 2.104 1.006.335L7.5 5.352V4.268L5.643 3.029v.001ZM2.536 8.634c.1.865.4 1.67.853 2.365h1.904l.635-.635-.823-2.47-1.024-.341-1.545 1.08v.001Zm4.35 4.752a5.525 5.525 0 0 0 2.228 0l.79-1.776-.611-.61H6.707l-.61.61.789 1.777v-.001ZM12.61 11c.44-.674.736-1.45.844-2.285L11.91 7.557l-1.015.338-.823 2.47.635.635h1.903Zm-.378-6.513a5.52 5.52 0 0 0-1.875-1.458L8.5 4.268v1.084l2.092 1.59 1.004-.334.636-2.121Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default FootballIcon;
