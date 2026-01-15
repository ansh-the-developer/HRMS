// src/features/employee/pages/EmployeeTypesPage.jsx
import { useState } from "react";
import { Box, Heading, Text, Input, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import DepartmentListItem from "@/components/atomic/molecules/DepartmentListItem";

import { EMPLOYEE_FILTER_TYPES } from "@shared/employeeFilters";

const EmployeeTypesPage = () => {
  const navigate = useNavigate();

  const [typeName, setTypeName] = useState("");
  const [typeList, setTypeList] = useState([
    { name: "Salaried" },
    { name: "Hourly" },
    { name: "Consultant" },
    { name: "Freelancer" },
  ]);

  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState("");

  /* ---------------- Handlers ---------------- */

  const handleAddType = () => {
    const value = typeName.trim();
    if (!value) return;

    setTypeList((prev) => [...prev, { name: value }]);
    setTypeName("");
  };

  const handleDeleteType = (name) => {
    if (!window.confirm(`Delete employee type "${name}"?`)) return;
    setTypeList((prev) => prev.filter((t) => t.name !== name));
  };

  const handleSaveEdit = () => {
    const value = tempName.trim();
    if (!value) return;

    setTypeList((prev) =>
      prev.map((t) =>
        t.name === editingName ? { ...t, name: value } : t
      )
    );

    setEditingName(null);
    setTempName("");
  };

  const handleViewType = (name) => {
    navigate("/employees", {
      state: {
        filterType: EMPLOYEE_FILTER_TYPES.TYPE,
        filterValue: name,
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          {/* Left section */}
          <Box>
            <Heading size="md" mb={4}>
              Employee Types
            </Heading>

            <Box maxW="420px">
              <Input
                placeholder="Employee Type"
                h="56px"
                value={typeName}
                onChange={(e) => setTypeName(e.target.value)}
              />
              <Box mt={4} display="flex" justifyContent="center">
                <HRMSButton w="200px" h="50px" onClick={handleAddType}>
                  Add
                </HRMSButton>
              </Box>
            </Box>

            <Text fontSize="xs" color="gray.500" mt={3}>
              Define how employees are categorized for payroll and contracts.
            </Text>
          </Box>

          {/* Right section */}
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            {typeList.map((t) => (
              <DepartmentListItem
                key={t.name}
                name={t.name}
                onView={() => handleViewType(t.name)}
                onEdit={() => {
                  setEditingName(t.name);
                  setTempName(t.name);
                }}
                onDelete={() => handleDeleteType(t.name)}
              />
            ))}
          </Box>
        </SimpleGrid>

        {/* Inline edit */}
        {editingName && (
          <Box mt={10}>
            <Text fontWeight="semibold" mb={2}>
              Rename Employee Type
            </Text>
            <Box maxW="420px">
              <Input
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

export default EmployeeTypesPage;
