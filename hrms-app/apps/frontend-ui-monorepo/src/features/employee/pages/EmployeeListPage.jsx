// src/features/employee/pages/EmployeeListPage.jsx
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom"; // read filter passed via navigation [web:271][web:293]
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import EmployeeConfigCard from "@/components/atomic/organisms/EmployeeConfigCard";

const EmployeeListPage = () => {
  const location = useLocation();
  const filterType = location.state?.filterType || null;
  const filterValue = location.state?.filterValue || null;

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        {/* Pass filter info down so the table can show only matching rows */}
        <EmployeeTable filterType={filterType} filterValue={filterValue} />
        <EmployeeConfigCard />
      </Box>
    </DashboardLayout>
  );
};

export default EmployeeListPage;
