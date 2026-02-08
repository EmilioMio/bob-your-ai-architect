-- Create function to update timestamps (must exist before trigger)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Projects table for workspace functionality
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'web',
  form_data JSONB NOT NULL DEFAULT '{}',
  conversation_history JSONB NOT NULL DEFAULT '[]',
  architecture JSONB,
  blueprint JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects
CREATE POLICY "Users can view their own projects"
ON public.projects FOR SELECT
USING (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

-- Policy: Users can create their own projects
CREATE POLICY "Users can create projects"
ON public.projects FOR INSERT
WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

-- Policy: Users can update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects FOR UPDATE
USING (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete their own projects"
ON public.projects FOR DELETE
USING (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

-- Trigger for updated_at on projects
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Compliance reports table
CREATE TABLE public.compliance_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id TEXT,
  upload_type TEXT NOT NULL,
  source_url TEXT,
  file_structure JSONB NOT NULL DEFAULT '{}',
  violations JSONB NOT NULL DEFAULT '[]',
  suggestions JSONB NOT NULL DEFAULT '[]',
  compliance_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for compliance reports
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;

-- Policies for compliance reports
CREATE POLICY "Users can view their own compliance reports"
ON public.compliance_reports FOR SELECT
USING (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

CREATE POLICY "Users can create compliance reports"
ON public.compliance_reports FOR INSERT
WITH CHECK (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

CREATE POLICY "Users can update their own compliance reports"
ON public.compliance_reports FOR UPDATE
USING (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));

CREATE POLICY "Users can delete their own compliance reports"
ON public.compliance_reports FOR DELETE
USING (auth.uid() = user_id OR (user_id IS NULL AND local_id IS NOT NULL));