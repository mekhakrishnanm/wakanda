import { useModal } from '@aarc-xyz/fund-kit-widget';
import '@aarc-xyz/eth-connector/styles.css';
import { Wallet } from 'lucide-react';
import { Button } from './ui/button';

export default function FundBtn({
  classVal,
  hideIcon,
}: {
  classVal?: string;
  hideIcon?: boolean;
}) {
  const { setOpenModal } = useModal();
  const defaultStyle =
    'text-sm flex-center gap-x-2 h-[40px] w-full border border-[#211e1f29] rounded-[12px] px-2 py-0';

  return (
    <Button
      className={classVal ?? defaultStyle}
      onClick={() => setOpenModal(true)}
      variant={'ghost'}
    >
      {!hideIcon && <Wallet className='h-4 w-4' />}
      Load Wallet
    </Button>
  );
}
