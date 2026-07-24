import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, Text, Heading, Select, SimpleGrid, Spinner, Table, Thead, Tbody, Tr, Th, Td, Badge,
  useToast, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
  ModalBody, ModalFooter, Divider, Button, ListItem, UnorderedList, VStack, HStack,
  FormControl, FormLabel,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import { usePayrollRuns, usePayrollRunDetails, useGeneratePayroll, useUpdatePayrollStatus, useLockPayroll } from '@/hooks/usePayroll';
import { formatRs } from '../constants/payrollMockData';
import { supabase } from '@/lib/supabaseClient';

export default function PayrollOverviewPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [selectedMonth, setSelectedMonth] = useState('2026-07');
  
  // Modal for attendance details drill-down
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeDrillDown, setActiveDrillDown] = useState(null);
  const [drillDownLogs, setDrillDownLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Load payroll runs list
  const { data: runs, isLoading: loadingRuns, refetch: refetchRuns } = usePayrollRuns();
  
  // Find current run status
  const currentRun = useMemo(() => {
    return runs?.find(r => r.month === selectedMonth) || null;
  }, [runs, selectedMonth]);

  // Load payslips for selected month
  const { data: slips, isLoading: loadingSlips, refetch: refetchSlips } = usePayrollRunDetails(selectedMonth);

  // Mutations
  const generatePayrollMutation = useGeneratePayroll();
  const updateStatusMutation = useUpdatePayrollStatus();
  const lockPayrollMutation = useLockPayroll();

  // Aggregate stats
  const totals = useMemo(() => {
    if (!slips || slips.length === 0) return { gross: 0, deductions: 0, net: 0 };
    return slips.reduce((acc, slip) => {
      const ded = slip.pf + slip.esi + slip.tds + slip.other_deductions;
      return {
        gross: acc.gross + slip.gross_salary,
        deductions: acc.deductions + ded,
        net: acc.net + slip.net_salary,
      };
    }, { gross: 0, deductions: 0, net: 0 });
  }, [slips]);

  const handleGenerate = async () => {
    try {
      await generatePayrollMutation.mutateAsync(selectedMonth);
      toast({
        title: 'Payroll Generated',
        description: `Successfully processed payroll calculations for ${selectedMonth}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      refetchRuns();
      refetchSlips();
    } catch (err) {
      toast({
        title: 'Generation Failed',
        description: err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleApprove = async () => {
    try {
      await updateStatusMutation.mutateAsync({ month: selectedMonth, status: 'approved' });
      toast({ title: 'Payroll Approved', status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
      refetchRuns();
    } catch (err) {
      toast({ title: 'Action Failed', description: err.message, status: 'error' });
    }
  };

  const handleMarkPaid = async () => {
    try {
      await updateStatusMutation.mutateAsync({ month: selectedMonth, status: 'paid' });
      toast({ title: 'Payroll Payout Finalized', status: 'success', duration: 3000, isClosable: true, position: 'top-right' });
      refetchRuns();
      refetchSlips();
    } catch (err) {
      toast({ title: 'Action Failed', description: err.message, status: 'error' });
    }
  };

  const handleLock = async () => {
    try {
      await lockPayrollMutation.mutateAsync(selectedMonth);
      toast({ title: 'Payroll Locked', description: 'This month is now finalized and cannot be modified.', status: 'info', duration: 3000, isClosable: true, position: 'top-right' });
      refetchRuns();
    } catch (err) {
      toast({ title: 'Action Failed', description: err.message, status: 'error' });
    }
  };

  // Open drill-down modal for details check
  const handleOpenDrillDown = async (slip, metric) => {
    setActiveDrillDown({ slip, metric });
    setLoadingLogs(true);
    onOpen();
    
    try {
      const yearMonth = selectedMonth;
      const daysInMonth = new Date(yearMonth.split('-')[0], yearMonth.split('-')[1], 0).getDate();
      const startDate = `${yearMonth}-01`;
      const endDate = `${yearMonth}-${String(daysInMonth).padStart(2, '0')}`;

      // Query actual attendance logs
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('employee_id', slip.employee_id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (error) throw error;
      setDrillDownLogs(data || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to fetch logs', description: err.message, status: 'error' });
    } finally {
      setLoadingLogs(false);
    }
  };

  const filteredDrillDownLogs = useMemo(() => {
    if (!activeDrillDown) return [];
    const metric = activeDrillDown.metric;
    
    if (metric === 'Present') {
      return drillDownLogs.filter(l => l.status === 'Present');
    }
    if (metric === 'Absent') {
      return drillDownLogs.filter(l => l.status === 'Absent');
    }
    if (metric === 'Off Day') {
      return drillDownLogs.filter(l => l.status === 'Off Day');
    }
    if (metric === 'On Leave') {
      return drillDownLogs.filter(l => l.status === 'On Leave');
    }
    if (metric === 'Overtime') {
      // Return logs where overtime exists
      return drillDownLogs.filter(l => {
        if (l.status !== 'Present' || !l.in_time || !l.out_time) return false;
        // Simple worked hours parsing
        const parseTimeToHours = (t) => {
          const match = t.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
          if (!match) return 0;
          let h = parseInt(match[1], 10);
          const m = parseInt(match[2], 10);
          const ap = match[3].toUpperCase();
          if (ap === 'PM' && h !== 12) h += 12;
          if (ap === 'AM' && h === 12) h = 0;
          return h + m/60;
        };
        const inHrs = parseTimeToHours(l.in_time);
        const outHrs = parseTimeToHours(l.out_time);
        return (outHrs - inHrs) > 8.0;
      });
    }
    return drillDownLogs;
  }, [drillDownLogs, activeDrillDown]);

  // Export current list to CSV
  const handleExportCSV = () => {
    if (!slips || slips.length === 0) return;
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Employee Name,Employee Code,Month,Gross Salary,Deductions,Net Salary,Present Days,Absent Days,Leave Days,Off Days,Overtime Hours,Payment Status\n";
    
    slips.forEach(s => {
      const ded = s.pf + s.esi + s.tds + s.other_deductions;
      csvContent += `"${s.employees?.name}","${s.employees?.emp_code || ''}","${s.month}",${s.gross_salary},${ded},${s.net_salary},${s.present_days},${s.absent_days},${s.leave_days},${s.off_days},${s.overtime_hours},"${s.payment_status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Payroll_Export_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'paid') return 'green';
    if (status === 'approved') return 'blue';
    return 'yellow';
  };

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
        <Heading size="lg" mb={6} color="text-primary">Monthly Payroll Processing</Heading>

        {/* Filters Panel */}
        <Box bg="card-bg" borderRadius="lg" border="1px solid" borderColor="border-color" p={5} mb={6}>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} align="center">
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">Select Processing Month</FormLabel>
              <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="2026-07">July 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-04">April 2026</option>
              </Select>
            </FormControl>
            
            <Flex align="flex-end" w="full" gap={3}>
              <HRMSButton
                w="full"
                onClick={handleGenerate}
                isLoading={generatePayrollMutation.isPending}
                isDisabled={currentRun?.locked}
              >
                🔄 {currentRun ? 'Recalculate Run' : 'Generate Payouts'}
              </HRMSButton>
              {currentRun && (
                <HRMSButton variant="outline" onClick={handleExportCSV}>
                  📤 Export CSV
                </HRMSButton>
              )}
            </Flex>
          </SimpleGrid>
        </Box>

        {/* Loaders */}
        {loadingRuns || loadingSlips ? (
          <Flex justify="center" py={12}><Spinner size="xl" color="blue.500" /></Flex>
        ) : (
          <>
            {currentRun ? (
              <VStack spacing={6} align="stretch">
                {/* stats */}
                <SimpleGrid columns={{ base: 1, md: 4 }} gap={5}>
                  <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={4}>
                    <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase">Gross Payout</Text>
                    <Text fontSize="xl" fontWeight="bold" color="text-secondary">{formatRs(totals.gross)}</Text>
                  </Box>
                  <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={4}>
                    <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase">Deductions</Text>
                    <Text fontSize="xl" fontWeight="bold" color="red.500">{formatRs(totals.deductions)}</Text>
                  </Box>
                  <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={4}>
                    <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase">Net Payable</Text>
                    <Text fontSize="xl" fontWeight="bold" color="green.600">{formatRs(totals.net)}</Text>
                  </Box>
                  <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={4}>
                    <Text fontSize="xs" fontWeight="semibold" color="text-muted" textTransform="uppercase">Run Status</Text>
                    <HStack spacing={2} mt={1}>
                      <Badge colorScheme={getStatusBadgeColor(currentRun.status)} px={2} py={0.5} borderRadius="full">
                        {currentRun.status.toUpperCase()}
                      </Badge>
                      {currentRun.locked && (
                        <Badge colorScheme="purple" px={2} py={0.5} borderRadius="full">
                          LOCKED
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                </SimpleGrid>

                {/* console actions */}
                <Flex bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" p={4} justify="space-between" align="center" gap={4}>
                  <Box>
                    <Text fontWeight="semibold" fontSize="sm" color="text-secondary">Admin Actions Console</Text>
                    <Text fontSize="xs" color="text-muted">Locking payroll runs finalizes calculation values and prevents duplicate regenerations.</Text>
                  </Box>
                  
                  <HStack spacing={3}>
                    {currentRun.status === 'draft' && (
                      <Button size="sm" colorScheme="blue" onClick={handleApprove}>
                        Approve Run
                      </Button>
                    )}
                    {currentRun.status === 'approved' && (
                      <Button size="sm" colorScheme="green" onClick={handleMarkPaid}>
                        Disburse Payments
                      </Button>
                    )}
                    {!currentRun.locked && (
                      <Button size="sm" colorScheme="purple" variant="outline" onClick={handleLock}>
                        🔒 Lock Month
                      </Button>
                    )}
                  </HStack>
                </Flex>

                {/* Detailed Table */}
                <Box bg="card-bg" border="1px solid" borderColor="border-color" borderRadius="lg" overflow="hidden">
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr bg="app-bg-secondary">
                        <Th py={3}>Employee</Th>
                        <Th textAlign="center">Present</Th>
                        <Th textAlign="center">Off Days</Th>
                        <Th textAlign="center">Leave</Th>
                        <Th textAlign="center">Absent</Th>
                        <Th textAlign="center">Overtime</Th>
                        <Th textAlign="right">Gross</Th>
                        <Th textAlign="right">Net Salary</Th>
                        <Th textAlign="center">Paid</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {slips && slips.length > 0 ? (
                        slips.map(slip => (
                          <Tr key={slip.id} _hover={{ bg: "hover-bg" }}>
                            <Td fontWeight="medium" color="text-secondary" py={3}>{slip.employees?.name}</Td>
                            
                            {/* present drill */}
                            <Td textAlign="center">
                              <Text as="span" borderBottom="1px dashed" borderColor="blue.400" cursor="pointer" color="blue.650" fontWeight="bold" onClick={() => handleOpenDrillDown(slip, 'Present')}>
                                {slip.present_days}
                              </Text>
                            </Td>

                            {/* off drill */}
                            <Td textAlign="center">
                              <Text as="span" borderBottom="1px dashed" borderColor="blue.400" cursor="pointer" color="blue.650" fontWeight="bold" onClick={() => handleOpenDrillDown(slip, 'Off Day')}>
                                {slip.off_days}
                              </Text>
                            </Td>

                            {/* leave drill */}
                            <Td textAlign="center">
                              <Text as="span" borderBottom="1px dashed" borderColor="blue.400" cursor="pointer" color="blue.650" fontWeight="bold" onClick={() => handleOpenDrillDown(slip, 'On Leave')}>
                                {slip.leave_days}
                              </Text>
                            </Td>

                            {/* absent drill */}
                            <Td textAlign="center">
                              <Text as="span" borderBottom="1px dashed" borderColor="blue.400" cursor="pointer" color="blue.650" fontWeight="bold" onClick={() => handleOpenDrillDown(slip, 'Absent')}>
                                {slip.absent_days}
                              </Text>
                            </Td>

                            {/* overtime drill */}
                            <Td textAlign="center">
                              <Text as="span" borderBottom="1px dashed" borderColor="blue.400" cursor="pointer" color="blue.650" fontWeight="bold" onClick={() => handleOpenDrillDown(slip, 'Overtime')}>
                                {slip.overtime_hours} hrs
                              </Text>
                            </Td>

                            <Td textAlign="right" color="text-secondary">{formatRs(slip.gross_salary)}</Td>
                            <Td textAlign="right" fontWeight="semibold" color="text-primary">{formatRs(slip.net_salary)}</Td>
                            
                            <Td textAlign="center">
                              <Badge colorScheme={slip.payment_status === 'paid' ? 'green' : 'yellow'}>
                                {slip.payment_status.toUpperCase()}
                              </Badge>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr><Td colSpan={9} textAlign="center" py={6} color="text-muted">No payslips data found.</Td></Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            ) : (
              <Box bg="card-bg" borderRadius="lg" border="1px solid" borderColor="border-color" p={12} textAlign="center">
                <Text color="text-muted" fontSize="lg" mb={6}>No calculations generated for {selectedMonth} yet.</Text>
                <HRMSButton onClick={handleGenerate} isLoading={generatePayrollMutation.isPending}>
                  🚀 Generate Payroll for {selectedMonth}
                </HRMSButton>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* DRILL-DOWN MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Attendance Logs: {activeDrillDown?.slip?.employees?.name}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody pb={6}>
            <Text mb={4} fontSize="sm" color="text-muted">
              Drill-down verifying logs for metric: <strong>{activeDrillDown?.metric}</strong> in month {selectedMonth}.
            </Text>
            
            {loadingLogs ? (
              <Flex justify="center" py={6}><Spinner size="md" /></Flex>
            ) : (
              <VStack align="stretch" spacing={4}>
                {filteredDrillDownLogs.length === 0 ? (
                  <Text py={4} fontSize="sm" color="text-muted" textAlign="center">No logs matching this category.</Text>
                ) : (
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>In Time</Th>
                        <Th>Out Time</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredDrillDownLogs.map((log) => (
                        <Tr key={log.id || log.date}>
                          <Td>{log.date}</Td>
                          <Td>{log.in_time || '—'}</Td>
                          <Td>{log.out_time || '—'}</Td>
                          <Td>
                            <Badge colorScheme={log.status === 'Present' ? 'green' : log.status === 'Off Day' ? 'blue' : 'red'}>
                              {log.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
                
                <Divider />
                
                {/* Description of terms */}
                <Box bg="app-bg-secondary" p={3} borderRadius="md">
                  <Text fontWeight="semibold" fontSize="xs" color="text-secondary" mb={1} textTransform="uppercase">Payroll Terms Guide:</Text>
                  <UnorderedList spacing={1} fontSize="xs" color="text-muted">
                    <ListItem><strong>Present:</strong> Employee logged check-in status. Eligible for pro-rated pay.</ListItem>
                    <ListItem><strong>Off Day:</strong> Weekends or company holidays. Eligible for pro-rated pay.</ListItem>
                    <ListItem><strong>On Leave:</strong> Approved leaves. Deducted from pay (unpaid leaves as per system policy).</ListItem>
                    <ListItem><strong>Overtime:</strong> Calculated automatically when hours worked exceed standard 8 hours.</ListItem>
                  </UnorderedList>
                </Box>
              </VStack>
            )}
          </ModalBody>
          
          <ModalFooter>
            <Button size="sm" onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DashboardLayout>
  );
}
