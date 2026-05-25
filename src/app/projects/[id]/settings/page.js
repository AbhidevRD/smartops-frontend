'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui';
import { ProjectSettings } from '@/components/project-settings';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;
  const { currentProject, fetchProject, isLoading } = useProjectStore();
  const { user } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (currentProject && user) {
      const member = currentProject.members?.find(m => m.userId === user.id);
      setIsAdmin(member?.role === 'ADMIN' || currentProject.ownerId === user.id);
    }
  }, [currentProject, user]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </AppLayout>
    );
  }

  if (!currentProject) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-700 dark:text-gray-300 mb-4">Project not found</p>
            <Button onClick={() => router.push('/projects')}>Back to Projects</Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push(`/projects/${projectId}`)}
            aria-label="Back to project"
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-theme-text">
              {currentProject.name} - Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage project settings and sharing options
            </p>
          </div>
        </div>

        <ProjectSettings 
          projectId={projectId}
          projectName={currentProject.name}
          isAdmin={isAdmin}
        />
      </div>
    </AppLayout>
  );
}
