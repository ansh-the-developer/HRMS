import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snuqlfgzzxaemxfyklvv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNudXFsZmd6enhhZW14ZnlrbHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MjY3NjksImV4cCI6MjA4ODMwMjc2OX0.TDZcdP5tJOmOA3_ApDIdqi_1ygCRjPWSMtKkyiFP8Ao';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("🌱 Starting database seeding for payroll verification...");

  // 1. Clean up existing seeded data for these specific test accounts to prevent duplicate key errors
  const testEmails = [
    'cindy.test@beekend.com',
    'biren.test@beekend.com',
    'akash.test@beekend.com',
    'muskan.test@beekend.com',
    'thonbam.test@beekend.com'
  ];

  try {
    // Fetch if they already exist
    const { data: existingEmps } = await supabase
      .from('employees')
      .select('id')
      .in('email', testEmails);
    
    if (existingEmps && existingEmps.length > 0) {
      const ids = existingEmps.map(e => e.id);
      console.log(`🧹 Cleaning up existing test records for IDs: ${ids.join(', ')}`);
      
      // Delete structures, payslips, leaves, attendance, reviews
      await supabase.from('salary_structures').delete().in('employee_id', ids);
      await supabase.from('payslips').delete().in('employee_id', ids);
      await supabase.from('leave_requests').delete().in('employee_id', ids);
      await supabase.from('attendance').delete().in('employee_id', ids);
      await supabase.from('performance_reviews').delete().in('employee_id', ids);
      await supabase.from('employees').delete().in('id', ids);
    }

    // 2. Insert new employees
    console.log("👥 Inserting realistic employees...");
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .insert([
        {
          name: 'Cindy Park',
          email: 'cindy.test@beekend.com',
          department: 'Kitchen',
          designation: 'Kitchen Manager',
          monthly_ctc: 120000,
          emp_code: 'BK-091',
          employee_type: 'Permanent',
          doj: '2026-01-01'
        },
        {
          name: 'Biren Manger',
          email: 'biren.test@beekend.com',
          department: 'Kitchen',
          designation: 'Senior Cook',
          monthly_ctc: 45000,
          emp_code: 'BK-092',
          employee_type: 'Permanent',
          doj: '2026-02-15'
        },
        {
          name: 'Akash Rai',
          email: 'akash.test@beekend.com',
          department: 'Kitchen',
          designation: 'Junior Cook',
          monthly_ctc: 30000,
          emp_code: 'BK-093',
          employee_type: 'Permanent',
          doj: '2026-03-01'
        },
        {
          name: 'Muskan Sharma',
          email: 'muskan.test@beekend.com',
          department: 'Hospitality',
          designation: 'Lead Barista',
          monthly_ctc: 24000,
          emp_code: 'BK-094',
          employee_type: 'Permanent',
          doj: '2026-04-10'
        },
        {
          name: 'Thonbamliu Newmai',
          email: 'thonbam.test@beekend.com',
          department: 'HR',
          designation: 'HR Specialist',
          monthly_ctc: 65000,
          emp_code: 'BK-095',
          employee_type: 'Permanent',
          doj: '2026-05-01'
        }
      ])
      .select();

    if (empError) throw empError;
    console.log(`✅ Seeded ${employees.length} employees successfully.`);

    const cindy = employees.find(e => e.email === 'cindy.test@beekend.com');
    const biren = employees.find(e => e.email === 'biren.test@beekend.com');
    const akash = employees.find(e => e.email === 'akash.test@beekend.com');
    const muskan = employees.find(e => e.email === 'muskan.test@beekend.com');
    const thonbam = employees.find(e => e.email === 'thonbam.test@beekend.com');

    // 3. Create Custom Salary Structures for them
    console.log("💰 Creating salary structures breakdown...");
    const { error: structError } = await supabase
      .from('salary_structures')
      .insert([
        {
          employee_id: cindy.id,
          basic: 60000,
          hra: 30000,
          da: 6000,
          other_allowances: 24000,
          pf_percent: 12,
          esi_percent: 0, // CTC > 21k
          tds_percent: 10,
          custom_earnings: { "Vehicle Allowance": 5000 },
          custom_deductions: { "Professional Tax": 200 }
        },
        {
          employee_id: biren.id,
          basic: 22500,
          hra: 11250,
          da: 2250,
          other_allowances: 9000,
          pf_percent: 12,
          esi_percent: 0,
          tds_percent: 5,
          custom_earnings: {},
          custom_deductions: { "Professional Tax": 200 }
        },
        {
          employee_id: akash.id,
          basic: 15000,
          hra: 7500,
          da: 1500,
          other_allowances: 6000,
          pf_percent: 12,
          esi_percent: 0.75, // CTC <= 21k if pro-rated, wait ctc is 30k so technically ESI is 0, but let's test ESI calculations
          tds_percent: 0,
          custom_earnings: {},
          custom_deductions: {}
        },
        {
          employee_id: muskan.id,
          basic: 12000,
          hra: 6000,
          da: 1200,
          other_allowances: 4800,
          pf_percent: 12,
          esi_percent: 0.75, // CTC is 24k, but let's test if ESI applies
          tds_percent: 0,
          custom_earnings: { "Internet Allowance": 1000 },
          custom_deductions: {}
        },
        {
          employee_id: thonbam.id,
          basic: 32500,
          hra: 16250,
          da: 3250,
          other_allowances: 13000,
          pf_percent: 12,
          esi_percent: 0,
          tds_percent: 7.5,
          custom_earnings: {},
          custom_deductions: { "Professional Tax": 200 }
        }
      ]);
    if (structError) throw structError;
    console.log("✅ Seeded salary structures successfully.");

    // 4. Create approved leave requests for Akash (unpaid leaves check)
    console.log("📅 Seeding approved leaves...");
    const { error: leavesError } = await supabase
      .from('leave_requests')
      .insert([
        {
          employee_id: akash.id,
          start_date: '2026-07-03',
          end_date: '2026-07-04',
          leave_type: 'Casual',
          reason: 'Sick leave recovery',
          status: 'Approved'
        }
      ]);
    if (leavesError) throw leavesError;
    console.log("✅ Seeded leave requests successfully.");

    // 5. Create performance reviews for Biren (score: 4.8) for bonus calculation
    console.log("⭐ Seeding performance reviews...");
    const { error: reviewError } = await supabase
      .from('performance_reviews')
      .insert([
        {
          employee_id: biren.id,
          reviewer_id: thonbam.id,
          score: 4.8,
          comments: 'Exceptional kitchen quality and leadership.',
          created_at: '2026-07-05T12:00:00Z'
        }
      ]);
    if (reviewError) throw reviewError;
    console.log("✅ Seeded performance reviews successfully.");

    // 6. Create attendance logs for July 1st to July 8th, 2026
    console.log("⏰ Seeding attendance logs (with overtime, weekends, leaves)...");
    const logs = [];
    
    // Cindy: 100% Present (Jul 1 - Jul 8, weekends as Off Days)
    // Biren: Present, but 1 day Absent
    // Akash: Present, but 2 days On Leave (approved)
    // Muskan: Present, with 2 Overtime days (10 hours worked each)
    // Thonbam: 100% Present
    
    const dates = [
      { date: '2026-07-01', day: 'Wed' },
      { date: '2026-07-02', day: 'Thu' },
      { date: '2026-07-03', day: 'Fri' },
      { date: '2026-07-04', day: 'Sat' }, // Weekend
      { date: '2026-07-05', day: 'Sun' }, // Weekend
      { date: '2026-07-06', day: 'Mon' },
      { date: '2026-07-07', day: 'Tue' },
      { date: '2026-07-08', day: 'Wed' }
    ];

    dates.forEach(d => {
      const isWeekend = d.day === 'Sat' || d.day === 'Sun';

      // Cindy
      logs.push({
        employee_id: cindy.id,
        date: d.date,
        in_time: isWeekend ? '' : '09:00 AM',
        out_time: isWeekend ? '' : '05:00 PM',
        status: isWeekend ? 'Off Day' : 'Present'
      });

      // Biren
      // Absent on Wednesday July 1st
      const birenStatus = d.date === '2026-07-01' ? 'Absent' : (isWeekend ? 'Off Day' : 'Present');
      logs.push({
        employee_id: biren.id,
        date: d.date,
        in_time: birenStatus === 'Present' ? '09:10 AM' : '',
        out_time: birenStatus === 'Present' ? '05:15 PM' : '',
        status: birenStatus
      });

      // Akash
      // Approved leaves on Jul 3 & Jul 4
      let akashStatus = 'Present';
      if (d.date === '2026-07-03' || d.date === '2026-07-04') {
        akashStatus = 'On Leave';
      } else if (isWeekend) {
        akashStatus = 'Off Day';
      }
      logs.push({
        employee_id: akash.id,
        date: d.date,
        in_time: akashStatus === 'Present' ? '08:55 AM' : '',
        out_time: akashStatus === 'Present' ? '05:00 PM' : '',
        status: akashStatus
      });

      // Muskan
      // Overtime (11 hours worked: 9 AM to 8 PM) on Monday July 6th and Tuesday July 7th
      const isOvertimeDay = d.date === '2026-07-06' || d.date === '2026-07-07';
      logs.push({
        employee_id: muskan.id,
        date: d.date,
        in_time: isWeekend ? '' : '09:00 AM',
        out_time: isWeekend ? '' : (isOvertimeDay ? '08:00 PM' : '05:00 PM'), // 3 hours overtime each day = 6 hours total!
        status: isWeekend ? 'Off Day' : 'Present'
      });

      // Thonbam
      logs.push({
        employee_id: thonbam.id,
        date: d.date,
        in_time: isWeekend ? '' : '09:05 AM',
        out_time: isWeekend ? '' : '05:05 PM',
        status: isWeekend ? 'Off Day' : 'Present'
      });
    });

    const { error: attError } = await supabase
      .from('attendance')
      .insert(logs);
    
    if (attError) throw attError;
    console.log(`✅ Seeded ${logs.length} attendance logs successfully.`);

    console.log("\n🚀 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("You can now open the Payroll Console for July 2026 (2026-07) and click 'Generate Payroll' to see these records processed!");
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  }
}

run();
