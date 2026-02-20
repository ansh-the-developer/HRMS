import React, { useState, useMemo } from 'react';
import {
  Avatar, Badge, Box, Flex, Input, InputGroup,
  InputLeftElement, Table, Tbody, Td, Text,
  Th, Thead, Tr, Button, useToast,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import { ALL_EMPLOYEES, formatRs } from '../constants/payrollMockData';

const STORAGE_KEY = 'hrms_payroll_employees';

const loadEmployees = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : ALL_EMPLOYEES;
  } catch {
    return ALL_EMPLOYEES;
  }
};

const saveEmployees = (employees) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
};

export default function RecordPaymentPage() {
  const toast = useToast();
  const [employees, setEmployees] = useState(loadEmployees);
  const [search, setSearch] = useState('');

  const paid = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.paid &&
          e.name.toLowerCase().includes(search.toLowerCase())
      ),
    [employees, search]
  );

  // Undo: revert payment to pending
  const undoPayment = (id) => {
    const updated = employees.map((e) =>
      e.id === id ? { ...e, paid: false, status: 'Yet to pay' } : e
    );
    setEmployees(updated);
    saveEmployees(updated);
    const emp = employees.find((e) => e.id === id);
    toast({
      title: 'Payment Reverted',
      description: `${emp?.name} moved back to pending.`,
      status: 'warning',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 6 }} py={6}>
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

        {/* Table */}
        <Box bg="white" borderRadius="lg" boxShadow="sm" overflow="hidden">
          {paid.length === 0 ? (
            <Flex justify="center" align="center" py={16}>
              <Text color="gray.400" fontSize="sm">No recorded payments yet.</Text>
            </Flex>
          ) : (
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th color="gray.400" fontWeight="medium" fontSize="xs">Employee Name</Th>
                  <Th color="gray.400" fontWeight="medium" fontSize="xs">Salary Per Month</Th>
                  <Th color="gray.400" fontWeight="medium" fontSize="xs" textAlign="center">Paid</Th>
                  <Th color="gray.400" fontWeight="medium" fontSize="xs" textAlign="center">Status</Th>
                  <Th color="gray.400" fontWeight="medium" fontSize="xs" textAlign="center">Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paid.map((emp) => (
                  <Tr key={emp.id} _hover={{ bg: 'gray.50' }}>
                    {/* Name */}
                    <Td>
                      <Flex align="center" gap={3}>
                        <Avatar size="sm" name={emp.name} />
                        <Text fontWeight="medium" fontSize="sm" color="gray.700">
                          {emp.name}
                        </Text>
                      </Flex>
                    </Td>

                    {/* Salary */}
                    <Td fontSize="sm" color="gray.700">
                      {formatRs(emp.salaryPerMonth)}
                    </Td>

                    {/* Paid */}
                    <Td textAlign="center">
                      <Badge
                        px={3} py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="semibold"
                        bg="green.50"
                        color="green.600"
                      >
                        Yes
                      </Badge>
                    </Td>

                    {/* Status */}
                    <Td textAlign="center">
                      <Badge
                        px={3} py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="semibold"
                        bg="green.50"
                        color="green.600"
                      >
                        {emp.status}
                      </Badge>
                    </Td>

                    {/* Undo */}
                    <Td textAlign="center">
                      <Button
                        size="xs"
                        colorScheme="orange"
                        variant="outline"
                        borderRadius="md"
                        onClick={() => undoPayment(emp.id)}
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

        {/* Count */}
        <Text mt={3} fontSize="xs" color="gray.400">
          {paid.length} recorded payment{paid.length !== 1 ? 's' : ''}
        </Text>
      </Box>
    </DashboardLayout>
  );
}
