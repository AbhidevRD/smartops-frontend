'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award } from 'lucide-react';
import { Button } from '@/components/ui';
import { useAdminStore } from '@/store/adminStore';
import { useAuthStore } from '@/store/authStore';
import { useBadgeStore } from '@/store/badgeStore';

type AssignBadgeProps = {
  users?: Array<{ id: string; name?: string; email?: string }>;
  onAssigned?: () => void;
};

export function AssignBadge({ users: providedUsers, onAssigned }: AssignBadgeProps) {
  const { user } = useAuthStore();
  const { users, fetchUsers } = useAdminStore();
  const { badges, fetchBadges, assignBadge, isLoading } = useBadgeStore();
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBadgeId, setSelectedBadgeId] = useState('');
  const [message, setMessage] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const assignableUsers = useMemo(
    () => providedUsers || users || [],
    [providedUsers, users]
  );

  useEffect(() => {
    if (!isAdmin) return;

    fetchBadges();

    if (!providedUsers) {
      fetchUsers();
    }
  }, [fetchBadges, fetchUsers, isAdmin, providedUsers]);

  const handleAssign = async () => {
    if (!selectedUserId || !selectedBadgeId) {
      setMessage('Select a user and badge first.');
      return;
    }

    const result = await assignBadge({
      userId: selectedUserId,
      badgeId: selectedBadgeId,
    });

    if (result.success) {
      setMessage('Badge assigned successfully.');
      setSelectedBadgeId('');
      onAssigned?.();
      return;
    }

    setMessage(result.error || 'Could not assign badge.');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Award size={18} className="text-gray-700 dark:text-gray-300" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Assign Badge</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <select
          value={selectedUserId}
          onChange={(event) => setSelectedUserId(event.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-white"
        >
          <option value="">Select user</option>
          {assignableUsers.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name || item.email}
            </option>
          ))}
        </select>

        <select
          value={selectedBadgeId}
          onChange={(event) => setSelectedBadgeId(event.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-white"
        >
          <option value="">Select badge</option>
          {badges.map((badge) => (
            <option key={badge.id} value={badge.id}>
              {badge.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={handleAssign} disabled={isLoading}>
          {isLoading ? 'Assigning...' : 'Assign Badge'}
        </Button>
        {message && <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>}
      </div>
    </div>
  );
}

export default AssignBadge;
