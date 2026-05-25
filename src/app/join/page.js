'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JoinProjectModal } from '@/components/join-project-modal';

export default function JoinPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const router = useRouter();

  const handleSuccess = (project) => {
    // Redirect to the project dashboard
    router.push(`/projects/${project.id}`);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-theme-text mb-2">Join a Project</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Enter the code shared by your team admin</p>
      </div>

      <JoinProjectModal 
        isOpen={isModalOpen}
        onClose={handleClose}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
