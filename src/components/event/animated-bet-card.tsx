// app/components/event/animated-bet-card.tsx
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type {
  GameQuery,
  MarketOutcome,
  // calcLiveOdds,
} from '@azuro-org/toolkit';
import {
  useBetTokenBalance,
  useChain,
  useBaseBetslip,
  useDetailedBetslip,
} from '@azuro-org/sdk';
import { Slider1 } from '../ui/slider-1';
import { TOKENS } from '@/lib/chains';
import { Slider2 } from '../ui/slider-2';
import { Slider3 } from '../ui/slider-3';
import { useAppSelector } from '@/redux/redux-provider';
import { errorPerDisableReason, tabsImages } from '@/lib/constants';
import { ChevronDown, Loader } from 'lucide-react';
import { getDisplayAmount } from '@/lib/balance';
import { chiliz } from 'wagmi/chains';
import SubmitButton from './submit-btn';
import AnimatedCounter from '../animated-counter';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';

const AnimatedBetCard: React.FC<{
  outcomeRows: MarketOutcome[][];
  participants: GameQuery['games'][0]['participants'];
  isLiveBet: boolean;
  isCorrectChain: boolean;
}> = ({ outcomeRows, participants, isLiveBet, isCorrectChain }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { appChain, isRightNetwork } = useChain();
  const { chain } = useAccount();
  const { balance } = useBetTokenBalance();
  const [sliderValue, setSliderValue] = useState(10);
  const [sliderMax, setSliderMax] = useState(10000);
  const { items, addItem, clear } = useBaseBetslip();
  const { isTeamBSelected } = useAppSelector((state) => state.events);
  const [inputValue, setInputValue] = useState('10');
  const {
    selectFreeBet,
    selectedFreeBet,
    freeBets,
    betAmount,
    changeBetAmount,
    totalOdds,
    disableReason,
    isOddsFetching,
    isBetAllowed,
  } = useDetailedBetslip();
  const { toast } = useToast();

  const outcomes = useMemo(() => outcomeRows[0] || [], [outcomeRows]);
  const [selectionNames, setSelectionNames] = useState<string[]>([]);
  const [isSliderOpen, setIsSliderOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(selectionNames[0] || '');
  const [isTiePresent, setIsTiePresent] = useState(false);
  const [betsModules, setBetsModules] = useState<number[]>([25, 50, 75, 100]);
  const inputRef = useRef<HTMLInputElement>(null);

  const secondaryColors = ['#211E1F', '#F9F9F9'];

  const handleFreeBetSelection = useCallback(() => {
    if (freeBets && freeBets.length > 0) {
      // Find the highest freebet
      const selectedFreebet = freeBets.reduce((acc, freebet) => {
        if (Number(freebet.amount) > Number(acc.amount)) {
          return freebet;
        }
        return acc;
      });
      selectFreeBet(selectedFreebet);
    }
  }, [freeBets, selectFreeBet]);

  const activeOutcome = useMemo(
    () => outcomes.find((outcome) => outcome.selectionName === activeTab),
    [outcomes, activeTab]
  );

  const isActive = useMemo(() => {
    if (!activeOutcome) {
      return false;
    }
    return Boolean(
      items?.find((item) => {
        const outcomeKey = `${activeOutcome.coreAddress}-${activeOutcome.lpAddress}-${activeOutcome.gameId}-${activeOutcome.conditionId}-${activeOutcome.outcomeId}`;
        const itemKey = `${item.coreAddress}-${item.lpAddress}-${item.game.gameId}-${item.conditionId}-${item.outcomeId}`;
        return outcomeKey === itemKey;
      })
    );
  }, [items, activeOutcome]);

  const isEnoughBalance = useMemo(() => {
    if (!balance || !sliderValue) {
      return true;
    }
    return Number(balance) >= sliderValue;
  }, [balance, sliderValue]);

  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const [countdownDuration, setCountdownDuration] = useState(300); // 5 minutes
  const [isBetTimedOut, setIsBetTimedOut] = useState(false);
  const [isBetting, setIsBetting] = useState(false);
  const [isSubmitButtonReset, setIsSubmitButtonReset] = useState(false); // New state for reset

  const handleTimeUp = useCallback(
    (isTimeOut: boolean) => {
      clear();
      setIsBetTimedOut(true);
      setIsBetting(false);
      setIsCountdownRunning(false);
      setIsSubmitButtonReset(true); // Set reset state to true
      if (isTimeOut) {
        toast({
          title: 'Bet Timed Out',
          description:
            'Time to complete the transaction has expired. Please Try again!',
          variant: 'destructive',
        });
      }
      setTimeout(() => {
        setIsBetTimedOut(false);
        window.location.reload();
      }, 1000);
    },
    [clear, toast]
  );

  const startCountdown = useCallback(() => {
    setIsBetting(true);
    setCountdownDuration(120);
    setIsBetTimedOut(false);
    setIsCountdownRunning(true);
    setIsSubmitButtonReset(false); // Reset the submit button state
  }, []);

  const isDisabled =
    (disableReason && disableReason?.length > 0) ||
    !isEnoughBalance ||
    !sliderValue ||
    !isRightNetwork ||
    !isBetAllowed ||
    isBetTimedOut;
  const onSliderChange = (value: number[]) => {
    let newValue = value[0];

    // Round to 2 decimal places for values up to 100, whole numbers for values above 100
    if (newValue <= 100) {
      newValue = Math.round(newValue * 100) / 100;
    } else {
      newValue = Math.floor(newValue);
    }

    setSliderValue(newValue);
    changeBetAmount(newValue.toString());
  };

  useEffect(() => {
    // Reset bet when chain changes
    if (!isCorrectChain) {
      clear();
      setSliderValue(10);
      changeBetAmount('10');
    }
  }, [isCorrectChain, clear, changeBetAmount]);
  useEffect(() => {
    // Update odds when bet amount changes
    if (activeOutcome && appChain.id) {
      changeBetAmount(sliderValue.toString());
    }
  }, [appChain.id, sliderValue, activeOutcome, changeBetAmount]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (balance) {
      const balanceNumber = Number(balance);
      setSliderMax(Math.max(balanceNumber, 100));

      // Calculate bet modules based on balance
      const newBetsModules: number[] = [];
      const percentages = [0.1, 0.25, 0.5, 0.75, 1];
      for (let i = 0; i < 5 && i < percentages.length; i++) {
        const value = Math.round(balanceNumber * percentages[i]);
        if (value > 0 && !newBetsModules.includes(value)) {
          newBetsModules.push(value);
        }
      }
      setBetsModules(newBetsModules);

      // Adjust sliderValue if it's higher than the new max
      if (sliderValue > balanceNumber) {
        setSliderValue(balanceNumber);
        changeBetAmount(balanceNumber.toString());
      }
    } else {
      // Default values when there's no balance
      setBetsModules([25, 50, 75, 100]);
      setSliderMax(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balance]);

  useEffect(() => {
    const selectionNames = outcomes.map((outcome) => outcome.selectionName);
    setSelectionNames(selectionNames);
    setActiveTab(
      isTeamBSelected
        ? selectionNames.length === 3
          ? selectionNames[2]
          : selectionNames[1]
        : selectionNames[0]
    );
    setIsTiePresent(outcomes.length === 3);
  }, [outcomes, isTeamBSelected]);

  useEffect(() => {
    const updateHeight = () => {
      if (targetRef.current) {
        targetRef.current.style.height = `${(targetRef.current.clientWidth * 4) / 5}px`;
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  useEffect(() => {
    const outcome = outcomes.find(
      (outcome) => outcome.selectionName === activeTab
    );
    if (outcome) {
      clear();
      addItem({
        gameId: String(outcome.gameId),
        conditionId: String(outcome.conditionId),
        outcomeId: String(outcome.outcomeId),
        coreAddress: outcome.coreAddress,
        lpAddress: outcome.lpAddress,
        isExpressForbidden: outcome.isExpressForbidden,
      });
    }
  }, [activeTab, addItem, clear, outcomes]);

  useEffect(() => {
    const amount = Number(betAmount);
    if (!amount) {
      changeBetAmount(sliderValue.toString());
    }
  }, [betAmount, changeBetAmount, sliderValue]);

  const handleInputClick = useCallback(() => {
    setIsSliderOpen(false);
  }, []);

  useEffect(() => {
    if (!isSliderOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSliderOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and up to 2 decimal places for values <= 100, whole numbers for > 100
    if (
      value === '' ||
      /^\d*$/.test(value) ||
      (/^\d*\.?\d{0,2}$/.test(value) && Number.parseFloat(value) <= 100)
    ) {
      setInputValue(value);
      const numValue = Number.parseFloat(value);
      if (!Number.isNaN(numValue)) {
        setSliderValue(numValue);
        changeBetAmount(numValue.toString());
      }
    }
  };

  const handleInputBlur = () => {
    const numValue = Number.parseFloat(inputValue);
    if (Number.isNaN(numValue) || numValue < 1) {
      setInputValue('1');
      setSliderValue(1);
      changeBetAmount('1');
    } else if (numValue > sliderMax) {
      setInputValue(Math.floor(sliderMax).toString());
      setSliderValue(Math.floor(sliderMax));
      changeBetAmount(Math.floor(sliderMax).toString());
    } else {
      // Format to a maximum of 2 decimal places for values <= 100, whole numbers for > 100
      const formattedValue =
        numValue > 100 ? Math.floor(numValue).toString() : numValue.toFixed(2);
      setInputValue(formattedValue);
      setSliderValue(Number(formattedValue));
      changeBetAmount(formattedValue);
    }
  };

  useEffect(() => {
    if (selectedFreeBet) {
      const freeBetAmount = Number(selectedFreeBet.amount);
      setInputValue(
        freeBetAmount > 100
          ? Math.floor(freeBetAmount).toString()
          : freeBetAmount.toFixed(2)
      );
      setSliderValue(freeBetAmount);
    } else {
      // Format to a maximum of 2 decimal places for values <= 100, whole numbers for > 100
      setInputValue(
        sliderValue > 100
          ? Math.floor(sliderValue).toString()
          : sliderValue.toFixed(2)
      );
    }
  }, [selectedFreeBet, sliderValue]);

  const renderTabs = (isRenderActive: boolean) => (
    <nav
      className={`z-${isActive ? '40' : '20'} absolute top-0 left-0 right-0 overflow-hidden w-full`}
    >
      <ul className='list-none w-full flex justify-between items-center p-0'>
        {outcomes.map((outcome, index) => (
          <motion.li
            className={`float-left relative h-[90px] transition-all duration-300 ease-in-out 
              ${outcome.selectionName === selectionNames[1] ? (isTiePresent ? '!w-fit' : '!w-[43%]') : '!w-[43%]'}
              ${
                activeTab === outcome.selectionName
                  ? `scale-105 ${isRenderActive ? '' : '!text-transparent'}`
                  : `scale-100 ${isRenderActive ? '!text-transparent' : ''}`
              }`}
            key={outcome.selectionName}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className={`relative flex w-full min-h-[50px] max-h-[70px] text-[20px] xs:text-[24px] line-clamp-2 leading-[28px] font-medium pt-2 xs:pt-4 px-5 xs:px-[24px] transition-all duration-100 ease-in-out 
                ${activeTab === outcome.selectionName ? 'opacity-100' : 'opacity-70 hover:opacity-90'}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(outcome.selectionName);
              }}
              type='button'
            >
              {(!isTiePresent ||
                (isTiePresent &&
                  outcome.selectionName !== selectionNames[1])) && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className={`relative z-40  inline-block w-full h-full text-left font-semibold ${
                    activeTab === outcome.selectionName
                      ? outcome.selectionName === selectionNames[0]
                        ? isRenderActive
                          ? 'text-black'
                          : 'text-transparent'
                        : isRenderActive
                          ? 'text-white'
                          : 'text-transparent'
                      : isRenderActive
                        ? 'text-transparent'
                        : 'text-white truncate'
                  }`}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {
                    participants[isTiePresent ? (index === 0 ? 0 : 1) : index]
                      ?.name
                  }
                </motion.span>
              )}
            </button>
          </motion.li>
        ))}
      </ul>
    </nav>
  );

  const renderBackgroundImage = (tabIndex: number, isRenderActive: boolean) => {
    return (
      <motion.div
        animate={{ opacity: 1 }}
        className={`z-${isRenderActive ? '30' : '10'} absolute top-0 left-0 w-full h-full`}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        key={`bg-${tabIndex}`}
        transition={{ duration: 0.3 }}
      >
        <Image
          alt={tabIndex.toString()}
          className='mx-auto w-full h-full absolute top-0 left-0 pointer-events-none transition-transform duration-300 ease-in-out hover:scale-110'
          layout='fill'
          objectFit='cover'
          src={
            isRenderActive
              ? tabsImages[tabIndex]?.activeImage
              : tabsImages[tabIndex]?.idleImage
          }
        />
      </motion.div>
    );
  };

  return (
    <div className='flex flex-col'>
      <div
        className='leading-relaxed w-full max-w-md mx-auto relative'
        ref={targetRef}
      >
        <AnimatePresence>
          {activeTab !== selectionNames[0] && renderBackgroundImage(0, false)}
          {activeTab !== selectionNames[isTiePresent ? 2 : 1] &&
            renderBackgroundImage(2, false)}
        </AnimatePresence>
        {isTiePresent && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              alt='badge'
              className='z-0 mx-auto w-[10%] h-auto absolute top-0 left-[45%] pointer-events-none transition-transform duration-300 ease-in-out hover:scale-110'
              height={12}
              src={
                activeTab === selectionNames[1]
                  ? tabsImages[1].badgeActiveImage
                  : tabsImages[1].badgeIdleImage
              }
              width={12}
            />
          </motion.div>
        )}
        {renderTabs(false)}
        <AnimatePresence>
          {activeTab === selectionNames[0] && renderBackgroundImage(0, true)}
          {activeTab === selectionNames[isTiePresent ? 2 : 1] &&
            renderBackgroundImage(2, true)}
          {isTiePresent &&
            activeTab === selectionNames[1] &&
            renderBackgroundImage(1, true)}
        </AnimatePresence>
        {renderTabs(true)}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className='z-50 absolute left-0 right-0 bottom-0 w-full h-[80%] px-4 xs:px-6 pb-4 pt-3 flex flex-col justify-center items-center'
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`mb-0 flex flex-col justify-end items-left w-full ${activeTab === selectionNames[0] ? 'text-black' : 'text-white'}`}
          >
            <div>
              <div className='flex justify-between items-center mb-2 xs:mb-4'>
                <div className='text-[16px] xs:text-[20px] font-normal flex items-center whitespace-nowrap'>
                  <span
                    className={`mr-1 !text-[${activeTab === selectionNames[0] ? secondaryColors[0] : secondaryColors[1]}]/60`}
                  >
                    I bet{' '}
                  </span>{' '}
                  <span className='font-medium'>
                    <input
                      className={`w-16 bg-transparent text-right border-none outline-none pr-2 ${
                        activeTab === selectionNames[0]
                          ? 'text-black'
                          : 'text-white'
                      }`}
                      inputMode='decimal'
                      onBlur={handleInputBlur}
                      onChange={handleInputChange}
                      onClick={handleInputClick}
                      pattern='[0-9]*'
                      ref={inputRef}
                      type='text'
                      value={inputValue}
                    />
                    <span className='text-[14px] xs:text-[16px]'>
                      {TOKENS[appChain.id]}
                    </span>
                  </span>
                  <button
                    className='px-2 bg-transparent cursor-pointer'
                    onClick={() => setIsSliderOpen(!isSliderOpen)}
                    type='button'
                  >
                    <ChevronDown
                      className={`w-5 xs:w-6 h-auto ${isSliderOpen ? '' : 'rotate-180'} ${freeBets && freeBets.length > 0 ? 'text-red-500 animate-pulse' : activeTab === selectionNames[0] ? 'text-black' : 'text-white'}`}
                    />
                  </button>
                </div>
                <div className='text-[12px] xs:text-[14px] pl-3 py-1 rounded-full'>
                  <span
                    className={` mr-1 ${activeTab === selectionNames[0] ? 'text-[#211E1F]/60' : 'text-white/70'}`}
                  >
                    Balance:{' '}
                  </span>
                  {selectedFreeBet ? (
                    <>
                      <span className='text-[13px] text-red-500 font-medium'>
                        Free
                      </span>
                      <span className='text-[13px] font-medium'>Bet</span>
                    </>
                  ) : (
                    `${getDisplayAmount(Number(balance ?? 0))} ${TOKENS[appChain.id]}`
                  )}
                </div>
              </div>
              {isSliderOpen ? (
                <div className='mb-4'>
                  {activeTab === selectionNames[0] ? (
                    <Slider1
                      className='w-full'
                      max={sliderMax}
                      min={1}
                      onValueChange={onSliderChange}
                      step={sliderValue <= 100 ? 0.01 : 1}
                      value={[sliderValue]}
                    />
                  ) : activeTab === selectionNames[1] ? (
                    <Slider2
                      className='w-full'
                      max={sliderMax}
                      min={1}
                      onValueChange={onSliderChange}
                      step={sliderValue <= 100 ? 0.01 : 1}
                      value={[sliderValue]}
                    />
                  ) : (
                    <Slider3
                      className='w-full'
                      max={sliderMax}
                      min={1}
                      onValueChange={onSliderChange}
                      step={sliderValue <= 100 ? 0.01 : 1}
                      value={[sliderValue]}
                    />
                  )}
                </div>
              ) : (
                <motion.div
                  animate='visible'
                  className='overflow-x-auto'
                  initial='hidden'
                  style={{
                    width: '100%',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                  }}
                >
                  <div
                    className='flex justify-start items-center gap-1 pb-2'
                    style={{ minWidth: 'max-content' }}
                  >
                    <AnimatePresence>
                      {freeBets && freeBets.length > 0 && (
                        <motion.div
                          className='bg-white font-medium text-black text-[14px] px-1.5 py-1 rounded-full cursor-pointer'
                          onClick={handleFreeBetSelection}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 },
                            exit: { opacity: 0, scale: 0.8 },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className='text-[13px] text-red-500'>Free</span>
                          <span className='text-[13px]'>Bet</span>
                        </motion.div>
                      )}
                      {(betsModules.length > 0
                        ? betsModules
                        : [25, 50, 75, 100]
                      ).map((betsModule) => (
                        <motion.div
                          className='bg-white text-[14px] text-black px-1.5 py-1 rounded-full cursor-pointer font-medium'
                          key={betsModule}
                          onClick={() => {
                            selectFreeBet(undefined);
                            setSliderValue(betsModule);
                            changeBetAmount(betsModule.toString());
                          }}
                          variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1 },
                            exit: { opacity: 0, scale: 0.8 },
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {betsModule}{' '}
                          <span className='text-[13px]'>
                            {TOKENS[appChain.id]}
                          </span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </div>
            <div className=''>
              <div className='flex justify-between items-start text-[16px] xs:text-[20px] opacity-80 w-full mt-0 xs:mt-2'>
                <div className='w-[90%]'>
                  <span
                    className={` max-w-[300px] !text-[${
                      activeTab === selectionNames[0]
                        ? secondaryColors[0]
                        : secondaryColors[1]
                    }]/60`}
                  >
                    If
                  </span>{' '}
                  {isTiePresent && activeTab === selectionNames[1]
                    ? 'no one'
                    : `${activeTab === selectionNames[0] ? participants[0]?.name : participants[1]?.name}`}{' '}
                  <span
                    className={`!text-[${
                      activeTab === selectionNames[0]
                        ? secondaryColors[0]
                        : secondaryColors[1]
                    }]/60`}
                  >
                    wins
                  </span>
                  <span
                    className={`!text-[${
                      activeTab === selectionNames[0]
                        ? secondaryColors[0]
                        : secondaryColors[1]
                    }]/60`}
                  >
                    , you will make
                  </span>{' '}
                  <span className='inline-flex items-center justify-center font-medium'>
                    {isOddsFetching ? (
                      <Loader className='animate-spin mr-2 w-5 ' />
                    ) : (
                      `${totalOdds.toFixed(2)}x`
                    )}
                  </span>
                  {selectedFreeBet && freeBets && freeBets.length > 0 && (
                    <span className='inline-flex ml-2 font-medium'>
                      - {Number(freeBets[0].amount)} {TOKENS[appChain.id]}
                    </span>
                  )}
                </div>
                {isCountdownRunning && (
                  <AnimatedCounter
                    className='mr-2 text-lg'
                    duration={countdownDuration}
                    isRunning={isCountdownRunning}
                    onTimeUp={() => handleTimeUp(true)}
                  />
                )}
              </div>
              <div className='text-[22px] xs:text-[28px] font-medium mt-4 flex justify-between w-full items-center'>
                <div className='flex justify-start items-center'>
                  {isOddsFetching ? (
                    <Loader className='animate-spin mr-2 w-5 ' />
                  ) : selectedFreeBet ? (
                    getDisplayAmount(
                      (totalOdds - Number(selectedFreeBet.amount)) * +betAmount
                    )
                  ) : (
                    getDisplayAmount(totalOdds * +betAmount)
                  )}{' '}
                  {TOKENS[appChain.id]}
                </div>
                <SubmitButton
                  activeTab={activeTab}
                  isBetting={isBetting}
                  isCorrectChain={isCorrectChain}
                  isDisabled={(() => isDisabled)()}
                  isEnoughBalance={isEnoughBalance}
                  isLiveBet={isLiveBet}
                  isReset={isSubmitButtonReset}
                  onBetPlaced={() => {
                    handleTimeUp(false);
                    // Don't start the countdown here, it will be started by the SubmitButton
                  }}
                  selectionNames={selectionNames}
                  startCountdown={startCountdown}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {isLiveBet && chain?.id === chiliz.id && (
        <div className='text-red-500 text-center font-semibold h-auto relative mt-8'>
          {
            <div className='bet-history-card before:!h-auto loss max-w-md mx-auto tracking-wider font-medium flex flex-col w-full min-h-[50px] h-auto justify-center items-center p-4 rounded-[16px] text-sm text-white/60'>
              Live Betting is currently available only on Polygon network.
              Switch your network to Polygon to place a bet.
            </div>
          }
        </div>
      )}
      {disableReason && (
        <div className='text-red-500 text-center font-semibold h-auto relative mt-8'>
          {
            <div className='bet-history-card before:!h-auto loss max-w-md mx-auto tracking-wider font-medium flex flex-col w-full min-h-[50px] h-auto justify-center items-center p-4 rounded-[16px] text-sm text-white/60'>
              {(disableReason &&
                errorPerDisableReason[
                  disableReason as keyof typeof errorPerDisableReason
                ]) ??
                'The Bet is currently disabled due to some reason'}
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default AnimatedBetCard;
