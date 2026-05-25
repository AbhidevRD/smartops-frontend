'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, CheckCircle2, Users, Copy, RefreshCw, Key, Check, Paperclip, Download, File as FileIcon, Image as ImageIcon } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Button, Card, CardBody, CardHeader, Badge } from '@/components/ui';
import { ProjectMembers } from '@/components/project-members';
import { useProjectStore } from '@/store/projectStore';
import { useTaskStore } from '@/store/taskStore';
import { useAuthStore } from '@/store/authStore';
import { useFileStore } from '@/store/fileStore';
import socketService from '@/services/socketService';
import { FileUpload } from '@/components/file-upload';

function formatDate(value) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString();
}

/** Join Code panel — visible to all members, regenerate button only for admins */
function JoinCodePanel({ project, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const { user } = useAuthStore();

  // Determine if current user is project admin or owner
  const myMembership = project?.members?.find((m) => m.user?.id === user?.id);
  const isAdmin =
    user?.role === 'ADMIN' ||
    project?.ownerId === user?.id ||
    myMembership?.role === 'ADMIN' ||
    myMembership?.role === 'OWNER';

  const handleCopy = async () => {
    if (!project?.joinCode) return;
    try {
      await navigator.clipboard.writeText(project.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const el = document.createElement('textarea');
      el.value = project.joinCode;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = async () => {
    if (!isAdmin) return;
    setRegenerating(true);
    await onRegenerate();
    setRegenerating(false);
  };

  if (!project?.joinCode) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key size={18} className="text-blue-600 dark:text-blue-400" />
          <h2 className="font-semibold text-gray-900 dark:text-theme-text">Project Join Code</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Share this code with teammates so they can join the project instantly.
        </p>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Code Display */}
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <span className="flex-1 font-mono text-2xl font-bold tracking-[0.35em] text-gray-900 dark:text-theme-text text-center select-all">
                {project.joinCode}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                ${copied
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>

            {isAdmin && (
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                title="Regenerate code — old code will stop working"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
                           bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 
                           border border-orange-200 dark:border-orange-800
                           hover:bg-orange-100 dark:hover:bg-orange-900/40
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw size={16} className={regenerating ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{regenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            )}
          </div>
        </div>

        {isAdmin && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            ⚠ Regenerating the code will invalidate the old one. Anyone with the old code won&apos;t be able to join.
          </p>
        )}
      </CardBody>
    </Card>
  );
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id;
  const { currentProject, fetchProject, regenerateJoinCode, isLoading, error } = useProjectStore();
  const { tasks, fetchProjectTasks, upsertTaskFromSocket, removeTaskFromSocket } = useTaskStore();
  const { files, fetchProjectFiles, upsertFileFromSocket } = useFileStore();

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
      fetchProjectTasks(projectId);
      fetchProjectFiles(projectId);
    }
  }, [projectId, fetchProject, fetchProjectTasks, fetchProjectFiles]);

  useEffect(() => {
    if (!projectId) return undefined;

    socketService.connect();
    socketService.joinProject(projectId);

    const handleTaskCreated = (task) => upsertTaskFromSocket(task);
    const handleTaskUpdated = (task) => upsertTaskFromSocket(task);
    const handleTaskDeleted = ({ id }) => removeTaskFromSocket(id);
    // Refresh project when a new member joins (real-time)
    const handleMemberJoined = () => fetchProject(projectId);
    const handleFileUploaded = (file) => upsertFileFromSocket(file);
    const handleFileUpdated = (file) => upsertFileFromSocket(file);

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);
    socketService.onTaskDeleted(handleTaskDeleted);
    socketService.on('member-joined', handleMemberJoined);
    socketService.onFileUploaded(handleFileUploaded);
    socketService.onFileUpdated(handleFileUpdated);

    return () => {
      socketService.off('task-created', handleTaskCreated);
      socketService.off('task-updated', handleTaskUpdated);
      socketService.off('task-deleted', handleTaskDeleted);
      socketService.off('member-joined', handleMemberJoined);
      socketService.off('file-uploaded', handleFileUploaded);
      socketService.off('file-updated', handleFileUpdated);
      socketService.leaveProject(projectId);
    };
  }, [projectId, removeTaskFromSocket, upsertTaskFromSocket, fetchProject, upsertFileFromSocket]);

  const handleRegenerate = useCallback(async () => {
    const result = await regenerateJoinCode(projectId);
    if (!result.success) {
      alert(`Failed to regenerate code: ${result.error}`);
    }
  }, [projectId, regenerateJoinCode]);

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/projects')} aria-label="Back to projects">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-theme-text">
              {currentProject?.name || 'Project'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentProject?.description || 'Project workspace'}
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {isLoading && !currentProject ? (
          <div className="space-y-4">
            <div className="h-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-64 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
        ) : currentProject ? (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardBody className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <CheckCircle2 size={20} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tasks</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-theme-text">
                      {tasks.length || currentProject._count?.tasks || currentProject.tasks?.length || 0}
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <Users size={20} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Members</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-theme-text">
                      {currentProject._count?.members || currentProject.members?.length || 0}
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <Paperclip size={20} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Files</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-theme-text">
                      {files.length || currentProject._count?.files || 0}
                    </p>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <Calendar size={20} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-theme-text">
                      {formatDate(currentProject.createdAt)}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Join Code Panel */}
            <JoinCodePanel project={currentProject} onRegenerate={handleRegenerate} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Tasks */}
              <Card className="h-fit">
                <CardHeader>
                  <h2 className="font-semibold text-gray-900 dark:text-theme-text">Recent Tasks</h2>
                </CardHeader>
                <CardBody>
                  {tasks.length ? (
                    <div className="space-y-3">
                      {tasks.slice(0, 5).map((task) => (
                        <div key={task.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-theme-text">{task.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Due {formatDate(task.deadline)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge>{task.priority}</Badge>
                            <Badge variant={task.status === 'DONE' ? 'success' : 'warning'}>{task.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No tasks yet</p>
                  )}
                </CardBody>
              </Card>

              {/* Project Files */}
              <Card className="h-fit">
                <CardHeader>
                  <h2 className="font-semibold text-gray-900 dark:text-theme-text">Project Files</h2>
                </CardHeader>
                <CardBody>
                  <FileUpload 
                    projectId={projectId} 
                    className="mb-6"
                    onUploadComplete={() => fetchProjectFiles(projectId)} 
                  />
                  
                  {files.length ? (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-800">
                          <div className="flex items-center gap-3 overflow-hidden">
                            {file.type.startsWith('image/') ? (
                              <ImageIcon className="h-8 w-8 text-blue-500 shrink-0" />
                            ) : (
                              <FileIcon className="h-8 w-8 text-gray-400 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-sm text-gray-900 dark:text-theme-text truncate" title={file.name}>
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{Math.round(file.size / 1024)} KB</span>
                                <span>•</span>
                                <span>{formatDate(file.createdAt)}</span>
                                {file.uploadedBy && (
                                  <>
                                    <span>•</span>
                                    <span>by {file.uploadedBy.name}</span>
                                  </>
                                )}
                              </div>
                              {file.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2" title={file.description}>
                                  {file.description}
                                </p>
                              )}
                              {(file.tags || file.versionNote) && (
                                <div className="flex flex-wrap gap-1 mt-1.5">
                                  {file.versionNote && (
                                    <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-medium border border-blue-200 dark:border-blue-800">
                                      {file.versionNote}
                                    </span>
                                  )}
                                  {file.tags && file.tags.split(',').map((tag, i) => tag.trim() ? (
                                    <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[10px] border border-gray-200 dark:border-gray-700">
                                      {tag.trim()}
                                    </span>
                                  ) : null)}
                                </div>
                              )}
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 flex-shrink-0 ml-2"
                            title="Download"
                          >
                            <Download size={18} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">No files uploaded yet</p>
                  )}
                </CardBody>
              </Card>
            </div>

            <ProjectMembers projectId={projectId} project={currentProject} />
          </>
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <p className="text-gray-700 dark:text-gray-300">Project not found</p>
              <Button className="mt-4" onClick={() => router.push('/projects')}>
                Back to Projects
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
