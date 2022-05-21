import { useEffect } from 'react';
import { useRouter } from 'next/router';

const useScrollReset = () => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.pathname]);

  return null;
};

export default useScrollReset;
