import React from 'react';

const CryptoSVG = ({ ...props }) => {
  return (
    <svg viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg' {...props}>
      <rect
        fill='currentColor'
        height='9.30232'
        rx='1'
        transform='matrix(0.86601 -0.500028 -3.18907e-05 1 10.917 10.6978)'
        width='9.30233'
      />
      <rect
        fill='currentColor'
        height='9.30233'
        rx='1'
        transform='matrix(0.866041 -0.499972 0.866041 0.499972 1.92969 4.65112)'
        width='9.30233'
      />
      <rect
        fill='currentColor'
        height='9.30232'
        rx='1'
        transform='matrix(0.86601 0.500028 3.18907e-05 1 1 6.04663)'
        width='9.30233'
      />
    </svg>
  );
};

export default CryptoSVG;
