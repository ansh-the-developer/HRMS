-- Create salary_structures table
CREATE TABLE IF NOT EXISTS public.salary_structures (
    employee_id UUID PRIMARY KEY REFERENCES public.employees(id) ON DELETE CASCADE,
    basic NUMERIC DEFAULT 0 NOT NULL,
    hra NUMERIC DEFAULT 0 NOT NULL,
    da NUMERIC DEFAULT 0 NOT NULL,
    other_allowances NUMERIC DEFAULT 0 NOT NULL,
    pf_percent NUMERIC DEFAULT 12 NOT NULL,
    esi_percent NUMERIC DEFAULT 0.75 NOT NULL,
    tds_percent NUMERIC DEFAULT 0 NOT NULL,
    custom_earnings JSONB DEFAULT '{}'::jsonb NOT NULL,
    custom_deductions JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for salary_structures
ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;

-- Policies for salary_structures
CREATE POLICY "Admins have full access to salary_structures" ON public.salary_structures
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'hr'
        )
    );

CREATE POLICY "Employees can read their own salary structure" ON public.salary_structures
    FOR SELECT TO authenticated USING (
        employee_id IN (
            SELECT id FROM public.employees
            WHERE auth_user_id = auth.uid()
        )
    );

-- Create payroll_runs table
CREATE TABLE IF NOT EXISTS public.payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    month VARCHAR(7) UNIQUE NOT NULL, -- format 'YYYY-MM'
    status VARCHAR(20) DEFAULT 'draft' NOT NULL, -- 'draft', 'approved', 'paid'
    locked BOOLEAN DEFAULT false NOT NULL,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS for payroll_runs
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;

-- Policies for payroll_runs
CREATE POLICY "Admins have full access to payroll_runs" ON public.payroll_runs
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'hr'
        )
    );

-- Create payslips table
CREATE TABLE IF NOT EXISTS public.payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID REFERENCES public.payroll_runs(id) ON DELETE CASCADE NOT NULL,
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
    month VARCHAR(7) NOT NULL, -- format 'YYYY-MM'
    basic NUMERIC DEFAULT 0 NOT NULL,
    hra NUMERIC DEFAULT 0 NOT NULL,
    da NUMERIC DEFAULT 0 NOT NULL,
    other_allowances NUMERIC DEFAULT 0 NOT NULL,
    custom_earnings JSONB DEFAULT '{}'::jsonb NOT NULL,
    overtime_hours NUMERIC DEFAULT 0 NOT NULL,
    overtime_pay NUMERIC DEFAULT 0 NOT NULL,
    bonus NUMERIC DEFAULT 0 NOT NULL,
    incentives NUMERIC DEFAULT 0 NOT NULL,
    pf NUMERIC DEFAULT 0 NOT NULL,
    esi NUMERIC DEFAULT 0 NOT NULL,
    tds NUMERIC DEFAULT 0 NOT NULL,
    custom_deductions JSONB DEFAULT '{}'::jsonb NOT NULL,
    other_deductions NUMERIC DEFAULT 0 NOT NULL,
    gross_salary NUMERIC DEFAULT 0 NOT NULL,
    net_salary NUMERIC DEFAULT 0 NOT NULL,
    present_days INT DEFAULT 0 NOT NULL,
    absent_days INT DEFAULT 0 NOT NULL,
    leave_days INT DEFAULT 0 NOT NULL,
    off_days INT DEFAULT 0 NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' NOT NULL, -- 'pending', 'paid'
    payment_date TIMESTAMPTZ,
    payment_method VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE(payroll_run_id, employee_id),
    UNIQUE(month, employee_id)
);

-- Enable RLS for payslips
ALTER TABLE public.payslips ENABLE ROW LEVEL SECURITY;

-- Policies for payslips
CREATE POLICY "Admins have full access to payslips" ON public.payslips
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'hr'
        )
    );

CREATE POLICY "Employees can read their own payslips" ON public.payslips
    FOR SELECT TO authenticated USING (
        employee_id IN (
            SELECT id FROM public.employees
            WHERE auth_user_id = auth.uid()
        )
    );
