// src/features/payroll/pages/PayrollDashboardPage.jsx
import React, { useState, useMemo } from 'react';
import {
  Box, Flex, Text, HStack, Avatar, Spinner, Heading, Badge,
  SimpleGrid, Table, Thead, Tbody, Tr, Th, Td, Divider,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { useEmployeeProfile } from '@/hooks/useEmployeeProfile';
import { useEmployees } from '@/hooks/useEmployees';
import { usePayrollRuns, usePayrollRunDetails, useEmployeePayslips, useSalaryStructure } from '@/hooks/usePayroll';
import { formatRs } from '../constants/payrollMockData';
import jsPDF from 'jspdf';

// ─── PDF Downloader Utility ──────────────────────────────────────────────────
export const downloadPayslipPDF = (slip, empName) => {
  const doc = new jsPDF();
  
  // Title / Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(48, 125, 199);
  doc.text("HAPPY HR SYSTEMS", 105, 20, { align: "center" });
  
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text(`PAYSLIP FOR THE MONTH OF ${slip.month}`, 105, 30, { align: "center" });
  
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Employee Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Employee Name: ${empName}`, 20, 45);
  doc.text(`Payslip ID: ${slip.id.slice(0, 8).toUpperCase()}`, 20, 52);
  doc.text(`Payment Status: ${slip.payment_status.toUpperCase()}`, 20, 59);
  
  // Attendance details
  doc.text(`Present Days: ${slip.present_days}`, 130, 45);
  doc.text(`Off Days: ${slip.off_days}`, 130, 52);
  doc.text(`Leave Days (Unpaid): ${slip.leave_days}`, 130, 59);
  
  doc.line(20, 65, 190, 65);
  
  // Earnings Section
  doc.setFont("helvetica", "bold");
  doc.text("EARNINGS", 20, 75);
  doc.setFont("helvetica", "normal");
  doc.text(`Basic Salary:`, 20, 85);
  doc.text(`Rs. ${slip.basic.toLocaleString('en-IN')}`, 90, 85, { align: "right" });
  doc.text(`House Rent Allowance (HRA):`, 20, 92);
  doc.text(`Rs. ${slip.hra.toLocaleString('en-IN')}`, 90, 92, { align: "right" });
  doc.text(`Dearness Allowance (DA):`, 20, 99);
  doc.text(`Rs. ${slip.da.toLocaleString('en-IN')}`, 90, 99, { align: "right" });
  doc.text(`Other Allowances:`, 20, 106);
  doc.text(`Rs. ${slip.other_allowances.toLocaleString('en-IN')}`, 90, 106, { align: "right" });
  
  let yOffset = 113;
  if (slip.custom_earnings) {
    Object.keys(slip.custom_earnings).forEach((key) => {
      doc.text(`${key}:`, 20, yOffset);
      doc.text(`Rs. ${Number(slip.custom_earnings[key] || 0).toLocaleString('en-IN')}`, 90, yOffset, { align: "right" });
      yOffset += 7;
    });
  }
  
  if (slip.overtime_pay > 0) {
    doc.text(`Overtime Pay (${slip.overtime_hours} hrs):`, 20, yOffset);
    doc.text(`Rs. ${slip.overtime_pay.toLocaleString('en-IN')}`, 90, yOffset, { align: "right" });
    yOffset += 7;
  }
  if (slip.bonus > 0) {
    doc.text(`Bonus:`, 20, yOffset);
    doc.text(`Rs. ${slip.bonus.toLocaleString('en-IN')}`, 90, yOffset, { align: "right" });
    yOffset += 7;
  }
  
  // Deductions Section
  let dOffset = 75;
  doc.setFont("helvetica", "bold");
  doc.text("DEDUCTIONS", 120, dOffset);
  doc.setFont("helvetica", "normal");
  dOffset += 10;
  doc.text(`Provident Fund (PF):`, 120, dOffset);
  doc.text(`Rs. ${slip.pf.toLocaleString('en-IN')}`, 190, dOffset, { align: "right" });
  dOffset += 7;
  doc.text(`ESI / Health Ins.:`, 120, dOffset);
  doc.text(`Rs. ${slip.esi.toLocaleString('en-IN')}`, 190, dOffset, { align: "right" });
  dOffset += 7;
  doc.text(`Tax Deducted at Source (TDS):`, 120, dOffset);
  doc.text(`Rs. ${slip.tds.toLocaleString('en-IN')}`, 190, dOffset, { align: "right" });
  
  if (slip.custom_deductions) {
    Object.keys(slip.custom_deductions).forEach((key) => {
      dOffset += 7;
      doc.text(`${key}:`, 120, dOffset);
      doc.text(`Rs. ${Number(slip.custom_deductions[key] || 0).toLocaleString('en-IN')}`, 190, dOffset, { align: "right" });
    });
  }

  // Draw separator before totals
  const maxOffset = Math.max(yOffset, dOffset) + 5;
  doc.line(20, maxOffset, 190, maxOffset);
  
  // Net Totals
  doc.setFont("helvetica", "bold");
  doc.text(`GROSS EARNINGS:`, 20, maxOffset + 10);
  doc.text(`Rs. ${slip.gross_salary.toLocaleString('en-IN')}`, 90, maxOffset + 10, { align: "right" });
  
  doc.text(`TOTAL DEDUCTIONS:`, 120, maxOffset + 10);
  doc.text(`Rs. ${(slip.pf + slip.esi + slip.tds + slip.other_deductions).toLocaleString('en-IN')}`, 190, maxOffset + 10, { align: "right" });
  
  doc.setFillColor(240, 240, 240);
  doc.rect(20, maxOffset + 18, 170, 15, "F");
  doc.setFontSize(12);
  doc.setTextColor(48, 125, 199);
  doc.text(`NET PAYABLE SALARY:`, 25, maxOffset + 27);
  doc.text(`Rs. ${slip.net_salary.toLocaleString('en-IN')}`, 185, maxOffset + 27, { align: "right" });
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("This is an electronically generated document. No signature required.", 105, 280, { align: "center" });

  doc.save(`Payslip_${empName.replace(/\s+/g, '_')}_${slip.month}.pdf`);
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function PayrollDashboardPage() {
  const navigate = useNavigate();
  const { role, isHR, originalRole } = useRole();
  const { user } = useAuth();
  
  // Get active employee details (for employee role)
  const { data: empProfile, isLoading: loadingProfile } = useEmployeeProfile(originalRole === "employee" ? user?.id : null);
  const employeeId = empProfile?.id || null;

  // DB structures
  const { data: runs, isLoading: loadingRuns } = usePayrollRuns();
  
  // Find latest payroll run
  const latestMonth = useMemo(() => {
    if (runs && runs.length > 0) return runs[0].month;
    return null;
  }, [runs]);

  // Load latest run details for dashboard
  const { data: runSlips, isLoading: loadingSlips } = usePayrollRunDetails(latestMonth);
  
  // Employee slips
  const { data: empSlips, isLoading: loadingEmpSlips } = useEmployeePayslips(employeeId);
  const { data: empStruct, isLoading: loadingEmpStruct } = useSalaryStructure(employeeId);

  // Status colors for Admin table
  const statusColors = {
    paid: { bg: 'green.50', color: 'green.600' },
    pending: { bg: 'teal.50', color: 'teal.600' },
  };

  const actionRows = [
    { title: 'Record Payment', sub: 'Undo recorded payments or view payout logs.', btnLabel: 'Record', path: '/payroll/record' },
    { title: 'Pending Payments', sub: 'Approve pending payouts and check pending items.', btnLabel: 'Pay', path: '/payroll/pending' },
    { title: 'Salary Structure Management', sub: 'Assign relevant earning and deduction components to each structure.', btnLabel: 'Edit', path: '/payroll/structure' },
    { title: 'Reimbursement Status', sub: 'Request and Track the status of claims (Pending, Approved, Rejected).', btnLabel: 'Check', path: '/payroll/reimbursement' },
    { title: 'Payroll Overview Console', sub: 'Generate, approve, lock and export monthly calculations.', btnLabel: 'Console', path: '/payroll/overview' },
  ];

  if (loadingProfile || loadingRuns || (isHR && loadingSlips) || (!isHR && (loadingEmpSlips || loadingEmpStruct))) {
    return (
      <DashboardLayout>
        <Flex justify="center" align="center" h="70vh">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      </DashboardLayout>
    );
  }

  // ────────── HR/ADMIN VIEW ──────────────────────────────────────────────────
  if (isHR) {
    return (
      <DashboardLayout>
        <Flex direction="column" gap="6" p="4">
          <Heading size="lg" color="text-primary">HR Payroll Dashboard</Heading>
          
          {latestMonth ? (
            <Box bg="card-bg" p="4" borderRadius="lg" border="1px solid" borderColor="border-color" boxShadow="sm">
              <Flex justify="space-between" align="center" mb={4}>
                <Text fontWeight="bold" color="text-secondary" fontSize="md">
                  Latest Processed Month: {latestMonth}
                </Text>
                <Badge colorScheme={runs[0].status === 'paid' ? 'green' : 'yellow'} fontSize="sm" px={3} py={1} borderRadius="full">
                  Status: {runs[0].status.toUpperCase()}
                </Badge>
              </Flex>
              
              {/* Employee Table */}
              <Box border="1px solid" borderColor="border-color" borderRadius="md" overflow="hidden">
                {/* Header Row */}
                <Flex px="4" py="3" bg="app-bg-secondary" color="text-muted" fontSize="xs" fontWeight="bold" textTransform="uppercase">
                  <Text flex="2">Employee Name</Text>
                  <Text flex="1.5" textAlign="right">Gross Pay</Text>
                  <Text flex="1.5" textAlign="right">PF Deduction</Text>
                  <Text flex="1.5" textAlign="right">Net Salary</Text>
                  <Text flex="1" textAlign="center">Status</Text>
                </Flex>

                {/* Data Rows */}
                {runSlips && runSlips.length > 0 ? (
                  runSlips.map((slip, i) => (
                    <Flex
                      key={slip.id}
                      px="4" py="3"
                      align="center"
                      borderBottom={i < runSlips.length - 1 ? '1px dashed' : 'none'}
                      borderColor="border-color"
                      _hover={{ bg: "hover-bg" }}
                      fontSize="sm"
                    >
                      <HStack flex="2" spacing="3">
                        <Avatar size="xs" name={slip.employees?.name} />
                        <Text fontWeight="medium" color="text-secondary">{slip.employees?.name}</Text>
                      </HStack>

                      <Text flex="1.5" textAlign="right" color="text-secondary">{formatRs(slip.gross_salary)}</Text>
                      <Text flex="1.5" textAlign="right" color="text-secondary">{formatRs(slip.pf + slip.esi + slip.tds)}</Text>
                      <Text flex="1.5" textAlign="right" fontWeight="semibold" color="text-primary">{formatRs(slip.net_salary)}</Text>
                      
                      <Box flex="1" textAlign="center">
                        <Box
                          as="span"
                          display="inline-block"
                          px="3" py="0.5"
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="semibold"
                          bg={statusColors[slip.payment_status]?.bg || 'app-bg-secondary'}
                          color={statusColors[slip.payment_status]?.color || 'text-secondary'}
                        >
                          {slip.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </Box>
                      </Box>
                    </Flex>
                  ))
                ) : (
                  <Flex justify="center" py={6}><Text fontSize="sm" color="text-muted">No payslips found for {latestMonth}</Text></Flex>
                )}
              </Box>
            </Box>
          ) : (
            <Box bg="card-bg" p="6" borderRadius="lg" border="1px solid" borderColor="border-color" textAlign="center">
              <Text color="text-muted" fontSize="sm" mb={4}>No payroll logs generated yet.</Text>
              <HRMSButton onClick={() => navigate('/payroll/overview')}>Go to Payroll Console</HRMSButton>
            </Box>
          )}

          {/* Action List */}
          <Heading size="md" color="text-secondary" mt={2}>Quick Console Links</Heading>
          <Flex direction="column" bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" overflow="hidden">
            {actionRows.map((row, i) => (
              <Flex
                key={i}
                align="center"
                justify="space-between"
                px="6" py="4"
                borderBottom={i < actionRows.length - 1 ? "1px solid" : "none"}
                borderColor="border-color"
                _hover={{ bg: "hover-bg" }}
              >
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="text-secondary">{row.title}</Text>
                  <Text fontSize="xs" color="text-muted">{row.sub}</Text>
                </Box>
                <HRMSButton
                  size="sm"
                  onClick={() => navigate(row.path)}
                >
                  {row.btnLabel}
                </HRMSButton>
              </Flex>
            ))}
          </Flex>
        </Flex>
      </DashboardLayout>
    );
  }

  // ────────── EMPLOYEE VIEW ──────────────────────────────────────────────────
  const baseSalary = empStruct ? empStruct.basic : (empProfile?.monthly_ctc || 0) * 0.5;
  const hraVal = empStruct ? empStruct.hra : baseSalary * 0.5;
  const daVal = empStruct ? empStruct.da : baseSalary * 0.1;
  const allowancesVal = empStruct ? empStruct.other_allowances : (empProfile?.monthly_ctc || 0) - baseSalary - hraVal - daVal;
  
  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 6 }} py={6}>
        <Heading size="lg" mb={6} color="text-primary">My Salary Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
          {/* Main Card */}
          <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={5} boxShadow="sm">
            <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase" mb={1}>Current Monthly CTC</Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              Rs. {empProfile?.monthly_ctc?.toLocaleString('en-IN') || '0'}
            </Text>
            <Divider my={3} />
            <Text fontSize="xs" color="text-muted">Designation: {empProfile?.designation}</Text>
            <Text fontSize="xs" color="text-muted">Department: {empProfile?.department}</Text>
          </Box>
          
          {/* Earnings card */}
          <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={5} boxShadow="sm">
            <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase" mb={2}>Standard Earnings Breakdown</Text>
            <Flex justify="space-between" mb={1} fontSize="sm">
              <Text color="text-secondary">Basic:</Text>
              <Text fontWeight="semibold" color="text-secondary">{formatRs(baseSalary)}</Text>
            </Flex>
            <Flex justify="space-between" mb={1} fontSize="sm">
              <Text color="text-secondary">HRA:</Text>
              <Text fontWeight="semibold" color="text-secondary">{formatRs(hraVal)}</Text>
            </Flex>
            <Flex justify="space-between" fontSize="sm">
              <Text color="text-secondary">Allowances:</Text>
              <Text fontWeight="semibold" color="text-secondary">{formatRs(allowancesVal + daVal)}</Text>
            </Flex>
          </Box>

          {/* Deductions card */}
          <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={5} boxShadow="sm">
            <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase" mb={2}>Standard Deductions</Text>
            <Flex justify="space-between" mb={1} fontSize="sm">
              <Text color="text-secondary">PF %:</Text>
              <Text fontWeight="semibold" color="text-secondary">{empStruct?.pf_percent || 12}%</Text>
            </Flex>
            <Flex justify="space-between" mb={1} fontSize="sm">
              <Text color="text-secondary">ESI %:</Text>
              <Text fontWeight="semibold" color="text-secondary">{empStruct?.esi_percent || 0.75}%</Text>
            </Flex>
            <Flex justify="space-between" fontSize="sm">
              <Text color="text-secondary">TDS %:</Text>
              <Text fontWeight="semibold" color="text-secondary">{empStruct?.tds_percent || 0}%</Text>
            </Flex>
          </Box>
        </SimpleGrid>

        {/* Payslips History */}
        <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={6} boxShadow="sm">
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color="text-secondary">Salary Payout History</Heading>
            <HRMSButton size="sm" onClick={() => navigate('/payroll/payslips')}>Go to Payslips Hub</HRMSButton>
          </Flex>

          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Month</Th>
                <Th textAlign="right">Gross Salary</Th>
                <Th textAlign="right">Deductions</Th>
                <Th textAlign="right">Net Payable</Th>
                <Th textAlign="center">Status</Th>
                <Th textAlign="center">Payslip</Th>
              </Tr>
            </Thead>
            <Tbody>
              {empSlips && empSlips.length > 0 ? (
                empSlips.map((slip) => (
                  <Tr key={slip.id} _hover={{ bg: "hover-bg" }}>
                    <Td fontWeight="medium" color="text-secondary">{slip.month}</Td>
                    <Td textAlign="right" color="text-secondary">{formatRs(slip.gross_salary)}</Td>
                    <Td textAlign="right" color="text-secondary">{formatRs(slip.pf + slip.esi + slip.tds + slip.other_deductions)}</Td>
                    <Td textAlign="right" fontWeight="semibold" color="gray.850">{formatRs(slip.net_salary)}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={slip.payment_status === 'paid' ? 'green' : 'yellow'} px={2} py={0.5} borderRadius="full">
                        {slip.payment_status.toUpperCase()}
                      </Badge>
                    </Td>
                    <Td textAlign="center">
                      <HRMSButton size="xs" onClick={() => downloadPayslipPDF(slip, empProfile.name)}>
                        ⬇️ PDF
                      </HRMSButton>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={6} textAlign="center" py={6} color="text-muted">
                    No payslips records found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
