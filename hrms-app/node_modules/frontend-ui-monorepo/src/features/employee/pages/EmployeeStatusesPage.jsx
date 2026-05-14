// src/features/employee/pages/EmployeeStatusesPage.jsx
import { useState } from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import DepartmentListItem from "@/components/atomic/molecules/DepartmentListItem";
import { EMPLOYEE_FILTER_TYPES } from "@shared/employeeFilters";
import HRMSInput from "./../../../components/atomic/atoms/HRMSInput";
import { useRole } from "@/hooks/useRole";

const PROTECTED_STATUSES = ["Permanent"];

const EmployeeStatusesPage = () => {
  const navigate = useNavigate();
  const { isHR } = useRole();

  const [statusName, setStatusName] = useState("");
  const [statusList, setStatusList] = useState([
    { name: "Permanent" },
    { name: "Contract" },
    { name: "Intern" },
    { name: "Probation" },
    { name: "Notice Period" },
  ]);

  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState("");

  const handleAddStatus = () => {
    if (!isHR) return;
    const value = statusName.trim();
    if (!value) return;

    setStatusList((prev) => [...prev, { name: value }]);
    setStatusName("");
  };

  const handleDeleteStatus = (name) => {
    if (!isHR) return;
    if (PROTECTED_STATUSES.includes(name)) return;
    if (!window.confirm(`Delete status "${name}"?`)) return;
    setStatusList((prev) => prev.filter((s) => s.name !== name));
  };

  const handleSaveEdit = () => {
    if (!isHR) return;
    const value = tempName.trim();
    if (!value) return;

    setStatusList((prev) =>
      prev.map((s) => (s.name === editingName ? { ...s, name: value } : s))
    );

    setEditingName(null);
    setTempName("");
  };

  const handleViewStatus = (name) => {
    navigate("/employees", {
      state: {
        filterType: EMPLOYEE_FILTER_TYPES.STATUS,
        filterValue: name,
      },
    });
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          <Box>
            <Heading size="md" mb={4}>
              Employment Status
            </Heading>

            {isHR && (
              <Box maxW="420px">
                <HRMSInput
                  placeholder="Status Name"
                  h="56px"
                  value={statusName}
                  onChange={(e) => setStatusName(e.target.value)}
                />
                <Box mt={4} display="flex" justifyContent="flex-end">
                  <HRMSButton
                    w={{ base: "100%", sm: "202px" }}
                    h="50px"
                    borderRadius="10px"
                    px="20px"
                    gap="10px"
                    onClick={handleAddStatus}
                  >
                    Add
                  </HRMSButton>
                </Box>
              </Box>
            )}

            <Text fontSize="xs" color="gray.500" mt={3}>
              * Permanent status is system-defined and cannot be edited or deleted.
            </Text>

            {!isHR && (
              <Text fontSize="sm" color="gray.500" mt={3}>
                You have view-only access. Only HR can add, edit, or delete statuses.
              </Text>
            )}
          </Box>

          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            {statusList.map((s) => {
              const isProtected = PROTECTED_STATUSES.includes(s.name);

              return (
                <DepartmentListItem
                  key={s.name}
                  name={s.name}
                  onView={() => handleViewStatus(s.name)}
                  onEdit={
                    isHR && !isProtected
                      ? () => {
                          setEditingName(s.name);
                          setTempName(s.name);
                        }
                      : undefined
                  }
                  onDelete={
                    isHR && !isProtected
                      ? () => handleDeleteStatus(s.name)
                      : undefined
                  }
                />
              );
            })}
          </Box>
        </SimpleGrid>

        {isHR && editingName && (
          <Box mt={10}>
            <Text fontWeight="semibold" mb={2}>
              Rename Status
            </Text>
            <Box maxW="420px">
              <HRMSInput
                h="56px"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />
              <Box mt={3} display="flex" gap={3}>
                <HRMSButton w="140px" onClick={handleSaveEdit}>
                  Save
                </HRMSButton>
                <HRMSButton
                  variant="outline"
                  w="120px"
                  onClick={() => {
                    setEditingName(null);
                    setTempName("");
                  }}
                >
                  Cancel
                </HRMSButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default EmployeeStatusesPage;