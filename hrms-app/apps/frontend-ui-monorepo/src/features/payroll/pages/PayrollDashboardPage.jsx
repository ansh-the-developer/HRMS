// src/features/payroll/pages/PayrollDashboardPage.jsx
import { Box, Flex, Text, HStack, Avatar } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';

const employees = [
  { id: 1, name: 'Leasie Watson',    ctc: '₹50,000',    salary: '₹40,000',   deduction: '₹10,000', paid: 'Yes', status: 'On Time',    statusType: 'green' },
  { id: 2, name: 'Jacob Jones',      ctc: '₹55,000',    salary: '₹50,000',   deduction: '₹10,000', paid: 'Yes', status: 'On Time',    statusType: 'green' },
  { id: 3, name: 'Leslie Alexander', ctc: '₹7,50,000',  salary: '₹5,00,000', deduction: '₹2,00,000', paid: 'No', status: 'Late',      statusType: 'red'   },
  { id: 4, name: 'Guy Hawkins',      ctc: '₹32,000',    salary: '₹30,000',   deduction: '₹2,000',  paid: 'No',  status: 'Yet to pay', statusType: 'teal'  },
  { id: 5, name: 'Albert Flores',    ctc: '₹12,000',    salary: '₹11,500',   deduction: '₹500',    paid: 'Yes', status: 'On Time',    statusType: 'green' },
  { id: 6, name: 'Savannah Nguyen',  ctc: '₹70,000',    salary: '₹68,000',   deduction: '₹2,000',  paid: 'No',  status: 'Yet to pay', statusType: 'teal'  },
  { id: 7, name: 'Jenny Wilson',     ctc: '₹50,500',    salary: '₹40,500',   deduction: '₹10,000', paid: 'No',  status: 'Yet to pay', statusType: 'teal'  },
];

const statusColors = {
  green: { bg: 'transparent', color: 'green.500', border: 'none' },
  teal:  { bg: 'transparent', color: 'teal.500',  border: 'none' },
  red:   { bg: 'red.500',     color: 'white',     border: 'none' },
};

const actionRows = [
  { title: 'Record Payment',             sub: 'Update payment status',                                             btnLabel: 'Record', path: '/payroll/record'        },
  { title: 'Generate Payslip',           sub: 'Download your payslips',                                            btnLabel: 'Get',    path: '/payroll/payslips'      },
  { title: 'Salary Structure Management:', sub: 'Assign relevant earning and deduction components to each structure.', btnLabel: 'Edit',   path: '/payroll/structure'     },
  { title: 'Reimbursement Status',       sub: 'Request and Track the status of their claims (Pending, Approved, Rejected).', btnLabel: 'Check', path: '/payroll/reimbursement' },
];

export default function PayrollDashboardPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Flex direction="column" gap="6" p="4">

        {/* ── Employee Table ── */}
        <Box border="2px solid" borderColor="blue.300" borderRadius="md" overflow="hidden">
          {/* Header Row */}
          <Flex
            px="4" py="3"
            borderBottom="1px dashed" borderColor="blue.200"
            color="gray.500" fontSize="sm" fontWeight="medium"
          >
            <Text flex="2">Employee Name</Text>
            <Text flex="1.5" textAlign="right">CTC</Text>
            <Text flex="1.5" textAlign="right">Salary Per Month</Text>
            <Text flex="1.5" textAlign="right">Deduction</Text>
            <Text flex="1" textAlign="center">Paid</Text>
            <Text flex="1" textAlign="center">Status</Text>
          </Flex>

          {/* Data Rows */}
          {employees.map((emp, i) => (
            <Flex
              key={emp.id}
              px="4" py="3"
              align="center"
              borderBottom={i < employees.length - 1 ? '1px dashed' : 'none'}
              borderColor="blue.100"
              _hover={{ bg: 'gray.50' }}
              fontSize="sm"
            >
              {/* Name + Avatar */}
              <HStack flex="2" spacing="3">
                <Avatar size="sm" name={emp.name} />
                <Text fontWeight="medium">{emp.name}</Text>
              </HStack>

              {/* CTC */}
              <Text flex="1.5" textAlign="right" color="gray.700">{emp.ctc}</Text>

              {/* Salary */}
              <Text flex="1.5" textAlign="right" color="gray.700">{emp.salary}</Text>

              {/* Deduction */}
              <Text flex="1.5" textAlign="right" color="gray.700">{emp.deduction}</Text>

              {/* Paid */}
              <Text flex="1" textAlign="center" color="gray.700">{emp.paid}</Text>

              {/* Status Badge */}
              <Box flex="1" textAlign="center">
                <Box
                  as="span"
                  display="inline-block"
                  px="3" py="1"
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="semibold"
                  bg={statusColors[emp.statusType].bg}
                  color={statusColors[emp.statusType].color}
                >
                  {emp.status}
                </Box>
              </Box>
            </Flex>
          ))}
        </Box>

        {/* ── Action Rows ── */}
        <Flex direction="column" gap="0">
          {actionRows.map((row, i) => (
            <Flex
              key={i}
              align="center"
              justify="space-between"
              px="4" py="4"
              borderBottom="1px solid" borderColor="gray.100"
            >
              <Box>
                <Text fontWeight="bold" fontSize="sm">{row.title}</Text>
                <Text fontSize="xs" color="gray.500">{row.sub}</Text>
              </Box>
              <HRMSButton
                size="sm"
                colorScheme="blue"
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
