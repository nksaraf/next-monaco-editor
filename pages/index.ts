import { useRouter } from 'next/router';
import React from 'react';

export default () => {
  const router = useRouter();
  React.useEffect(() => {
    router.replace('/graphql');
  }, [])

  return null;
}