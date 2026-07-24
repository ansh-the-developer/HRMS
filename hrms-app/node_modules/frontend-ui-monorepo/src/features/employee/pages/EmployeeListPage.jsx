import React, { useState } from "react";
import { Box, Flex, Text, useToast, HStack, IconButton } from "@chakra-ui/react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { FiDownload, FiUpload } from "react-icons/fi";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeTable from "@/components/atomic/organisms/EmployeeTable";
import EmployeeMasterForm from "@/features/employee/components/EmployeeMasterForm";
import EmployeeBulkImportModal from "@/features/employee/components/EmployeeBulkImportModal";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useEmployees } from "@/hooks";
import { getEmployeeProfile } from "@/services/employeeApi";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/lib/supabaseClient";

const EmployeeListPage = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { isHR, isManager, canViewEmployees } = useRole();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  const handleExportCSV = async () => {
    if (!canViewEmployees) return;
    setIsExporting(true);

    try {
      const [empRes, compRes, bankRes] = await Promise.all([
        supabase.from("employees").select("*").order("emp_code", { ascending: true }),
        supabase.from("employee_compliance").select("*"),
        supabase.from("employee_banking").select("*")
      ]);

      if (empRes.error) throw empRes.error;
      if (compRes.error) throw compRes.error;
      if (bankRes.error) throw bankRes.error;

      const employeesData = empRes.data || [];
      const complianceMap = {};
      compRes.data?.forEach(c => {
        complianceMap[c.employee_id] = c;
      });

      const bankingMap = {};
      bankRes.data?.forEach(b => {
        bankingMap[b.employee_id] = b;
      });

      const headers = [
        "emp_id", "full_name", "nickname", "dob", "gender", "marital", "personal_num",
        "address", "permanent_address", "qualification", "email", "blood_group",
        "emergency_contact", "doj", "emp_type", "dept", "desig", "location",
        "reporting_manager", "monthly_ctc", "annual_quota", "sick_quota", "casual_quota",
        "casual_monthly_quota", "b1_name", "b1_acc", "b1_ifsc", "temp_password"
      ];

      const formatCSVDate = (dateStr) => {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        if (parts.length === 3) {
          return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
      };

      const escapeCSVCell = (val) => {
        if (val === null || val === undefined) return "";
        const str = String(val);
        if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const csvRows = [headers.join(",")];

      employeesData.forEach(emp => {
        const comp = complianceMap[emp.id] || {};
        const bank = bankingMap[emp.id] || {};
        const pBank = bank.primary_bank || {};

        const row = [
          escapeCSVCell(emp.emp_code),
          escapeCSVCell(emp.name),
          escapeCSVCell(emp.nickname),
          escapeCSVCell(formatCSVDate(emp.birthdate)),
          escapeCSVCell(emp.gender),
          escapeCSVCell(emp.marital_status),
          escapeCSVCell(emp.personal_number),
          escapeCSVCell(emp.present_address),
          escapeCSVCell(emp.permanent_address),
          escapeCSVCell(emp.qualification),
          escapeCSVCell(emp.email),
          escapeCSVCell(emp.blood_group),
          escapeCSVCell(emp.emergency_contact),
          escapeCSVCell(formatCSVDate(emp.doj)),
          escapeCSVCell(emp.employee_type),
          escapeCSVCell(emp.department),
          escapeCSVCell(emp.designation),
          escapeCSVCell(emp.work_location),
          escapeCSVCell(emp.reporting_manager),
          escapeCSVCell(emp.monthly_ctc),
          escapeCSVCell(emp.annual_quota),
          escapeCSVCell(emp.sick_quota),
          escapeCSVCell(emp.casual_quota),
          escapeCSVCell(emp.casual_monthly_quota),
          escapeCSVCell(pBank.bank_name),
          escapeCSVCell(pBank.account_number),
          escapeCSVCell(pBank.ifsc_code),
          ""
        ];

        csvRows.push(row.join(","));
      });

      const csvContent = "\uFEFF" + csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "employees_export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export complete",
        description: `Successfully exported ${employeesData.length} records.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Export failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
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
      <Box px={{ base: 4, md: 8 }} py={6} minH="100vh" bg="app-bg-secondary">
        <Flex justify="space-between" align="flex-start" mb={6}>
          <Box>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="text-primary"
              lineHeight="1.2"
            >
              Employee Management
            </Text>
            <Text fontSize="sm" color="text-muted" mt={1}>
              Compliance, Identity & Financial Directory
            </Text>
            {isManager && !isHR && (
              <Text fontSize="sm" color="orange.500" mt={2}>
                View-only access enabled for manager role.
              </Text>
            )}
          </Box>

          <HStack spacing={3}>
            {canViewEmployees && (
              <IconButton
                icon={<FiDownload />}
                variant="outline"
                bg="card-bg"
                borderColor="border-color"
                color="text-secondary"
                h="44px"
                w="44px"
                borderRadius="xl"
                _hover={{ bg: "hover-bg", borderColor: "accent" }}
                aria-label="Export CSV"
                onClick={handleExportCSV}
                isLoading={isExporting}
              />
            )}
            {isHR && (
              <>
                <IconButton
                  icon={<FiUpload />}
                  variant="outline"
                  bg="card-bg"
                  borderColor="border-color"
                  color="text-secondary"
                  h="44px"
                  w="44px"
                  borderRadius="xl"
                  _hover={{ bg: "hover-bg", borderColor: "accent" }}
                  aria-label="Bulk Import"
                  onClick={() => setIsImportOpen(true)}
                />
                <HRMSButton
                  onClick={handleAddNew}
                  h="44px"
                  px={6}
                  bg="accent"
                  color="white"
                  borderRadius="xl"
                  _hover={{ bg: "#3D17D9" }}
                  fontSize="sm"
                  fontWeight="bold"
                >
                  + Add Record
                </HRMSButton>
              </>
            )}
          </HStack>
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
        <>
          <EmployeeMasterForm
            isOpen={isFormOpen}
            onClose={handleClose}
            employee={editingEmployee}
            onSuccess={handleSuccess}
          />
          <EmployeeBulkImportModal
            isOpen={isImportOpen}
            onClose={() => setIsImportOpen(false)}
            onSuccess={refetch}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default EmployeeListPage;
