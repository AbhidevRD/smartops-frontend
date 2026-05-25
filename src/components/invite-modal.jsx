'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Input, Button, Label } from '@/components/ui';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export function InviteModal({ projectId, isOpen, onClose, onInviteSent }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.post(API_ENDPOINTS.INVITES.SEND, {
        email: email.trim(),
        projectId
      });

      setSuccess(`Invite sent to ${email.trim()}`);
      setEmail('');

      setTimeout(() => {
        setSuccess('');
        onClose();
        onInviteSent?.();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details || 'Failed to send invite');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-theme-text">Invite Team Member</h2>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Close invite modal">
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              An invitation link will be sent to this email address.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading ? 'Sending...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
