import { Box, Flex, Spinner, Text, VStack } from "@chakra-ui/react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import EmployeeConfigCard from "@/components/atomic/organisms/EmployeeConfigCard";
import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeApi";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useToast } from "@chakra-ui/react";

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
  } = useQuery({
    queryKey: ["employees", filterType, filterValue],
    queryFn: () => getEmployees({ filterType, filterValue }),
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <VStack spacing={6}>
            <Box flex={1} w="full">
              <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
                <VStack spacing={4}>
                  <Spinner size="lg" thickness="4px" color="blue.500" />
                  <Text color="gray.500">Loading employees...</Text>
                </VStack>
              </Box>
            </Box>
            <EmployeeConfigCard />
          </VStack>
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Box px={{ base: 4, md: 8 }} py={6}>
          <VStack spacing={6}>
            <Box flex={1} w="full">
              <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
                <VStack spacing={4}>
                  <Text color="red.500" fontSize="lg">
                    Error loading employees
                  </Text>
                  <Text color="gray.500">{error.message}</Text>
                  <HRMSButton size="sm" onClick={() => refetch()}>
                    🔄 Retry
                  </HRMSButton>
                </VStack>
              </Box>
            </Box>
            <EmployeeConfigCard />
          </VStack>
        </Box>
      </DashboardLayout>
    );
  }

return (
  <DashboardLayout>
    <Box px={{ base: 4, md: 8 }} py={6}>
      <VStack spacing={6} w="full">
        {/* Main Table - Always full width */}
        <Box w="full">
          <EmployeeTable 
            employees={employees || []} 
            filterType={filterType} 
            filterValue={filterValue}
            refetchEmployees={refetch}
          />
        </Box>
        
        {/* Config Card - Full width matching table */}
        <Box w="full">
          <EmployeeConfigCard />
        </Box>
      </VStack>
    </Box>
  </DashboardLayout>
);

};

export default EmployeeListPage;
