import React from 'react';

const SettingsIcon = ({ ...props }) => {
  return (
    <svg
      fill='none'
      height='34'
      viewBox='0 0 34 34'
      width='34'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <title>icon</title>
      <g filter='url(#filter0_d_12646_4946)'>
        <path
          clipRule='evenodd'
          d='M22.7025 5.22138C22.1052 5.09865 21.372 5.02159 20.4783 4.92768L15.8973 4.4462C15.0037 4.35226 14.2703 4.27517 13.6606 4.27105C13.0222 4.26672 12.4511 4.34006 11.8917 4.58809C11.3323 4.83617 10.8948 5.21013 10.4699 5.68614C10.0644 6.14052 9.63028 6.73541 9.10149 7.46003L6.41438 11.1422C5.88348 11.8697 5.44763 12.4669 5.13773 12.9936C4.81309 13.5453 4.59001 14.078 4.52583 14.6887C4.46165 15.2993 4.56909 15.8668 4.77193 16.4739C4.96555 17.0536 5.26771 17.7283 5.63576 18.5503L7.49856 22.7106C7.86514 23.5293 8.16607 24.2016 8.46831 24.7303C8.7849 25.2843 9.13506 25.741 9.6307 26.1C10.1263 26.4589 10.6697 26.6494 11.2951 26.7779C11.8923 26.9006 12.6257 26.9776 13.5194 27.0716L18.1002 27.553C18.9939 27.647 19.7272 27.7241 20.3369 27.7282C20.9754 27.7325 21.5466 27.6592 22.1059 27.4112C22.6653 27.1631 23.1028 26.7891 23.5277 26.3131C23.9331 25.8588 24.3673 25.2639 24.896 24.5393L27.5833 20.8571C28.1142 20.1296 28.55 19.5323 28.8599 19.0057C29.1845 18.454 29.4076 17.9212 29.4718 17.3106C29.5359 16.6999 29.4285 16.1325 29.2257 15.5253C29.0321 14.9458 28.7299 14.271 28.3619 13.449L26.4991 9.28859C26.1324 8.46985 25.8315 7.79773 25.5293 7.26895C25.2127 6.71501 24.8625 6.25825 24.3669 5.89929C23.8714 5.54038 23.328 5.34991 22.7025 5.22138ZM16.572 20.0606C18.8148 20.2963 20.824 18.6693 21.0598 16.4264C21.2955 14.1836 19.6684 12.1744 17.4256 11.9387C15.1828 11.7029 13.1736 13.33 12.9378 15.5728C12.7021 17.8156 14.3292 19.8249 16.572 20.0606Z'
          fill='url(#paint0_linear_12646_4946)'
          fillRule='evenodd'
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
          height='38.7734'
          id='filter0_d_12646_4946'
          width='38.7734'
          x='-2.38672'
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
            result='effect1_dropShadow_12646_4946'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_12646_4946'
            mode='normal'
            result='shape'
          />
        </filter>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint0_linear_12646_4946'
          x1='18.1878'
          x2='15.8098'
          y1='4.68694'
          y2='27.3123'
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

export default SettingsIcon;
