'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import axiosInstance from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { InviteModal } from './invite-modal';
import { MemberList } from './member-list';

export function ProjectMembers({ projectId, project }) {
  const { user } = useAuthStore();
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const currentMember = project?.members?.find((member) => (
    member.userId === user?.id || member.user?.id === user?.id
  ));
  const canManageInvites = (
    project?.ownerId === user?.id ||
    user?.role === 'ADMIN' ||
    currentMember?.role === 'ADMIN' ||
    currentMember?.role === 'OWNER'
  );

  const fetchMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_ENDPOINTS.MEMBERS.GET_PROJECT_MEMBERS(projectId)
      );
      setMembers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load members');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const fetchInvites = useCallback(async () => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.INVITES.GET_PROJECT_INVITES(projectId)
      );
      setInvites(response.data.invites || []);
    } catch (err) {
      console.error('Failed to load invites:', err);
    }
  }, [projectId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembers();
      if (canManageInvites) {
        fetchInvites();
      }
    }, 0);

    // Listen for real-time member joins
    let socket;
    import('@/services/socketService').then(({ default: socketService }) => {
      socket = socketService.socket;
      if (socket) {
        socket.on('member-joined', (data) => {
          if (data.projectId === projectId) {
            console.log('[Realtime] Refreshing member list...');
            fetchMembers();
          }
        });
      }
    });

    return () => {
      clearTimeout(timeoutId);
      if (socket) {
        socket.off('member-joined');
      }
    };
  }, [fetchMembers, fetchInvites, canManageInvites, projectId]);

  const handleCancelInvite = async (inviteId) => {
    try {
      await axiosInstance.delete(API_ENDPOINTS.INVITES.CANCEL(inviteId));
      setInvites(invites.filter(i => i.id !== inviteId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel invite');
    }
  };

  const handleInviteSent = () => {
    fetchInvites();
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading members...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-theme-text">
            Team Members
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {members.length} member{members.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canManageInvites && (
          <Button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Invite Member
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Members List */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold text-gray-900 dark:text-theme-text">
            Active Members
          </h3>
        </CardHeader>
        <CardBody>
          <MemberList members={members} />
        </CardBody>
      </Card>

      {/* Pending Invites */}
      {canManageInvites && invites.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900 dark:text-theme-text">
              Pending Invites ({invites.filter(i => i.status === 'PENDING').length})
            </h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-theme-text">
                      {invite.email}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Invited {new Date(invite.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded">
                      {invite.status}
                    </span>
                    {invite.status === 'PENDING' && (
                      <Button
                        onClick={() => handleCancelInvite(invite.id)}
                        variant="secondary"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Invite Modal */}
      <InviteModal
        projectId={projectId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSent={handleInviteSent}
      />
    </div>
  );
}
