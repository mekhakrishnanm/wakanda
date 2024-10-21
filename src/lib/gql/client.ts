import { registerUrql } from '@urql/next/rsc';
import { createClient, fetchExchange, errorExchange } from '@urql/core';

const makeChilizClient = () => {
  return createClient({
    url: 'https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-chiliz-v3',
    exchanges: [
      errorExchange({
        onError: (error) => {
          console.error('GraphQL Error:', error);
          // You can add more error handling logic here
          // For example, you could send the error to a logging service
          // or display an error message to the user
        },
      }),
      fetchExchange,
    ],
  });
};

const makePolygonClient = () => {
  return createClient({
    url: 'https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-polygon-v3',
    exchanges: [
      errorExchange({
        onError: (error) => {
          console.error('GraphQL Error:', error);
          // You can add more error handling logic here
          // For example, you could send the error to a logging service
          // or display an error message to the user
        },
      }),
      fetchExchange,
    ],
  });
};

const makeLiveClient = () => {
  return createClient({
    url: 'https://thegraph.azuro.org/subgraphs/name/azuro-protocol/azuro-api-live-data-feed',
    exchanges: [
      errorExchange({
        onError: (error) => {
          console.error('GraphQL Error:', error);
          // You can add more error handling logic here
          // For example, you could send the error to a logging service
          // or display an error message to the user
        },
      }),
      fetchExchange,
    ],
  });
};
const { getClient: polygonClient } = registerUrql(makePolygonClient);
const { getClient: chilizClient } = registerUrql(makeChilizClient);
const { getClient: liveClient } = registerUrql(makeLiveClient);

export { polygonClient, chilizClient, liveClient };
