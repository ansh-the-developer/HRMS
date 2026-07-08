-- 1. Alter leave_requests to support documents
ALTER TABLE public.leave_requests ADD COLUMN IF NOT EXISTS document_url TEXT;

-- 2. Create complaints table
CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id VARCHAR(20) UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' NOT NULL, -- 'Active', 'Resolved'
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    resolved_at TIMESTAMPTZ
);

-- Enable RLS for complaints
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Policies for complaints
CREATE POLICY "Allow anonymous complaint insertion" ON public.complaints
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow SELECT by case_id" ON public.complaints
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "HR and Managers have access to complaints" ON public.complaints
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND (role = 'hr' OR role = 'manager')
        )
    );

-- 3. Create storage bucket for leave attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('leaves', 'leaves', true) 
ON CONFLICT (id) DO NOTHING;

-- Policies for leaves bucket objects
CREATE POLICY "Allow public upload to leaves bucket" ON storage.objects 
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'leaves');

CREATE POLICY "Allow public select from leaves bucket" ON storage.objects 
    FOR SELECT TO authenticated USING (bucket_id = 'leaves');
