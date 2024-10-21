import React from 'react';

const HomeIcon = ({ ...props }) => {
  return (
    <svg
      fill='none'
      height='32'
      viewBox='0 0 33 32'
      width='33'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <title>icon</title>
      <g filter='url(#filter0_d_12646_4948)'>
        <path
          d='M4.5 6.8C4.5 5.11984 4.5 4.27976 4.82698 3.63803C5.1146 3.07354 5.57354 2.6146 6.13803 2.32698C6.77976 2 7.61984 2 9.3 2H24.6607C25.4408 2 25.8309 2 26.1539 2.07214C27.2885 2.32553 28.1745 3.21155 28.4279 4.34608C28.5 4.66906 28.5 5.05915 28.5 5.83934C28.5 6.39707 28.5 6.67593 28.457 6.92721C28.3073 7.80155 27.7784 8.56481 27.0123 9.01196C26.7921 9.14047 26.531 9.23839 26.0087 9.43422L20.7707 11.3985C19.8927 9.96014 18.3085 9 16.5 9C13.7386 9 11.5 11.2386 11.5 14C11.5 14.2891 11.5245 14.5725 11.5716 14.8481L7.7427 16.284C6.65319 16.6926 6.10843 16.8968 5.67251 16.7993C5.29116 16.714 4.95816 16.4832 4.74438 16.1561C4.5 15.7822 4.5 15.2004 4.5 14.0368V6.8Z'
          fill='url(#paint0_linear_12646_4948)'
        />
        <path
          d='M12.2293 16.6015L6.99126 18.5658C6.46908 18.7616 6.20792 18.8595 5.98775 18.988C5.22164 19.4352 4.6927 20.1985 4.54302 21.0728C4.5 21.3241 4.5 21.6029 4.5 22.1607C4.5 22.9408 4.5 23.3309 4.57214 23.6539C4.82553 24.7885 5.71155 25.6745 6.84608 25.9279C7.16906 26 7.55915 26 8.33934 26H23.7C25.3802 26 26.2202 26 26.862 25.673C27.4265 25.3854 27.8854 24.9265 28.173 24.362C28.5 23.7202 28.5 22.8802 28.5 21.2V13.9632C28.5 12.7996 28.5 12.2178 28.2556 11.8439C28.0418 11.5168 27.7088 11.286 27.3275 11.2007C26.8916 11.1032 26.3468 11.3074 25.2573 11.716L21.4284 13.1519C21.4755 13.4275 21.5 13.7109 21.5 14C21.5 16.7614 19.2614 19 16.5 19C14.6915 19 13.1073 18.0399 12.2293 16.6015Z'
          fill='url(#paint1_linear_12646_4948)'
        />
      </g>
      <defs>
        <filter
          colorInterpolationFilters='sRGB'
          filterUnits='userSpaceOnUse'
          height='36'
          id='filter0_d_12646_4948'
          width='36'
          x='-1.5'
          y='-2'
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
            result='effect1_dropShadow_12646_4948'
          />
          <feBlend
            in='SourceGraphic'
            in2='effect1_dropShadow_12646_4948'
            mode='normal'
            result='shape'
          />
        </filter>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint0_linear_12646_4948'
          x1='16.5'
          x2='16.5'
          y1='2'
          y2='26'
        >
          <stop stopColor={props?.isActive ? '#F9F9F9' : '#77E5CA'} />
          <stop
            offset='1'
            stopColor={props?.isActive ? '#77E5CA' : '#4534C1'}
          />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint1_linear_12646_4948'
          x1='16.5'
          x2='16.5'
          y1='2'
          y2='26'
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

export default HomeIcon;
