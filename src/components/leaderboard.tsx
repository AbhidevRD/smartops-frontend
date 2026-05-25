'use client';

import { BadgeList } from '@/components/badge-list';

type LeaderboardEntry = {
  id?: string;
  userId?: string;
  name?: string;
  userName?: string;
  xpPoints?: number;
  points?: number;
  rank?: number;
  level?: string;
  streak?: number;
  badgeDetails?: Array<{
    id?: string;
    name: string;
    description?: string;
    icon?: string;
  }>;
};

type LeaderboardProps = {
  entries?: LeaderboardEntry[];
  currentUserId?: string;
  isLoading?: boolean;
};

function getLevelColor(level?: string) {
  switch (level?.toUpperCase()) {
    case 'GOLD':
      return 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100';
    case 'SILVER':
      return 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white';
    case 'BRONZE':
      return 'bg-orange-100 text-orange-900 dark:bg-orange-900/20 dark:text-orange-100';
    default:
      return 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white';
  }
}

export function Leaderboard({ entries = [], currentUserId, isLoading = false }: LeaderboardProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <p className="py-8 text-center text-gray-600 dark:text-gray-400">
        No leaderboard data available
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {entries.slice(0, 10).map((player, index) => {
        const isCurrentUser = player.userId === currentUserId || player.id === currentUserId;

        return (
          <div
            key={player.userId || player.id || index}
            className={`flex items-center justify-between gap-4 rounded-lg border-b border-gray-200 px-4 py-4 transition-colors last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 ${
              isCurrentUser ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            }`}
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="w-8 shrink-0 text-xl font-bold text-gray-900 dark:text-white">
                #{player.rank || index + 1}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate font-semibold text-gray-900 dark:text-white">
                    {player.userName || player.name || 'User'} {isCurrentUser ? '(You)' : ''}
                  </p>
                  <BadgeList badges={player.badgeDetails || []} compact />
                </div>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  {player.streak || 0} day streak
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${getLevelColor(player.level)}`}>
                {player.level || 'Bronze'}
              </span>
              <span className="min-w-[60px] text-right font-bold text-gray-900 dark:text-white">
                {player.xpPoints || player.points || 0} pts
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Leaderboard;
