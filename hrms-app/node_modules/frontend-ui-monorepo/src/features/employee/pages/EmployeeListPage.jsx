import React, { useState } from "react";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import EmployeeMasterForm from "@/features/employee/components/EmployeeMasterForm";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useEmployees } from "@/hooks";
import { getEmployeeProfile } from "@/services/employeeApi";
import { useRole } from "@/hooks/useRole";

const EmployeeListPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { isHR, isManager } = useRole();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const filterType = searchParams.get("filterType") || location.state?.filterType;
  const filterValue =
    searchParams.get("filterValue") || location.state?.filterValue;

  const {
    data: employees = [],
    isLoading,
    error,
    refetch,
  } = useEmployees({ filterType, filterValue });

  const handleAddNew = () => {
    if (!isHR) return;
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleRowClick = (employee) => {
    navigate(`/employees/${employee.id}`);
  };

  const handleEdit = async (employee) => {
    if (!isHR) return;

    setLoadingProfile(true);
    try {
      const fullProfile = await getEmployeeProfile(employee.id);
      setEditingEmployee(fullProfile);
      setIsFormOpen(true);
    } catch (err) {
      toast({
        title: "Failed to load employee profile",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  const handleSuccess = () => {
    refetch();
    handleClose();
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6} minH="100vh" bg="gray.50">
        <Flex justify="space-between" align="flex-start" mb={6}>
          <Box>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="gray.900"
              lineHeight="1.2"
            >
              Employee Master
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Compliance, Identity & Financial Directory
            </Text>
            {isManager && (
              <Text fontSize="sm" color="orange.500" mt={2}>
                View-only access enabled for manager role.
              </Text>
            )}
          </Box>

          {isHR && (
            <HRMSButton withPlusIcon onClick={handleAddNew} h="44px" px={6}>
              Add New Record
            </HRMSButton>
          )}
        </Flex>

        <EmployeeTable
          employees={employees}
          isLoading={isLoading || loadingProfile}
          error={error}
          refetchEmployees={refetch}
          onEdit={isHR ? handleEdit : undefined}
          onRowClick={handleRowClick}
          isReadOnly={!isHR}
        />
      </Box>

      {isHR && (
        <EmployeeMasterForm
          isOpen={isFormOpen}
          onClose={handleClose}
          employee={editingEmployee}
          onSuccess={handleSuccess}
        />
      )}
    </DashboardLayout>
  );
};

export default EmployeeListPage;