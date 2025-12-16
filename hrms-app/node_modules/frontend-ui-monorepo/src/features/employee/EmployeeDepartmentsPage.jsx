// src/features/employee/pages/EmployeeDepartmentsPage.jsx
import { useState } from "react";
import { Box, Heading, SimpleGrid, Text, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // for navigation with filter state [web:260][web:266]
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import DepartmentListItem from "@/components/atomic/molecules/DepartmentListItem";

const EmployeeDepartmentsPage = () => {
  // Local input state for controlled fields
  const [departmentName, setDepartmentName] = useState("");
  const [teamName, setTeamName] = useState("");

  // Local list state so Add buttons can append new items
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

  // Tracks which item is being edited and the temporary name
  // type: "department" | "team", name: current name before edit
  const [editingItem, setEditingItem] = useState(null);
  const [editingName, setEditingName] = useState("");

  const navigate = useNavigate();

  // Adds a new department row with 0 members
  const handleAddDepartment = () => {
    const value = departmentName.trim();
    if (!value) return;
    setDepartmentList((prev) => [
      ...prev,
      { name: value, membersLabel: "0 Members" },
    ]);
    setDepartmentName("");
  };

  // Adds a new team row with 0 members
  const handleAddTeam = () => {
    const value = teamName.trim();
    if (!value) return;
    setTeamList((prev) => [
      ...prev,
      { name: value, membersLabel: "0 Members" },
    ]);
    setTeamName("");
  };

  // Remove a department by name from the departmentList state (with confirm)
  const handleDeleteDepartment = (name) => {
    const ok = window.confirm(`Delete department "${name}"?`);
    if (!ok) return;
    setDepartmentList((prev) => prev.filter((d) => d.name !== name));
  };

  // Remove a team by name from the teamList state (with confirm)
  const handleDeleteTeam = (name) => {
    const ok = window.confirm(`Delete team "${name}"?`);
    if (!ok) return;
    setTeamList((prev) => prev.filter((t) => t.name !== name));
  };

  // Save the edited name into the correct list item
  const handleSaveEdit = () => {
    const trimmed = editingName.trim();
    if (!trimmed || !editingItem) return;

    if (editingItem.type === "department") {
      // Update one item in departmentList immutably using map [web:219][web:229]
      setDepartmentList((prev) =>
        prev.map((d) =>
          d.name === editingItem.name ? { ...d, name: trimmed } : d
        )
      );
    } else {
      // Update one item in teamList
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

  // Navigate back to employee list with a filter in location.state
  const handleViewDepartment = (name) => {
    navigate("/employees", {
      state: {
        filterType: "department",
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
        <Text fontSize="sm" color="gray.500" mb={6}>
          Manage departments and teams.
        </Text>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Left: Departments */}
          <Box bg="white" borderRadius="lg" boxShadow="sm" p={4}>
            <Text mb={3} fontWeight="semibold">
              Add Department
            </Text>

            {/* Input + right-aligned Add button */}
            <Box mb={4} maxW="420px" w="100%">
              <Input
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

            {/* Department list using reusable row molecule */}
            <Box
              mt={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.100"
              bg="white"
            >
              {departmentList.map((d) => (
                <DepartmentListItem
                  key={d.name}
                  name={d.name}
                  membersLabel={d.membersLabel}
                  onDelete={() => handleDeleteDepartment(d.name)}
                  onEdit={() => {
                    // Open edit mode for this department
                    setEditingItem({ type: "department", name: d.name });
                    setEditingName(d.name);
                  }}
                  onView={() => handleViewDepartment(d.name)}
                />
              ))}
            </Box>
          </Box>

          {/* Right: Teams */}
          <Box bg="white" borderRadius="lg" boxShadow="sm" p={4}>
            <Text mb={3} fontWeight="semibold">
              Add Team
            </Text>

            {/* Input + right-aligned Add button */}
            <Box mb={4} maxW="420px" w="100%">
              <Input
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

            {/* Team list using same row molecule */}
            <Box
              mt={4}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.100"
              bg="white"
            >
              {teamList.map((t) => (
                <DepartmentListItem
                  key={t.name}
                  name={t.name}
                  membersLabel={t.membersLabel}
                  onDelete={() => handleDeleteTeam(t.name)}
                  onEdit={() => {
                    // Open edit mode for this team
                    setEditingItem({ type: "team", name: t.name });
                    setEditingName(t.name);
                  }}
                  onView={() => handleViewTeam(t.name)}
                />
              ))}
            </Box>
          </Box>
        </SimpleGrid>

        {/* Simple inline edit section shown when an item is being edited */}
        {editingItem && (
          <Box mt={8}>
            <Text fontWeight="semibold" mb={2}>
              Rename {editingItem.type === "department" ? "Department" : "Team"}
            </Text>
            <Box maxW="420px" w="100%">
              <Input
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
