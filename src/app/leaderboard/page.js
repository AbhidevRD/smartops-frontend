'use client';

import { AppLayout } from '@/components/AppLayout';
import { Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui';

export default function LeaderboardPage() {
  const leaderboard = [
    { rank: 1, name: 'Raj Kumar', points: 2850, level: 'Gold', streak: 12 },
    { rank: 2, name: 'Priya Sharma', points: 2720, level: 'Gold', streak: 10 },
    { rank: 3, name: 'Maria Garcia', points: 2540, level: 'Silver', streak: 8 },
    { rank: 4, name: 'Sarah Chen', points: 2310, level: 'Silver', streak: 6 },
    { rank: 5, name: 'Alex Johnson', points: 2150, level: 'Bronze', streak: 4 },
    { rank: 6, name: 'James Wilson', points: 1980, level: 'Bronze', streak: 3 },
  ];

  const badges = [
    { icon: '🚀', title: 'Speed Demon', desc: 'Complete 5 tasks in 1 day' },
    { icon: '⭐', title: 'Quality Master', desc: '10 tasks with 0 issues' },
    { icon: '🎯', title: 'On Target', desc: 'Complete all sprint tasks' },
    { icon: '🔥', title: 'On Fire', desc: '7-day streak' },
    { icon: '🏆', title: 'Champion', desc: '#1 on leaderboard' },
    { icon: '🤝', title: 'Team Player', desc: 'Help 10 teammates' },
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'Gold':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100';
      case 'Silver':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white';
      case 'Bronze':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-900 dark:text-orange-100';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white';
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Leaderboard & Achievements</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Performers</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-0">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-900 dark:text-white w-8">
                        {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : player.rank}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{player.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{player.streak} day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(player.level)}`}>
                        {player.level}
                      </span>
                      <span className="font-bold text-gray-900 dark:text-white">{player.points} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Your Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Profile</h2>
            </CardHeader>
            <CardBody className="text-center">
              <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-lg font-bold text-white dark:text-gray-900 mx-auto mb-4">
                PS
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Priya Sharma</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Rank #2</p>
              
              <div className="space-y-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">TOTAL POINTS</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">2,720</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">CURRENT STREAK</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">10 days 🔥</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Badges */}
        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Available Badges</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => (
                <div key={badge.title} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow">
                  <p className="text-4xl mb-2">{badge.icon}</p>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{badge.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{badge.desc}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
