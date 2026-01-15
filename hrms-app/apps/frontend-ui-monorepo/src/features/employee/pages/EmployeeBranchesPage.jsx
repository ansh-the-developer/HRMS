// src/features/employee/pages/EmployeeBranchesPage.jsx
import { useState } from "react";
import { Box, Heading, Text, Input, SimpleGrid } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import DepartmentListItem from "@/components/atomic/molecules/DepartmentListItem";
import { EMPLOYEE_FILTER_TYPES } from "@shared/employeeFilters";
import HRMSInput from './../../../components/atomic/atoms/HRMSInput';

const EmployeeBranchesPage = () => {
  const navigate = useNavigate();

  const [branchName, setBranchName] = useState("");
  const [siteName, setSiteName] = useState("");

  const [branches, setBranches] = useState([
    { name: "Gurugram", membersLabel: "55 Members" },
    { name: "New Delhi", membersLabel: "53 Members" },
    { name: "Mumbai", membersLabel: "52 Members" },
    { name: "Banglore", membersLabel: "52 Members" },
    { name: "Chennai", membersLabel: "55 Members" },
  ]);

  const [sites, setSites] = useState([
    { name: "Samsung Noida", membersLabel: "552 Members" },
    { name: "Hyundai Kefico", membersLabel: "332 Members" },
    { name: "Lotte", membersLabel: "234 Members" },
    { name: "Hyundai Pune", membersLabel: "236 Members" },
    { name: "Samsung Display", membersLabel: "348 Members" },
  ]);

  /* ---------------- Handlers ---------------- */

  const addBranch = () => {
    if (!branchName.trim()) return;
    setBranches((prev) => [
      ...prev,
      { name: branchName, membersLabel: "0 Members" },
    ]);
    setBranchName("");
  };

  const addSite = () => {
    if (!siteName.trim()) return;
    setSites((prev) => [
      ...prev,
      { name: siteName, membersLabel: "0 Members" },
    ]);
    setSiteName("");
  };

  const viewFilteredEmployees = (type, value) => {
    navigate("/employees", {
      state: {
        filterType: type,
        filterValue: value,
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Heading size="md" mb={1}>
          Locations/Branches
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={6}>
          Manage physical office locations. .
        </Text>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={12}>
          {/* -------- Branch Column -------- */}
          <Box>
            <Heading size="sm" mb={4}>
              Branch
            </Heading>

            <HRMSInput
              placeholder="Branch Name"
              h="56px"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
            />

            <Box mt={4} display="flex" justifyContent="flex-end">
              <HRMSButton
                w={{ base: "100%", sm: "202px" }}
                h="50px"
                borderRadius="10px"
                px="20px"
                gap="10px"
                onClick={addBranch}
              >
                Add
              </HRMSButton>
            </Box>

            <Box
              mt={8}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.100"
            >
              {branches.map((b) => (
                <DepartmentListItem
                  key={b.name}
                  name={b.name}
                  membersLabel={b.membersLabel}
                  onView={() =>
                    viewFilteredEmployees(EMPLOYEE_FILTER_TYPES.BRANCH, b.name)
                  }
                />
              ))}
            </Box>
          </Box>

          {/* -------- Site Column -------- */}
          <Box>
            <Heading size="sm" mb={4}>
              Site
            </Heading>

            <HRMSInput
              placeholder="Site Name"
              h="56px"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />

            <Box mt={4} display="flex" justifyContent="flex-end">
              <HRMSButton
                w={{ base: "100%", sm: "202px" }}
                h="50px"
                borderRadius="10px"
                px="20px"
                gap="10px"
                onClick={addSite}
              >
                Add
              </HRMSButton>
            </Box>

            <Box
              mt={8}
              bg="white"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="gray.100"
            >
              {sites.map((s) => (
                <DepartmentListItem
                  key={s.name}
                  name={s.name}
                  membersLabel={s.membersLabel}
                  onView={() =>
                    viewFilteredEmployees(EMPLOYEE_FILTER_TYPES.SITE, s.name)
                  }
                />
              ))}
            </Box>
          </Box>
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
};

export default EmployeeBranchesPage;
