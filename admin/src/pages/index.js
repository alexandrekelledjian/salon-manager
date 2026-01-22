import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from '../lib/api';

export default function Home() {
    const router = useRouter();

  useEffect(() => {
        const token = getToken();
        if (token) {
                router.replace('/salons');
        } else {
                router.replace('/login');
        }
  }, [router]);

  return (
        <div className="container">
          <p>Redirection...</p>
    </div>
    );
}
