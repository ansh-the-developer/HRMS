// src/features/employee/pages/EmployeeDesignationsPage.jsx
import { useState } from "react";
import { Box, Heading, Text, Input, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import DepartmentListItem from "@/components/atomic/molecules/DepartmentListItem";

import { EMPLOYEE_FILTER_TYPES } from "@shared/employeeFilters";
import HRMSInput from './../../../components/atomic/atoms/HRMSInput';

const EmployeeDesignationsPage = () => {
  const navigate = useNavigate();

  const [designationName, setDesignationName] = useState("");
  const [designationList, setDesignationList] = useState([
    { name: "HR Manager" },
    { name: "Director" },
    { name: "Managing Director" },
    { name: "Accountant" },
    { name: "Developer" },
  ]);

  const [editingName, setEditingName] = useState(null);
  const [tempName, setTempName] = useState("");

  /* ---------------- Handlers ---------------- */

  const handleAddDesignation = () => {
    const value = designationName.trim();
    if (!value) return;

    setDesignationList((prev) => [...prev, { name: value }]);
    setDesignationName("");
  };

  const handleDeleteDesignation = (name) => {
    if (!window.confirm(`Delete designation "${name}"?`)) return;
    setDesignationList((prev) => prev.filter((d) => d.name !== name));
  };

  const handleSaveEdit = () => {
    const value = tempName.trim();
    if (!value) return;

    setDesignationList((prev) =>
      prev.map((d) =>
        d.name === editingName ? { ...d, name: value } : d
      )
    );

    setEditingName(null);
    setTempName("");
  };

  const handleViewDesignation = (name) => {
    navigate("/employees", {
      state: {
        filterType: EMPLOYEE_FILTER_TYPES.DESIGNATION,
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
              Designation
            </Heading>

            <Box maxW="420px">
              <HRMSInput
                placeholder="Designation Name"
                h="56px"
                value={designationName}
                onChange={(e) => setDesignationName(e.target.value)}
              />
              <Box mt={4} display="flex" justifyContent="flex-end">
                <HRMSButton w="200px" h="50px" onClick={handleAddDesignation}>
                  Add
                </HRMSButton>
              </Box>
            </Box>
          </Box>

          {/* Right section */}
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            {designationList.map((d) => (
              <DepartmentListItem
                key={d.name}
                name={d.name}
                onView={() => handleViewDesignation(d.name)}
                onEdit={() => {
                  setEditingName(d.name);
                  setTempName(d.name);
                }}
                onDelete={() => handleDeleteDesignation(d.name)}
              />
            ))}
          </Box>
        </SimpleGrid>

        {/* Inline edit */}
        {editingName && (
          <Box mt={10}>
            <Text fontWeight="semibold" mb={2}>
              Rename Designation
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

export default EmployeeDesignationsPage;
