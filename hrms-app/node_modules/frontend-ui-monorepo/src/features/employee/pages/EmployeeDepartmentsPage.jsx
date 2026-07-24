// src/features/employee/pages/EmployeeDepartmentsPage.jsx
import { useState } from "react";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import DepartmentListItem from "@/components/atomic/molecules/DepartmentListItem";
import { EMPLOYEE_FILTER_TYPES } from "@shared/employeeFilters";
import HRMSInput from "./../../../components/atomic/atoms/HRMSInput";
import { useRole } from "@/hooks/useRole";

const EmployeeDepartmentsPage = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [teamName, setTeamName] = useState("");

  const [departmentList, setDepartmentList] = useState([
    { name: "Human Resources", membersLabel: "5 Members" },
    { name: "Administration", membersLabel: "3 Members" },
    { name: "Management", membersLabel: "2 Members" },
    { name: "Marketing", membersLabel: "12 Members" },
    { name: "Procurement", membersLabel: "15 Members" },
    { name: "New Department", membersLabel: "0 Members" },
  ]);

  const [teamList, setTeamList] = useState([
    { name: "Aman’s Team", membersLabel: "1 Member" },
    { name: "Rahul’s Team", membersLabel: "2 Members" },
    { name: "Yashoda’s Team", membersLabel: "2 Members" },
    { name: "Ravi’s Team", membersLabel: "6 Members" },
    { name: "Mohit’s Team", membersLabel: "8 Members" },
  ]);

  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState("");

  const navigate = useNavigate();
  const { isHR } = useRole();

  const handleAddDepartment = () => {
    if (!isHR) return;
    const value = departmentName.trim();
    if (!value) return;

    setDepartmentList((prev) => [
      ...prev,
      { name: value, membersLabel: "0 Members" },
    ]);
    setDepartmentName("");
  };

  const handleAddTeam = () => {
    if (!isHR) return;
    const value = teamName.trim();
    if (!value) return;

    setTeamList((prev) => [...prev, { name: value, membersLabel: "0 Members" }]);
    setTeamName("");
  };

  const handleDeleteDepartment = (name) => {
    if (!isHR) return;
    const ok = window.confirm(`Delete department "${name}"?`);
    if (!ok) return;
    setDepartmentList((prev) => prev.filter((d) => d.name !== name));
  };

  const handleDeleteTeam = (name) => {
    if (!isHR) return;
    const ok = window.confirm(`Delete team "${name}"?`);
    if (!ok) return;
    setTeamList((prev) => prev.filter((t) => t.name !== name));
  };

  const handleSaveEdit = () => {
    if (!isHR) return;
    const trimmed = editingName.trim();
    if (!trimmed || !editingItem) return;

    if (editingItem.type === "department") {
      setDepartmentList((prev) =>
        prev.map((d) =>
          d.name === editingItem.name ? { ...d, name: trimmed } : d
        )
      );
    } else {
      setTeamList((prev) =>
        prev.map((t) =>
          t.name === editingItem.name ? { ...t, name: trimmed } : t
        )
      );
    }

    setEditingItem(null);
    setEditingName("");
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditingName("");
  };

  const handleViewDepartment = (name) => {
    navigate("/employees", {
      state: {
        filterType: EMPLOYEE_FILTER_TYPES.DEPARTMENT,
        filterValue: name,
      },
    });
  };

  const handleViewTeam = (name) => {
    navigate("/employees", {
      state: {
        filterType: "team",
        filterValue: name,
      },
    });
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Heading size="md" mb={1}>
          Departments & Teams
        </Heading>
        <Text fontSize="sm" color="text-muted" mb={6}>
          Manage departments and teams.
        </Text>

        {!isHR && (
          <Text fontSize="sm" color="text-muted" mb={6}>
            You have view-only access. Only HR can add, edit, or delete departments and teams.
          </Text>
        )}

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box bg="card-bg" borderRadius="lg" boxShadow="sm" p={4}>
            <Text mb={3} fontWeight="semibold">
              Add Department
            </Text>

            {isHR && (
              <Box mb={4} maxW="420px" w="100%">
                <HRMSInput
                  placeholder="New Department"
                  h="56px"
                  borderRadius="md"
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                />
                <Box mt={3} display="flex" justifyContent="flex-end">
                  <HRMSButton
                    w={{ base: "100%", sm: "202px" }}
                    h="50px"
                    borderRadius="md"
                    onClick={handleAddDepartment}
                  >
                    Add
                  </HRMSButton>
                </Box>
              </Box>
            )}

            <Box
              mt={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border-color"
              bg="card-bg"
            >
              {departmentList.map((d) => (
                <DepartmentListItem
                  key={d.name}
                  name={d.name}
                  membersLabel={d.membersLabel}
                  onView={() => handleViewDepartment(d.name)}
                  onEdit={
                    isHR
                      ? () => {
                          setEditingItem({ type: "department", name: d.name });
                          setEditingName(d.name);
                        }
                      : undefined
                  }
                  onDelete={
                    isHR ? () => handleDeleteDepartment(d.name) : undefined
                  }
                />
              ))}
            </Box>
          </Box>

          <Box bg="card-bg" borderRadius="lg" boxShadow="sm" p={4}>
            <Text mb={3} fontWeight="semibold">
              Add Team
            </Text>

            {isHR && (
              <Box mb={4} maxW="420px" w="100%">
                <HRMSInput
                  placeholder="Team Name"
                  h="56px"
                  borderRadius="md"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <Box mt={3} display="flex" justifyContent="flex-end">
                  <HRMSButton
                    w={{ base: "100%", sm: "202px" }}
                    h="50px"
                    borderRadius="md"
                    onClick={handleAddTeam}
                  >
                    Add
                  </HRMSButton>
                </Box>
              </Box>
            )}

            <Box
              mt={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border-color"
              bg="card-bg"
            >
              {teamList.map((t) => (
                <DepartmentListItem
                  key={t.name}
                  name={t.name}
                  membersLabel={t.membersLabel}
                  onView={() => handleViewTeam(t.name)}
                  onEdit={
                    isHR
                      ? () => {
                          setEditingItem({ type: "team", name: t.name });
                          setEditingName(t.name);
                        }
                      : undefined
                  }
                  onDelete={isHR ? () => handleDeleteTeam(t.name) : undefined}
                />
              ))}
            </Box>
          </Box>
        </SimpleGrid>

        {isHR && editingItem && (
          <Box mt={8}>
            <Text fontWeight="semibold" mb={2}>
              Rename {editingItem.type === "department" ? "Department" : "Team"}
            </Text>
            <Box maxW="420px" w="100%">
              <HRMSInput
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                h="56px"
                borderRadius="md"
              />
              <Box mt={3} display="flex" gap={3}>
                <HRMSButton
                  w="140px"
                  h="50px"
                  borderRadius="md"
                  onClick={handleSaveEdit}
                >
                  Save
                </HRMSButton>
                <HRMSButton
                  variant="outline"
                  w="120px"
                  h="50px"
                  borderRadius="md"
                  onClick={handleCancelEdit}
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

export default EmployeeDepartmentsPage;