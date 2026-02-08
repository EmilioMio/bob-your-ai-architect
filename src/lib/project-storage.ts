import { supabase } from '@/integrations/supabase/client';
import { ProjectFormData, ChatMessage, GeneratedArchitecture } from '@/components/builder/types';
import { Blueprint } from './blueprint-generator';
import type { Json } from '@/integrations/supabase/types';

export interface SavedProject {
  id: string;
  name: string;
  description: string | null;
  projectType: string;
  formData: ProjectFormData;
  conversationHistory: ChatMessage[];
  architecture: GeneratedArchitecture | null;
  blueprint: Blueprint | null;
  status: 'draft' | 'complete' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

function getLocalId(): string {
  let localId = localStorage.getItem('bob_local_id');
  if (!localId) {
    localId = 'local_' + crypto.randomUUID();
    localStorage.setItem('bob_local_id', localId);
  }
  return localId;
}

export async function saveProject(
  name: string,
  formData: ProjectFormData,
  conversationHistory: ChatMessage[],
  architecture: GeneratedArchitecture | null,
  blueprint: Blueprint | null,
  projectId?: string
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const localId = getLocalId();
    
    const projectData = {
      name,
      description: formData.project,
      project_type: architecture?.projectType || 'web',
      form_data: JSON.parse(JSON.stringify(formData)) as Json,
      conversation_history: JSON.parse(JSON.stringify(conversationHistory)) as Json,
      architecture: architecture ? JSON.parse(JSON.stringify(architecture)) as Json : null,
      blueprint: blueprint ? JSON.parse(JSON.stringify(blueprint)) as Json : null,
      status: architecture ? 'complete' : 'draft',
      user_id: user?.id || null,
      local_id: user ? null : localId,
    };

    if (projectId) {
      const { error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', projectId);
      
      if (error) throw error;
      return projectId;
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select('id')
        .single();
      
      if (error) throw error;
      return data?.id || null;
    }
  } catch (error) {
    console.error('Failed to save project:', error);
    return null;
  }
}

export async function loadProjects(): Promise<SavedProject[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const localId = getLocalId();
    
    let query = supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (user) {
      query = query.eq('user_id', user.id);
    } else {
      query = query.eq('local_id', localId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      projectType: p.project_type,
      formData: p.form_data as unknown as ProjectFormData,
      conversationHistory: (p.conversation_history || []) as unknown as ChatMessage[],
      architecture: p.architecture as unknown as GeneratedArchitecture | null,
      blueprint: p.blueprint as unknown as Blueprint | null,
      status: p.status as 'draft' | 'complete' | 'archived',
      createdAt: new Date(p.created_at),
      updatedAt: new Date(p.updated_at),
    }));
  } catch (error) {
    console.error('Failed to load projects:', error);
    return [];
  }
}

export async function loadProject(projectId: string): Promise<SavedProject | null> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();
    
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      projectType: data.project_type,
      formData: data.form_data as unknown as ProjectFormData,
      conversationHistory: (data.conversation_history || []) as unknown as ChatMessage[],
      architecture: data.architecture as unknown as GeneratedArchitecture | null,
      blueprint: data.blueprint as unknown as Blueprint | null,
      status: data.status as 'draft' | 'complete' | 'archived',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

export async function deleteProject(projectId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete project:', error);
    return false;
  }
}

export async function migrateLocalToUser(userId: string): Promise<void> {
  try {
    const localId = localStorage.getItem('bob_local_id');
    if (!localId) return;
    
    await supabase
      .from('projects')
      .update({ user_id: userId, local_id: null })
      .eq('local_id', localId);
    
    await supabase
      .from('compliance_reports')
      .update({ user_id: userId, local_id: null })
      .eq('local_id', localId);
    
    console.log('Migrated local projects to user account');
  } catch (error) {
    console.error('Failed to migrate local projects:', error);
  }
}
