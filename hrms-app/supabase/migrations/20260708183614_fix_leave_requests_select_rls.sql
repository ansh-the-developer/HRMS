-- Allow SELECT for all roles (anon, authenticated, etc.)
DROP POLICY IF EXISTS "Public read leave_requests" ON public.leave_requests;
CREATE POLICY "Public read leave_requests" ON public.leave_requests FOR SELECT USING (true);

-- Allow INSERT for all roles (anon, authenticated, etc.)
DROP POLICY IF EXISTS "Public can insert leave_requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Authenticated users can insert leave_requests" ON public.leave_requests;
CREATE POLICY "Public can insert leave_requests" ON public.leave_requests FOR INSERT WITH CHECK (true);

-- Allow UPDATE for all roles
DROP POLICY IF EXISTS "Public update leave_requests" ON public.leave_requests;
CREATE POLICY "Public update leave_requests" ON public.leave_requests FOR UPDATE USING (true) WITH CHECK (true);

-- Allow DELETE for all roles
DROP POLICY IF EXISTS "Authenticated users can delete own leave_requests" ON public.leave_requests;
CREATE POLICY "Public can delete leave_requests" ON public.leave_requests FOR DELETE USING (true);