import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

export default function PayrollOverviewPage() {
  return (
    <DashboardLayout>
      <Box p="8">
        <Text fontSize="2xl" fontWeight="bold" mb="6">Payroll Overview</Text>
        <Table>
          <Thead><Tr><Th>Employee</Th><Th>Salary</Th><Th>Deduction</Th><Th>Paid</Th></Tr></Thead>
          <Tbody>
            <Tr><Td>Leslie Wilson</Td><Td>₹10,000</Td><Td>₹3,000</Td><Td>Yes</Td></Tr>
          </Tbody>
        </Table>
      </Box>
    </DashboardLayout>
  );
}
