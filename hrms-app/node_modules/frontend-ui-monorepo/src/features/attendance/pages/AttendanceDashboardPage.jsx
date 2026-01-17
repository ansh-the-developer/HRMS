import { Box, Heading, Text, Flex } from "@chakra-ui/react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

import AttendanceSearchInput from "../components/molecules/AttendanceSearchInput";
import AttendanceTable from "../components/organisms/AttendanceTable";
import { attendanceMockData } from "../constants/attendanceMockData";
import AttendanceConfigCard from './AttendanceConfigCard';

const AttendanceDashboardPage = () => {
  return (
    <DashboardLayout>
      <Box
        mt={4}
        maxH="440px"
        overflowY="auto"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.100"
      >
        {/* Attendance Table */}
        <AttendanceTable data={attendanceMockData} />
      </Box>
      <Box mt={6}>
  <AttendanceConfigCard />
</Box>
    </DashboardLayout>
  );
};

export default AttendanceDashboardPage;
