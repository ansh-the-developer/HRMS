// src/features/payroll/pages/PayrollSlipsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, Text, Heading, Select, Spinner, Table, Thead, Tbody, Tr, Th, Td, Badge,
  VStack, HStack, Button,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import { useRole } from '@/hooks/useRole';
import { useAuth } from '@/hooks/useAuth';
import { useEmployeeProfile } from '@/hooks/useEmployeeProfile';
import { useEmployees } from '@/hooks/useEmployees';
import { useEmployeePayslips } from '@/hooks/usePayroll';
import { formatRs } from '../constants/payrollMockData';
import { downloadPayslipPDF } from './PayrollDashboardPage';

export default function PayrollSlipsPage() {
  const navigate = useNavigate();
  const { isHR, originalRole } = useRole();
  const { user } = useAuth();
  
  // State for Admin role selection
  const [selectedEmpId, setSelectedEmpId] = useState('');
  
  // Hooks for current employee role
  const { data: empProfile, isLoading: loadingProfile } = useEmployeeProfile(originalRole === "employee" ? user?.id : null);
  const currentEmpId = empProfile?.id || null;
  const currentEmpName = empProfile?.name || '';

  // Hooks for Admin role
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  
  // Decide which employee's slips to fetch
  const targetEmpId = isHR ? selectedEmpId : currentEmpId;
  
  // Fetch slips
  const { data: slips, isLoading: loadingSlips } = useEmployeePayslips(targetEmpId);

  const selectedEmpName = isHR 
    ? (employees?.find(e => e.id === selectedEmpId)?.name || '') 
    : currentEmpName;

  const isLoading = loadingProfile || (isHR && loadingEmployees) || (targetEmpId && loadingSlips);

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 6 }} py={6}>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<span>←</span>}
          onClick={() => navigate('/payroll')}
          mb={4}
          alignSelf="flex-start"
          _hover={{ bg: "hover-bg" }}
        >
          Back to Payroll Dashboard
        </Button>
        <Heading size="lg" mb={2} color="text-primary">Payslips Hub</Heading>
        <Text fontSize="sm" color="text-muted" mb={6}>
          {isHR ? 'Select an employee to view and download their historical payslips.' : 'View and download your official monthly payslip PDFs.'}
        </Text>

        {/* HR dropdown choice */}
        {isHR && (
          <Box bg="card-bg" borderRadius="lg" border="1px solid" borderColor="border-color" p={5} mb={6} maxW="400px">
            <Text fontWeight="semibold" fontSize="sm" color="text-secondary" mb={2}>Select Employee</Text>
            {loadingEmployees ? (
              <Spinner size="sm" />
            ) : (
              <Select
                placeholder="Choose an employee..."
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                bg="card-bg"
                borderColor="border-color"
              >
                {employees?.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                ))}
              </Select>
            )}
          </Box>
        )}

        {/* Main Content Area */}
        {isLoading ? (
          <Flex justify="center" py={12}><Spinner size="lg" color="blue.500" /></Flex>
        ) : (
          <>
            {targetEmpId ? (
              <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={6} boxShadow="sm">
                <Heading size="md" mb={4} color="text-secondary">
                  Payslip Records: {selectedEmpName}
                </Heading>

                <Table variant="simple" size="md">
                  <Thead bg="app-bg-secondary">
                    <Tr>
                      <Th>Month</Th>
                      <Th textAlign="right">Gross Salary</Th>
                      <Th textAlign="right">Deductions</Th>
                      <Th textAlign="right">Net Salary</Th>
                      <Th textAlign="center">Status</Th>
                      <Th textAlign="center">Download</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {slips && slips.length > 0 ? (
                      slips.map((slip) => (
                        <Tr key={slip.id} _hover={{ bg: "hover-bg" }}>
                          <Td fontWeight="medium" color="text-secondary">{slip.month}</Td>
                          <Td textAlign="right" color="text-secondary">{formatRs(slip.gross_salary)}</Td>
                          <Td textAlign="right" color="text-secondary">{formatRs(slip.pf + slip.esi + slip.tds + slip.other_deductions)}</Td>
                          <Td textAlign="right" fontWeight="semibold" color="text-primary">{formatRs(slip.net_salary)}</Td>
                          <Td textAlign="center">
                            <Badge colorScheme={slip.payment_status === 'paid' ? 'green' : 'yellow'} px={2} py={0.5} borderRadius="full">
                              {slip.payment_status.toUpperCase()}
                            </Badge>
                          </Td>
                          <Td textAlign="center">
                            <HRMSButton size="xs" onClick={() => downloadPayslipPDF(slip, selectedEmpName)}>
                              ⬇️ PDF Payslip
                            </HRMSButton>
                          </Td>
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={6} textAlign="center" py={8} color="text-muted">
                          No payslips records found for this employee.
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            ) : (
              <Box bg="card-bg" borderRadius="lg" border="1px solid" borderColor="border-color" p={8} textAlign="center">
                <Text color="text-muted" fontSize="sm">
                  {isHR ? 'Please select an employee from the dropdown above to view records.' : 'No profile associated with this account. Contact HR.'}
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </DashboardLayout>
  );
}
