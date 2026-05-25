'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard once OAuth callback is processed
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05050F]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-900 border-t-indigo-500" />
        <p className="mt-4 text-indigo-300">Completing sign in...</p>
      </div>
    </div>
  );
}
