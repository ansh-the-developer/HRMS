-- 1. Clean up existing test data
DELETE FROM public.salary_structures WHERE employee_id IN (SELECT id FROM public.employees WHERE email LIKE '%.test@beekend.com');
DELETE FROM public.payslips WHERE employee_id IN (SELECT id FROM public.employees WHERE email LIKE '%.test@beekend.com');
DELETE FROM public.leave_requests WHERE employee_id IN (SELECT id FROM public.employees WHERE email LIKE '%.test@beekend.com');
DELETE FROM public.attendance WHERE employee_id IN (SELECT id FROM public.employees WHERE email LIKE '%.test@beekend.com');
DELETE FROM public.performance_reviews WHERE employee_id IN (SELECT id FROM public.employees WHERE email LIKE '%.test@beekend.com');
DELETE FROM public.employees WHERE email LIKE '%.test@beekend.com';

-- 2. Run transactional PL/pgSQL block to link IDs
DO $$
DECLARE
    cindy_id UUID;
    biren_id UUID;
    akash_id UUID;
    muskan_id UUID;
    thonbam_id UUID;
BEGIN
    -- Insert employees
    INSERT INTO public.employees (name, email, department, designation, monthly_ctc, emp_code, employee_type, doj)
    VALUES ('Cindy Park', 'cindy.test@beekend.com', 'Kitchen', 'Kitchen Manager', 120000, 'BK-091', 'Permanent', '2026-01-01')
    RETURNING id INTO cindy_id;

    INSERT INTO public.employees (name, email, department, designation, monthly_ctc, emp_code, employee_type, doj)
    VALUES ('Biren Manger', 'biren.test@beekend.com', 'Kitchen', 'Senior Cook', 45000, 'BK-092', 'Permanent', '2026-02-15')
    RETURNING id INTO biren_id;

    INSERT INTO public.employees (name, email, department, designation, monthly_ctc, emp_code, employee_type, doj)
    VALUES ('Akash Rai', 'akash.test@beekend.com', 'Kitchen', 'Junior Cook', 30000, 'BK-093', 'Permanent', '2026-03-01')
    RETURNING id INTO akash_id;

    INSERT INTO public.employees (name, email, department, designation, monthly_ctc, emp_code, employee_type, doj)
    VALUES ('Muskan Sharma', 'muskan.test@beekend.com', 'Hospitality', 'Lead Barista', 24000, 'BK-094', 'Permanent', '2026-04-10')
    RETURNING id INTO muskan_id;

    INSERT INTO public.employees (name, email, department, designation, monthly_ctc, emp_code, employee_type, doj)
    VALUES ('Thonbamliu Newmai', 'thonbam.test@beekend.com', 'HR', 'HR Specialist', 65000, 'BK-095', 'Permanent', '2026-05-01')
    RETURNING id INTO thonbam_id;

    -- Insert salary structures
    INSERT INTO public.salary_structures (employee_id, basic, hra, da, other_allowances, pf_percent, esi_percent, tds_percent, custom_earnings, custom_deductions)
    VALUES 
        (cindy_id, 60000, 30000, 6000, 24000, 12, 0, 10, '{"Vehicle Allowance": 5000}', '{"Professional Tax": 200}'),
        (biren_id, 22500, 11250, 2250, 9000, 12, 0, 5, '{}', '{"Professional Tax": 200}'),
        (akash_id, 15000, 7500, 1500, 6000, 12, 0.75, 0, '{}', '{}'),
        (muskan_id, 12000, 6000, 1200, 4800, 12, 0.75, 0, '{"Internet Allowance": 1000}', '{}'),
        (thonbam_id, 32500, 16250, 3250, 13000, 12, 0, 7.5, '{}', '{"Professional Tax": 200}');

    -- Insert approved leaves for Akash
    INSERT INTO public.leave_requests (employee_id, start_date, end_date, type, reason, status)
    VALUES (akash_id, '2026-07-03', '2026-07-04', 'Casual', 'Sick leave recovery', 'Approved');

    -- Insert performance reviews for Biren
    INSERT INTO public.performance_reviews (employee_id, reviewer_name, period, knowledge_score, quality_score, comments, status, created_at)
    VALUES (biren_id, 'Thonbamliu Newmai', 'July 2026', 5, 5, 'Exceptional kitchen quality and leadership.', 'Approved', '2026-07-05 12:00:00+00');

    -- Insert attendance logs for Cindy, Biren, Akash, Muskan, Thonbam (Jul 1 - Jul 8)
    
    -- Wednesday July 1
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-01', '09:00 AM', '05:00 PM', 'Present'),
        (biren_id, '2026-07-01', '', '', 'Absent'),
        (akash_id, '2026-07-01', '08:55 AM', '05:00 PM', 'Present'),
        (muskan_id, '2026-07-01', '09:00 AM', '05:00 PM', 'Present'),
        (thonbam_id, '2026-07-01', '09:05 AM', '05:05 PM', 'Present');

    -- Thursday July 2
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-02', '09:00 AM', '05:00 PM', 'Present'),
        (biren_id, '2026-07-02', '09:10 AM', '05:15 PM', 'Present'),
        (akash_id, '2026-07-02', '08:55 AM', '05:00 PM', 'Present'),
        (muskan_id, '2026-07-02', '09:00 AM', '05:00 PM', 'Present'),
        (thonbam_id, '2026-07-02', '09:05 AM', '05:05 PM', 'Present');

    -- Friday July 3 (Akash on leave)
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-03', '09:00 AM', '05:00 PM', 'Present'),
        (biren_id, '2026-07-03', '09:10 AM', '05:15 PM', 'Present'),
        (akash_id, '2026-07-03', '', '', 'On Leave'),
        (muskan_id, '2026-07-03', '09:00 AM', '05:00 PM', 'Present'),
        (thonbam_id, '2026-07-03', '09:05 AM', '05:05 PM', 'Present');

    -- Saturday July 4 (Weekend, Akash still on leave)
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-04', '', '', 'Off Day'),
        (biren_id, '2026-07-04', '', '', 'Off Day'),
        (akash_id, '2026-07-04', '', '', 'On Leave'),
        (muskan_id, '2026-07-04', '', '', 'Off Day'),
        (thonbam_id, '2026-07-04', '', '', 'Off Day');

    -- Sunday July 5 (Weekend)
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-05', '', '', 'Off Day'),
        (biren_id, '2026-07-05', '', '', 'Off Day'),
        (akash_id, '2026-07-05', '', '', 'Off Day'),
        (muskan_id, '2026-07-05', '', '', 'Off Day'),
        (thonbam_id, '2026-07-05', '', '', 'Off Day');

    -- Monday July 6 (Overtime for Muskan)
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-06', '09:00 AM', '05:00 PM', 'Present'),
        (biren_id, '2026-07-06', '09:10 AM', '05:15 PM', 'Present'),
        (akash_id, '2026-07-06', '08:55 AM', '05:00 PM', 'Present'),
        (muskan_id, '2026-07-06', '09:00 AM', '08:00 PM', 'Present'), -- 3 hours overtime
        (thonbam_id, '2026-07-06', '09:05 AM', '05:05 PM', 'Present');

    -- Tuesday July 7 (Overtime for Muskan)
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-07', '09:00 AM', '05:00 PM', 'Present'),
        (biren_id, '2026-07-07', '09:10 AM', '05:15 PM', 'Present'),
        (akash_id, '2026-07-07', '08:55 AM', '05:00 PM', 'Present'),
        (muskan_id, '2026-07-07', '09:00 AM', '08:00 PM', 'Present'), -- 3 hours overtime
        (thonbam_id, '2026-07-07', '09:05 AM', '05:05 PM', 'Present');

    -- Wednesday July 8
    INSERT INTO public.attendance (employee_id, date, in_time, out_time, status) VALUES
        (cindy_id, '2026-07-08', '09:00 AM', '05:00 PM', 'Present'),
        (biren_id, '2026-07-08', '09:10 AM', '05:15 PM', 'Present'),
        (akash_id, '2026-07-08', '08:55 AM', '05:00 PM', 'Present'),
        (muskan_id, '2026-07-08', '09:00 AM', '05:00 PM', 'Present'),
        (thonbam_id, '2026-07-08', '09:05 AM', '05:05 PM', 'Present');
END $$;
