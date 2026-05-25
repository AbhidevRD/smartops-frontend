import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
              <span className="text-theme-text dark:text-gray-900 font-bold text-lg">S</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-theme-text">SmartOps AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-theme-text mb-6">
            AI-Powered Project Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            SmartOps AI is your intelligent project management assistant. Powered by AI, designed for teams.
            Automate task management, predict risks, and boost productivity.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Start free trial</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-theme-text mb-2">AI Task Creation</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Turn your notes and voice commands into structured tasks automatically.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-theme-text mb-2">Risk Prediction</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get early warnings about project risks and bottlenecks before they impact delivery.
            </p>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-theme-text mb-2">Productivity Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Understand team velocity, identify burnout risks, and optimize workflows.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
