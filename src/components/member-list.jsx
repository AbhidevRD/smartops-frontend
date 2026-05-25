'use client';

export function MemberList({ members = [] }) {
  if (members.length === 0) {
    return <p className="text-gray-600 dark:text-gray-400">No members yet</p>;
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-theme-text">
              {member.user?.name || member.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {member.user?.email || member.email}
            </p>
          </div>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
            {member.role}
          </span>
        </div>
      ))}
    </div>
  );
}
