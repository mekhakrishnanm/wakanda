'use server';

import { cookies } from 'next/headers';

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('appChainId');
  cookieStore.delete('wagmi.store');
  cookieStore.delete('wagmi.recentConnectorId');
}
