'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card, CardBody, CardHeader } from '@/components/ui';

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const { verifyOtp, resendOtp, isLoading, error } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!otp) {
      setLocalError('Please enter the OTP');
      return;
    }

    if (!email) {
      setLocalError('Email is required');
      return;
    }

    const result = await verifyOtp(email, otp);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  const handleResendOtp = async () => {
    if (cooldown > 0) return;

    const result = await resendOtp(email);
    if (result.success) {
      setCooldown(60);
      setLocalError('');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-gray-900 font-bold">S</span>
            </div>
            <span className="text-lg font-semibold">SmartOps AI</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verify your email</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            We've sent a code to <strong>{email}</strong>
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error || localError}
              </div>
            )}

            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Didn't receive the code?</p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOtp}
                disabled={cooldown > 0 || isLoading}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
