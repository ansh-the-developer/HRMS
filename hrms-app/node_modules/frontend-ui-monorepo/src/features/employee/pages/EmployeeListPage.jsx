// src/features/employee/pages/EmployeeListPage.jsx
import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useToast } from "@chakra-ui/react";
import { useEmployees } from '../../../hooks/useEmployees';

const EmployeeListPage = () => {
  const toast = useToast();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const filterType = searchParams.get("filterType") || location.state?.filterType;
  const filterValue = searchParams.get("filterValue") || location.state?.filterValue;

  const {
    data: employees,
    isLoading,
    error,
    refetch,
  } = useEmployees({ filterType, filterValue });   // ✅ USES HOOK

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
            <VStack spacing={4}>
              <Spinner size="lg" thickness="4px" color="blue.500" />
              <Text color="gray.500">Loading employees...</Text>
            </VStack>
          </Box>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
            <VStack spacing={4}>
              <Text color="red.500" fontSize="lg">Error loading employees</Text>
              <Text color="gray.500">{error.message}</Text>
              <HRMSButton size="sm" onClick={() => refetch()}>
                🔄 Retry
              </HRMSButton>
            </VStack>
          </Box>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <VStack spacing={6} w="full">
          {/* ❌ REMOVED: EmployeeConfigCard (as per requirements) */}
          <Box w="full">
            <EmployeeTable
              employees={employees || []}
              filterType={filterType}
              filterValue={filterValue}
              refetchEmployees={refetch}
            />
          </Box>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default EmployeeListPage;