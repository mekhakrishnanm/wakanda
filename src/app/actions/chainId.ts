'use server';

import { cookies } from 'next/headers';

export async function setChainId(chainId: number) {
  const cookieStore = cookies();
  cookieStore.set('appChainId', chainId.toString());
}
