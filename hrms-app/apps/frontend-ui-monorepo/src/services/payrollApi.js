// src/services/payrollApi.js
import { supabase } from "@/lib/supabaseClient";

/**
 * Helper to get the number of days in a given month (YYYY-MM)
 */
function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * Helper to parse time string (e.g. "09:00 AM", "06:30 PM") and return hours as decimal
 */
function parseTimeToHours(timeStr) {
  if (!timeStr) return 0;
  const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
  if (!match) return 0;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  
  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  
  return hours + minutes / 60;
}

// ─── SALARY STRUCTURES ───────────────────────────────────────────────────────

export async function getSalaryStructure(employeeId) {
  const { data, error } = await supabase
    .from("salary_structures")
    .select("*")
    .eq("employee_id", employeeId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching salary structure:", error.message);
    throw error;
  }
  return data;
}

export async function saveSalaryStructure(employeeId, payload) {
  const { data, error } = await supabase
    .from("salary_structures")
    .upsert({ employee_id: employeeId, ...payload, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error("Error saving salary structure:", error.message);
    throw error;
  }
  return data;
}

// ─── PAYROLL RUNS ────────────────────────────────────────────────────────────

export async function getPayrollRuns() {
  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .order("month", { ascending: false });

  if (error) {
    console.error("Error fetching payroll runs:", error.message);
    throw error;
  }
  return data;
}

export async function getPayrollRunByMonth(month) {
  const { data, error } = await supabase
    .from("payroll_runs")
    .select("*")
    .eq("month", month)
    .maybeSingle();

  if (error) {
    console.error("Error fetching payroll run by month:", error.message);
    throw error;
  }
  return data;
}

export async function getPayrollRunDetails(month) {
  const { data, error } = await supabase
    .from("payslips")
    .select(`
      *,
      employees (
        id,
        name,
        email,
        emp_code,
        department,
        designation
      )
    `)
    .eq("month", month)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching payslips for month:", error.message);
    throw error;
  }
  return data;
}

export async function updatePayrollRunStatus(month, status) {
  const { data, error } = await supabase
    .from("payroll_runs")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("month", month)
    .select()
    .single();

  if (error) {
    console.error("Error updating payroll run status:", error.message);
    throw error;
  }
  
  // If run status is updated to 'paid', we update all associated payslips to 'paid'
  if (status === "paid") {
    const { error: slipsError } = await supabase
      .from("payslips")
      .update({ 
        payment_status: "paid", 
        payment_date: new Date().toISOString(),
        payment_method: "Bank Transfer",
        updated_at: new Date().toISOString() 
      })
      .eq("month", month);
      
    if (slipsError) {
      console.error("Error updating payslips status to paid:", slipsError.message);
      throw slipsError;
    }
  }
  
  return data;
}

export async function lockPayrollRun(month) {
  const { data, error } = await supabase
    .from("payroll_runs")
    .update({ locked: true, updated_at: new Date().toISOString() })
    .eq("month", month)
    .select()
    .single();

  if (error) {
    console.error("Error locking payroll run:", error.message);
    throw error;
  }
  return data;
}

// ─── PAYSLIPS / PAYROLL GENERATION ───────────────────────────────────────────

