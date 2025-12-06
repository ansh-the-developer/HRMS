// src/features/employee/pages/EmployeeListPage.jsx
import { Box, Heading, Text } from "@chakra-ui/react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import EmployeeConfigCard from "@/components/atomic/organisms/EmployeeConfigCard";

const EmployeeListPage = () => {
  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <EmployeeTable />
        <EmployeeConfigCard />
      </Box>
    </DashboardLayout>
  );
};

export default EmployeeListPage;
