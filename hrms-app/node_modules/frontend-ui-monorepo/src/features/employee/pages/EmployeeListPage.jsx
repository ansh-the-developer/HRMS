import React, { useState } from "react";
import { Box, Flex, Text, Spinner, VStack } from "@chakra-ui/react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import EmployeeMasterForm from "@/features/employee/components/EmployeeMasterForm";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useEmployees } from "@/hooks";

const EmployeeListPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const filterType = searchParams.get("filterType") || location.state?.filterType;
  const filterValue = searchParams.get("filterValue") || location.state?.filterValue;

  const { data: employees = [], isLoading, error, refetch } = useEmployees({ filterType, filterValue });

  const handleAddNew = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
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
        {/* ── Page Header ── */}
        <Flex justify="space-between" align="flex-start" mb={6}>
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.900" lineHeight="1.2">
              Employee Master
            </Text>
            <Text fontSize="sm" color="gray.400" mt={1}>
              Compliance, Identity & Financial Directory
            </Text>
          </Box>
          <HRMSButton withPlusIcon onClick={handleAddNew} h="44px" px={6}>
            Add New Record
          </HRMSButton>
        </Flex>

        {/* ── Table ── */}
        <EmployeeTable
          employees={employees}
          isLoading={isLoading}
          error={error}
          refetchEmployees={refetch}
          onEdit={handleEdit}
        />
      </Box>

      {/* ── Create / Edit Modal ── */}
      <EmployeeMasterForm
        isOpen={isFormOpen}
        onClose={handleClose}
        employee={editingEmployee}
        onSuccess={handleSuccess}
      />
    </DashboardLayout>
  );
};

export default EmployeeListPage;