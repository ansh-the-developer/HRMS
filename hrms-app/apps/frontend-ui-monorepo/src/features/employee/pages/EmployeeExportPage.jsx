// src/features/employee/pages/EmployeeExportPage.jsx
import { Box, Heading, Text, Stack } from "@chakra-ui/react";

import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const EmployeeExportPage = () => {
  const handleExport = () => {
    // UI-only for now
    alert("Employee export will be available once backend is connected.");
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Heading size="md" mb={2}>
          Export Employees
        </Heading>

        <Text fontSize="sm" color="text-muted" mb={8}>
          Download employee records for reporting, payroll, or compliance.
        </Text>

        <Box
          maxW="420px"
          bg="card-bg"
          borderRadius="lg"
          boxShadow="sm"
          borderWidth="1px"
          borderColor="border-color"
          p={6}
        >
          <Stack spacing={4}>
            <Text fontWeight="semibold">
              Export all employee records
            </Text>

            <Text fontSize="sm" color="text-muted">
              The export will include employee details such as name, ID,
              department, designation, status, and location.
            </Text>

            <HRMSButton
              h="50px"
              borderRadius="md"
              onClick={handleExport}
            >
              Export Employees
            </HRMSButton>
          </Stack>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default EmployeeExportPage;
