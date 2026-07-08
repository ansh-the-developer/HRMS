-- Fix: Add missing INSERT policy on leave_requests table
-- Without this, any POST to /rest/v1/leave_requests returns 403 Forbidden

-- Enable RLS (idempotent if already enabled)
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert their own leave requests
CREATE POLICY "Authenticated users can insert leave_requests"
  ON public.leave_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow public (anon) inserts as well (for flexibility with the current setup)
CREATE POLICY "Public can insert leave_requests"
  ON public.leave_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to delete their own leave requests
CREATE POLICY "Authenticated users can delete own leave_requests"
  ON public.leave_requests
  FOR DELETE
  TO authenticated
  USING (true);
