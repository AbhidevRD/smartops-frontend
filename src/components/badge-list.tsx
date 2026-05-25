'use client';

import {
  Award,
  Bug,
  CalendarCheck,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from 'lucide-react';

const iconMap = {
  award: Award,
  bug: Bug,
  'calendar-check': CalendarCheck,
  'shield-check': ShieldCheck,
  star: Star,
  trophy: Trophy,
  users: Users,
};

type BadgeItem = {
  id?: string;
  name: string;
  description?: string;
  icon?: string;
};

type BadgeListProps = {
  badges?: BadgeItem[];
  compact?: boolean;
  emptyText?: string;
};

export function BadgeIcon({ badge, compact = false }: { badge: BadgeItem; compact?: boolean }) {
  const Icon = iconMap[badge.icon as keyof typeof iconMap] || Award;

  return (
    <span
      title={`${badge.name}${badge.description ? ` - ${badge.description}` : ''}`}
      className={`inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-white ${
        compact ? 'h-7 w-7' : 'h-10 w-10'
      }`}
    >
      <Icon size={compact ? 14 : 18} />
    </span>
  );
}

export function BadgePill({ badge }: { badge: BadgeItem }) {
  return (
    <div
      title={badge.description || badge.name}
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
    >
      <BadgeIcon badge={badge} />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{badge.name}</p>
        {badge.description && (
          <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {badge.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function BadgeList({
  badges = [],
  compact = false,
  emptyText = 'No badges yet',
}: BadgeListProps) {
  if (!badges.length) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{emptyText}</p>;
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {badges.map((badge, index) => (
          <BadgeIcon key={badge.id || badge.name || index} badge={badge} compact />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {badges.map((badge, index) => (
        <BadgePill key={badge.id || badge.name || index} badge={badge} />
      ))}
    </div>
  );
}

export default BadgeList;
