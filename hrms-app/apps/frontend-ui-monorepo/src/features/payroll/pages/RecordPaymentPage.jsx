import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar, Badge, Box, Flex, Input, InputGroup,
  InputLeftElement, Table, Tbody, Td, Text,
  Th, Thead, Tr, Button, useToast, Spinner,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import { formatRs } from '../constants/payrollMockData';
import { usePaidPayments, useUpdatePayslipPayment } from '@/hooks/usePayroll';

export default function RecordPaymentPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [search, setSearch] = useState('');

  // Fetch paid payments from Supabase
  const { data: paidSlips, isLoading } = usePaidPayments();
  const revertMutation = useUpdatePayslipPayment();

  const filteredSlips = useMemo(() => {
    if (!paidSlips) return [];
    return paidSlips.filter((s) =>
      s.employees?.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [paidSlips, search]);

  const handleRevertPayment = async (slip) => {
    try {
      await revertMutation.mutateAsync({
        id: slip.id,
        updates: {
          payment_status: 'pending',
          payment_date: null,
          payment_method: null,
        },
      });

      toast({
        title: 'Payment Reverted',
        description: `${slip.employees?.name}'s payout for ${slip.month} moved back to pending.`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      toast({
        title: 'Revert Payout Failed',
        description: err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
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
          _hover={{ bg: 'gray.100' }}
        >
          Back to Payroll Dashboard
        </Button>
        <Flex justify="space-between" align="center" mb={5}>
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              Payout Payout Logs (Paid)
            </Text>
            <Text fontSize="xs" color="gray.400">
              View and audit all successfully disbursed employee monthly payouts.
            </Text>
          </Box>
        </Flex>

        {/* Search */}
        <InputGroup mb={5} maxW="320px">
          <InputLeftElement pointerEvents="none">
            <Text color="gray.400" fontSize="sm">🔍</Text>
          </InputLeftElement>
          <Input
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
            fontSize="sm"
          />
        </InputGroup>

        {/* Table / Loader */}
        {isLoading ? (
          <Flex justify="center" py={12}><Spinner size="lg" color="blue.500" /></Flex>
        ) : (
          <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
            {filteredSlips.length === 0 ? (
              <Flex justify="center" align="center" py={16}>
                <Text color="gray.400" fontSize="sm">No recorded payments yet.</Text>
              </Flex>
            ) : (
              <Table variant="simple" size="md">
                <Thead bg="gray.50">
                  <Tr>
                    <Th color="gray.500" fontWeight="semibold" fontSize="xs">Employee Name</Th>
                    <Th color="gray.500" fontWeight="semibold" fontSize="xs" textAlign="center">Month</Th>
                    <Th color="gray.500" fontWeight="semibold" fontSize="xs" textAlign="right">Net Salary</Th>
                    <Th color="gray.500" fontWeight="semibold" fontSize="xs" textAlign="center">Paid</Th>
                    <Th color="gray.500" fontWeight="semibold" fontSize="xs" textAlign="center">Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSlips.map((slip) => (
                    <Tr key={slip.id} _hover={{ bg: 'gray.50' }}>
                      {/* Name */}
                      <Td py={3}>
                        <Flex align="center" gap={3}>
                          <Avatar size="xs" name={slip.employees?.name} />
                          <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                            {slip.employees?.name}
                          </Text>
                        </Flex>
                      </Td>

                      {/* Month */}
                      <Td textAlign="center" fontSize="sm" color="gray.600">
                        {slip.month}
                      </Td>

                      {/* Net Salary */}
                      <Td textAlign="right" fontWeight="semibold" fontSize="sm" color="gray.700">
                        {formatRs(slip.net_salary)}
                      </Td>

                      {/* Paid Status */}
                      <Td textAlign="center">
                        <Badge
                          px={3} py={0.5}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="semibold"
                          bg="green.50"
                          color="green.600"
                        >
                          Yes
                        </Badge>
                      </Td>

                      {/* Undo Action */}
                      <Td textAlign="center">
                        <Button
                          size="xs"
                          colorScheme="orange"
                          variant="outline"
                          borderRadius="md"
                          isLoading={revertMutation.isPending}
                          onClick={() => handleRevertPayment(slip)}
                        >
                          Undo
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        )}

        {/* Count */}
        {!isLoading && (
          <Text mt={3} fontSize="xs" color="gray.400">
            {filteredSlips.length} recorded payout{filteredSlips.length !== 1 ? 's' : ''}
          </Text>
        )}
      </Box>
    </DashboardLayout>
  );
}
