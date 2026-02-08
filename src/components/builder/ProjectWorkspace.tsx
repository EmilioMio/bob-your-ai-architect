import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, FolderOpen, Trash2, Clock, Archive, 
  ChevronRight, Loader2, X, Check
} from 'lucide-react';
import { loadProjects, deleteProject, SavedProject } from '@/lib/project-storage';
import { Badge } from '@/components/ui/badge';

interface ProjectWorkspaceProps {
  onSelectProject: (project: SavedProject) => void;
  onNewProject: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectWorkspace({ 
  onSelectProject, 
  onNewProject, 
  isOpen, 
  onClose 
}: ProjectWorkspaceProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadProjectList();
    }
  }, [isOpen]);

  const loadProjectList = async () => {
    setIsLoading(true);
    const loaded = await loadProjects();
    setProjects(loaded);
    setIsLoading(false);
  };

  const handleDelete = async (projectId: string) => {
    if (confirmDeleteId !== projectId) {
      setConfirmDeleteId(projectId);
      return;
    }
    
    setDeletingId(projectId);
    const success = await deleteProject(projectId);
    if (success) {
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-emerald-500/20 text-emerald-600';
      case 'draft': return 'bg-amber-500/20 text-amber-600';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-card rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Your Projects</h2>
              <p className="text-sm text-muted-foreground">
                {projects.length} project{projects.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onNewProject();
                  onClose();
                }}
                className="btn-primary text-sm py-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Project
              </button>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh] p-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No projects yet</p>
                <button
                  onClick={() => {
                    onNewProject();
                    onClose();
                  }}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Project
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => {
                        onSelectProject(project);
                        onClose();
                      }}
                      className="w-full p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-all text-left"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {project.name}
                            </h3>
                            <Badge className={`text-[10px] ${getStatusColor(project.status)}`}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {project.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(project.updatedAt)}
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {project.projectType}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                      </div>
                    </button>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      disabled={deletingId === project.id}
                      className={`absolute top-4 right-12 p-2 rounded-lg transition-all ${
                        confirmDeleteId === project.id
                          ? 'bg-destructive text-destructive-foreground'
                          : 'opacity-0 group-hover:opacity-100 bg-muted hover:bg-destructive hover:text-destructive-foreground'
                      }`}
                    >
                      {deletingId === project.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : confirmDeleteId === project.id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground text-center">
              Projects are saved {projects.some(p => p.formData) ? 'to your workspace' : 'locally in your browser'}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
