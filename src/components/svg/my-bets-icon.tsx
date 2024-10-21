import React from 'react';

const MyBetsIcon = ({ ...props }) => {
  return (
    <svg
      fill='none'
      height='35'
      viewBox='0 0 32 35'
      width='32'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <title>icon</title>
      <g filter='url(#filter0_d_12644_3024)'>
        <path
          clipRule='evenodd'
          d='M8.55907 3.87841C5.99586 4.14782 4.13636 6.4441 4.40577 9.00731C4.41542 9.09917 4.42768 9.19011 4.44245 9.2801L5.51812 19.5144C5.74223 21.6468 5.91973 23.3357 6.23636 24.6388C6.56223 25.9798 7.0633 27.0404 8.02288 27.8175C8.98244 28.5945 10.124 28.8641 11.5035 28.9041C12.844 28.9428 14.533 28.7653 16.6653 28.5412L17.9565 28.4055C20.0888 28.1814 21.7777 28.0039 23.0808 27.6873C24.422 27.3613 25.4825 26.8603 26.2595 25.9008C27.0365 24.9412 27.3062 23.7996 27.3461 22.42C27.3849 21.0796 27.2073 19.3907 26.9832 17.2583L26.4885 12.5518C26.3033 10.7896 24.7246 9.51117 22.9624 9.69639L22.8709 8.82619C22.7026 7.22418 21.2674 6.062 19.6654 6.23037L9.80305 7.26694C9.16225 7.33429 8.69738 7.90837 8.76473 8.54917C8.83208 9.18997 9.40615 9.65484 10.047 9.58749L19.9093 8.55092C20.2297 8.51724 20.5167 8.74969 20.5504 9.07009L20.6114 9.65022L9.29077 10.8401C8.00916 10.9748 6.86102 10.045 6.72632 8.76341C6.59162 7.48181 7.52136 6.33366 8.80297 6.19896L22.7263 4.73556C23.3671 4.66821 23.832 4.09413 23.7646 3.45334C23.6973 2.81254 23.1232 2.34766 22.4824 2.41501L8.55907 3.87841ZM19.6941 17.665C20.1747 17.6145 20.5234 17.1839 20.4728 16.7033C20.4223 16.2228 19.9918 15.8741 19.5112 15.9246L12.5496 16.6563C12.069 16.7068 11.7203 17.1374 11.7708 17.618C11.8213 18.0985 12.2519 18.4472 12.7325 18.3967L19.6941 17.665ZM17.4798 21.7103C17.5303 22.1909 17.1817 22.6214 16.7011 22.672L13.2203 23.0378C12.7397 23.0883 12.3091 22.7396 12.2586 22.2591C12.2081 21.7785 12.5568 21.3479 13.0374 21.2974L16.5182 20.9315C16.9987 20.881 17.4293 21.2297 17.4798 21.7103Z'
          fill='url(#paint0_linear_12644_3024)'
          fillRule='evenodd'
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
          height='38.7734'
          id='filter0_d_12644_3024'
          width='38.7734'
          x='-3.38672'
          y='-1.38672'
        >
          <feFlood floodOpacity='0' result='BackgroundImageFix' />
          <feColorMatrix
            in='SourceAlpha'
            result='hardAlpha'
            type='matrix'
            values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
          />
          <feOffset dy='2' />
          <feGaussianBlur stdDeviation='2' />
          <feComposite in2='hardAlpha' operator='out' />
          <feColorMatrix
            type='matrix'
            values='0 0 0 0 0.0156863 0 0 0 0 0.0980392 0 0 0 0 0.0784314 0 0 0 0.24 0'
          />
          <feBlend
            in2='BackgroundImageFix'
            mode='normal'
            result='effect1_dropShadow_12644_3024'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_12644_3024'
            mode='normal'
            result='shape'
          />
        </filter>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint0_linear_12644_3024'
          x1='14.6545'
          x2='17.3069'
          y1='3.23776'
          y2='28.4738'
        >
          <stop stopColor={props?.isActive ? '#F9F9F9' : '#77E5CA'} />
          <stop
            offset='1'
            stopColor={props?.isActive ? '#77E5CA' : '#4534C1'}
          />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MyBetsIcon;
