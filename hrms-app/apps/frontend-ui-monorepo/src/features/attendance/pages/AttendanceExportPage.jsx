import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Heading, Text } from "@chakra-ui/react";

const AttendanceExportPage = () => {
  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Heading size="md" mb={1}>
          AttendanceExportPage
        </Heading>
        <Text fontSize="sm" color="text-muted">
          AttendanceExportPage module UI
        </Text>
      </Box>  
    </DashboardLayout>
  );
};

export default AttendanceExportPage;
