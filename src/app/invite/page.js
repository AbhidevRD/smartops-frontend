'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Card, CardBody, CardHeader, Button } from '@/components/ui';

function InvitePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  const [inviteInfo, setInviteInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAccepting, setIsAccepting] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/invite?token=${token}`);
      return;
    }

    const fetchInviteInfo = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(API_ENDPOINTS.INVITES.INFO, {
          params: { token }
        });
        setInviteInfo(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load invite');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInviteInfo();
    }
  }, [token, isAuthenticated, router]);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await axiosInstance.post(API_ENDPOINTS.INVITES.ACCEPT, { token });
      
      // Redirect to project dashboard
      router.push(`/projects/${inviteInfo.project.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept invite');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsAccepting(true);
      await axiosInstance.post(API_ENDPOINTS.INVITES.REJECT, { token });
      router.push('/projects');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject invite');
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody>
            <p>Redirecting to login...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody>
            <p>Loading invite...</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardBody>
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
            <Button onClick={() => router.push('/projects')} className="w-full">
              Go to Projects
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-theme-text dark:text-gray-900 font-bold">S</span>
            </div>
            <span className="text-lg font-semibold">SmartOps AI</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-theme-text mb-2">
            Join {inviteInfo?.project?.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You&apos;re invited to collaborate
          </p>
        </CardHeader>
        <CardBody>
          {/* Project Info */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-theme-text mb-1">
                {inviteInfo?.project?.name}
              </h3>
              {inviteInfo?.project?.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {inviteInfo.project.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Owner</p>
                <p className="font-semibold text-gray-900 dark:text-theme-text">
                  {inviteInfo?.project?.owner?.name}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Members</p>
                <p className="font-semibold text-gray-900 dark:text-theme-text">
                  {inviteInfo?.project?.memberCount}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Invited by
              </p>
              <p className="font-semibold text-gray-900 dark:text-theme-text">
                {inviteInfo?.invitedBy?.name}
              </p>
            </div>
          </div>

          {/* Invite Email Confirmation */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg mb-6 text-sm">
            <p className="text-blue-900 dark:text-blue-300">
              This invite was sent to <strong>{inviteInfo?.email}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAccept}
              disabled={isAccepting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isAccepting ? 'Accepting...' : 'Accept Invitation'}
            </Button>
            <Button
              onClick={handleReject}
              disabled={isAccepting}
              variant="secondary"
              className="w-full"
            >
              Decline
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">Loading invite...</div>}>
      <InvitePageContent />
    </Suspense>
  );
}