export async function generatePayrollForMonth(month) {
  try {
    // 1. Check if payroll run exists and is locked
    const existingRun = await getPayrollRunByMonth(month);
    if (existingRun && existingRun.locked) {
      throw new Error(`Payroll for ${month} is finalized and locked. Duplicate generation blocked.`);
    }

    // 2. Fetch all active employees
    const { data: employees, error: empError } = await supabase
      .from("employees")
      .select("id, name, email, monthly_ctc, doj");
    if (empError) throw empError;
    if (!employees || employees.length === 0) {
      throw new Error("No employees found to generate payroll.");
    }

    // 3. Query all attendance records for this month
    const [yearStr, monthStr] = month.split("-");
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10);
    const totalDays = getDaysInMonth(year, monthNum);
    
    const startDate = `${month}-01`;
    const endDate = `${month}-${String(totalDays).padStart(2, "0")}`;

    const { data: attendance, error: attError } = await supabase
      .from("attendance")
      .select("*")
      .gte("date", startDate)
      .lte("date", endDate);
    if (attError) throw attError;

    // 4. Query all salary structures
    const { data: structures, error: structError } = await supabase
      .from("salary_structures")
      .select("*");
    if (structError) throw structError;

    // 5. Query approved leave requests in the month (to log leave counts)
    const { data: leaves, error: leavesError } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("status", "Approved")
      .lte("start_date", endDate)
      .gte("end_date", startDate);
    if (leavesError) throw leavesError;

    // 6. Query performance reviews for bonus modifiers
    const { data: reviews, error: reviewError } = await supabase
      .from("performance_reviews")
      .select("*")
      .gte("created_at", `${startDate}T00:00:00Z`)
      .lte("created_at", `${endDate}T23:59:59Z`);
    if (reviewError) throw reviewError;

    // Start database transaction / batch insert
    const payslipsToInsert = [];

    for (const emp of employees) {
      const ctc = emp.monthly_ctc || 30000; // default ctc
      
      // Look up specific salary structure
      const struct = structures?.find((s) => s.employee_id === emp.id) || null;
      
      // Base components values
      let basic = struct ? struct.basic : ctc * 0.50;
      let hra = struct ? struct.hra : basic * 0.50;
      let da = struct ? struct.da : basic * 0.10;
      let allowances = struct ? struct.other_allowances : ctc - basic - hra - da;
      
      let pfPercent = struct ? struct.pf_percent : 12;
      let esiPercent = struct ? struct.esi_percent : 0.75;
      let tdsPercent = struct ? struct.tds_percent : 0;
      
      let customEarnings = struct ? struct.custom_earnings : {};
      let customDeductions = struct ? struct.custom_deductions : {};

      // ── Attendance Metrics ──
      const empLogs = attendance?.filter((a) => a.employee_id === emp.id) || [];
      
      let presentDays = 0;
      let offDays = 0;
      let leaveDays = 0;
      let absentDays = 0;
      let overtimeHours = 0;

      // Map logs to days of the month
      for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${month}-${String(day).padStart(2, "0")}`;
        const log = empLogs.find((l) => l.date === dateStr);
        
        if (log) {
          const status = log.status;
          if (status === "Present") {
            presentDays++;
            // Calculate overtime: basic rate is 8 hour shift
            if (log.in_time && log.out_time) {
              const inHrs = parseTimeToHours(log.in_time);
              const outHrs = parseTimeToHours(log.out_time);
              const worked = outHrs - inHrs;
              if (worked > 8.0) {
                overtimeHours += (worked - 8.0);
              }
            }
          } else if (status === "Off Day") {
            offDays++;
          } else if (status === "On Leave") {
            leaveDays++;
          } else {
            absentDays++;
          }
        } else {
          // Default fallbacks for unlogged days
          const dateObj = new Date(year, monthNum - 1, day);
          const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
          
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            // Weekend rest day
            offDays++;
          } else {
            // Default unpaid absence if no check-in logged
            absentDays++;
          }
        }
      }

      // ── Calculations ──
      const paidDays = presentDays + offDays;
      const proRationFactor = paidDays / totalDays;

      // Adjust earnings based on attendance
      const adjBasic = Math.round(basic * proRationFactor);
      const adjHra = Math.round(hra * proRationFactor);
      const adjDa = Math.round(da * proRationFactor);
      const adjAllowances = Math.round(allowances * proRationFactor);
      
      // Pro-rate custom earnings
      const adjCustomEarnings = {};
      let customEarningsSum = 0;
      Object.keys(customEarnings).forEach((key) => {
        const val = Number(customEarnings[key]) || 0;
        const adjVal = Math.round(val * proRationFactor);
        adjCustomEarnings[key] = adjVal;
        customEarningsSum += adjVal;
      });

      // Overtime Pay = 1.5x hourly basic rate
      const hourlyBasicRate = basic / (30 * 8);
      const overtimePay = Math.round(overtimeHours * hourlyBasicRate * 1.5);

      // Performance Bonus integration
      const empReviews = reviews?.filter((r) => r.employee_id === emp.id) || [];
      let bonus = 0;
      let incentives = 0;
      if (empReviews.length > 0) {
        // Average review rating out of 5
        const avgScore = empReviews.reduce((acc, r) => {
          let s = 0;
          if (r.score !== undefined) {
            s = Number(r.score) || 0;
          } else if (r.knowledge_score !== undefined && r.quality_score !== undefined) {
            s = (Number(r.knowledge_score || 0) + Number(r.quality_score || 0)) / 2.0;
          }
          // If score is normalized on 0-100 scale, map it to 0-5 scale
          if (s > 5) {
            s = s / 20.0;
          }
          return acc + s;
        }, 0) / empReviews.length;
        
        if (avgScore >= 4.5) {
          bonus = Math.round(basic * 0.10); // 10% basic bonus for outstanding reviews
        } else if (avgScore >= 4.0) {
          bonus = Math.round(basic * 0.05); // 5% bonus
        }
      }

      // Gross Salary
      const grossSalary = adjBasic + adjHra + adjDa + adjAllowances + customEarningsSum + overtimePay + bonus + incentives;

      // Adjust deductions
      const pf = Math.round(adjBasic * (pfPercent / 100));
      // ESI: 0.75% of Gross if Gross <= 21000
      const esi = grossSalary <= 21000 ? Math.round(grossSalary * (esiPercent / 100)) : 0;
      const tds = Math.round(grossSalary * (tdsPercent / 100));

      const adjCustomDeductions = {};
      let customDeductionsSum = 0;
      Object.keys(customDeductions).forEach((key) => {
        const val = Number(customDeductions[key]) || 0;
        const adjVal = Math.round(val * proRationFactor);
        adjCustomDeductions[key] = adjVal;
        customDeductionsSum += adjVal;
      });

      const otherDeductions = customDeductionsSum;
      const netSalary = grossSalary - pf - esi - tds - otherDeductions;

      payslipsToInsert.push({
        employee_id: emp.id,
        month,
        basic: adjBasic,
        hra: adjHra,
        da: adjDa,
        other_allowances: adjAllowances,
        custom_earnings: adjCustomEarnings,
        overtime_hours: Math.round(overtimeHours * 100) / 100,
        overtime_pay: overtimePay,
        bonus,
        incentives,
        pf,
        esi,
        tds,
        custom_deductions: adjCustomDeductions,
        other_deductions: otherDeductions,
        gross_salary: grossSalary,
        net_salary: netSalary > 0 ? netSalary : 0,
        present_days: presentDays,
        absent_days: absentDays,
        leave_days: leaveDays,
        off_days: offDays,
        payment_status: "pending",
        updated_at: new Date().toISOString()
      });
    }

    // 7. Upsert payroll run status in public.payroll_runs
    const { data: runData, error: runUpsertError } = await supabase
      .from("payroll_runs")
      .upsert({ 
        month, 
        status: existingRun?.status || "draft", 
        locked: false,
        updated_at: new Date().toISOString() 
      }, { onConflict: "month" })
      .select()
      .single();
    
    if (runUpsertError) throw runUpsertError;

    // Attach payroll_run_id to all payslips
    const finalSlips = payslipsToInsert.map((s) => ({
      ...s,
      payroll_run_id: runData.id
    }));

    // 8. Delete any existing unlocked slips for this run to avoid conflicts
    const { error: deleteSlipsError } = await supabase
      .from("payslips")
      .delete()
      .eq("payroll_run_id", runData.id);
    if (deleteSlipsError) throw deleteSlipsError;

    // 9. Batch insert payslips
    const { data: slipsData, error: slipsInsertError } = await supabase
      .from("payslips")
      .insert(finalSlips)
      .select();

    if (slipsInsertError) throw slipsInsertError;

    return { run: runData, payslips: slipsData };
  } catch (error) {
    console.error("Error generating payroll:", error.message);
    throw error;
  }
}

// ─── INDIVIDUAL PAYSLIPS / PAYMENT MANAGEMENT ────────────────────────────────

export async function getPayslipById(id) {
  const { data, error } = await supabase
    .from("payslips")
    .select(`
      *,
      employees (
        id,
        name,
        email,
        emp_code,
        department,
        designation,
        monthly_ctc,
        doj
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching payslip:", error.message);
    throw error;
  }
  return data;
}

export async function getEmployeePayslips(employeeId) {
  const { data, error } = await supabase
    .from("payslips")
    .select("*")
    .eq("employee_id", employeeId)
    .order("month", { ascending: false });

  if (error) {
    console.error("Error fetching employee payslips:", error.message);
    throw error;
  }
  return data;
}

export async function updatePayslipPaymentStatus(id, updates) {
  const { data, error } = await supabase
    .from("payslips")
    .update({ 
      ...updates, 
      updated_at: new Date().toISOString() 
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating payslip payment status:", error.message);
    throw error;
  }
  return data;
}

export async function getPendingPayslips() {
  const { data, error } = await supabase
    .from("payslips")
    .select(`
      *,
      employees (
        id,
        name,
        email,
        emp_code,
        department,
        designation
      )
    `)
    .eq("payment_status", "pending")
    .order("month", { ascending: false });

  if (error) {
    console.error("Error fetching pending payslips:", error.message);
    throw error;
  }
  return data;
}

export async function getPaidPayslips() {
  const { data, error } = await supabase
    .from("payslips")
    .select(`
      *,
      employees (
        id,
        name,
        email,
        emp_code,
        department,
        designation
      )
    `)
    .eq("payment_status", "paid")
    .order("month", { ascending: false });

  if (error) {
    console.error("Error fetching paid payslips:", error.message);
    throw error;
  }
  return data;
}

