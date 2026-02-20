import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import { Box, Button, Text } from '@chakra-ui/react';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';

export default function PayrollSlipsPage() {
  return (
    <DashboardLayout>
      <Box p="8" bg="white" borderRadius="lg" boxShadow="md">
        <Text fontSize="2xl" fontWeight="bold" mb="6">Download Payslips</Text>
        <HRMSButton size="lg">Download Payslips</HRMSButton>
      </Box>
    </DashboardLayout>
  );
}
