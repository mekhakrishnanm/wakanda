import React from 'react';

const CodIcon = ({ ...props }) => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path
        d='M2.2 2v2.464c.177.402.357.804.533 1.205v4.258c-.176.402-.353.804-.527 1.209v3.655l3.654 1.613V2H2.2ZM6.364 2c-.006 4.866-.01 9.736-.015 14.602v.006L9.443 18V2h-3.08ZM17.2 4.464V2h-3.657v14.404l3.654-1.613v-3.655c-.177-.402-.353-.807-.527-1.209v-4.26l.53-1.203ZM13.037 2h-3.08v16l3.095-1.392v-.006c-.003-4.866-.01-9.736-.015-14.602Z'
        fill='currentColor'
      />
    </svg>
  );
};

export default CodIcon;
