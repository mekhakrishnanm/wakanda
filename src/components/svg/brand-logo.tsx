import React from 'react';

const BrandLogo = ({ ...props }) => {
  return (
    <svg
      fill='none'
      height='32'
      viewBox='0 0 31 32'
      width='31'
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        d='M18 24.3086C24.0751 24.3086 29 19.3837 29 13.3086C29 7.23346 24.0751 2.30859 18 2.30859'
        stroke='url(#paint0_linear_12538_2931)'
        strokeLinecap='round'
        strokeWidth='3.33333'
      />
      <path
        d='M17.9974 18.9749C21.127 18.9749 23.6641 16.4379 23.6641 13.3083C23.6641 10.1787 21.127 7.6416 17.9974 7.6416'
        stroke='url(#paint1_linear_12538_2931)'
        strokeLinecap='round'
        strokeWidth='2.66667'
      />
      <path
        d='M27.2994 12.5222C27.321 12.2317 27.332 11.938 27.332 11.6416C27.332 5.81985 23.0836 1.05445 17.707 0.666992C16.9256 0.804921 16.332 1.48725 16.332 2.30822C16.332 3.22869 17.0782 3.97488 17.9987 3.97488C22.8886 3.97488 26.9002 7.73536 27.2994 12.5222Z'
        fill='url(#paint2_radial_12538_2931)'
        // style='mix-blend-mode:plus-darker'
      />
      <path
        d='M13 29.6416C6.92487 29.6416 2 24.7167 2 18.6416C2 12.5665 6.92487 7.6416 13 7.6416'
        stroke='url(#paint3_linear_12538_2931)'
        strokeLinecap='round'
        strokeWidth='3.33333'
      />
      <path
        d='M12.9987 24.3079C9.86908 24.3079 7.33203 21.7709 7.33203 18.6413C7.33203 15.5117 9.86908 12.9746 12.9987 12.9746'
        stroke='url(#paint4_linear_12538_2931)'
        strokeLinecap='round'
        strokeWidth='2.66667'
      />
      <path
        d='M3.7006 19.3333C3.679 19.6238 3.66797 19.9175 3.66797 20.2139C3.66797 26.0356 7.91638 30.801 13.293 31.1885C14.0744 31.0505 14.668 30.3682 14.668 29.5473C14.668 28.6268 13.9218 27.8806 13.0013 27.8806C8.11137 27.8806 4.09977 24.1201 3.7006 19.3333Z'
        fill='url(#paint5_radial_12538_2931)'
        // style='mix-blend-mode:plus-darker'
      />
      <defs>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint0_linear_12538_2931'
          x1='23.5'
          x2='23.5'
          y1='2.30859'
          y2='24.3086'
        >
          <stop stopColor='#77E5CA' />
          <stop offset='1' stopColor='#40C2CF' />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint1_linear_12538_2931'
          x1='20.8307'
          x2='20.8307'
          y1='7.6416'
          y2='18.9749'
        >
          <stop stopColor='#77E5CA' />
          <stop offset='1' stopColor='#40C2CF' />
        </linearGradient>
        <radialGradient
          cx='0'
          cy='0'
          gradientTransform='translate(19.332 5.64155) rotate(-59.7436) scale(4.63081 8.76076)'
          gradientUnits='userSpaceOnUse'
          id='paint2_radial_12538_2931'
          r='1'
        >
          <stop stopColor='#211E1F' stopOpacity='0.48' />
          <stop offset='1' stopColor='#211E1F' stopOpacity='0.08' />
        </radialGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint3_linear_12538_2931'
          x1='7.5'
          x2='7.5'
          y1='7.6416'
          y2='29.6416'
        >
          <stop stopColor='#40C2CF' />
          <stop offset='1' stopColor='#77E5CA' />
        </linearGradient>
        <linearGradient
          gradientUnits='userSpaceOnUse'
          id='paint4_linear_12538_2931'
          x1='10.1654'
          x2='10.1654'
          y1='12.9746'
          y2='24.3079'
        >
          <stop stopColor='#40C2CF' />
          <stop offset='1' stopColor='#77E5CA' />
        </linearGradient>
        <radialGradient
          cx='0'
          cy='0'
          gradientTransform='translate(11.668 26.2139) rotate(120.256) scale(4.63081 8.76076)'
          gradientUnits='userSpaceOnUse'
          id='paint5_radial_12538_2931'
          r='1'
        >
          <stop stopColor='#211E1F' stopOpacity='0.48' />
          <stop offset='1' stopColor='#211E1F' stopOpacity='0.08' />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default BrandLogo;
