// src/components/atomic/organisms/EmployeeConfigCard.jsx
import { Box } from "@chakra-ui/react";
import EmployeeConfigItem from "../molecules/EmployeeConfigItem";

const EmployeeConfigCard = () => (
  <Box
    mt={8}
    bg="white"
    borderRadius="lg"
    boxShadow="sm"
    borderWidth="1px"
    borderColor="gray.100"
    p={4}
  >
    <EmployeeConfigItem
      title="Departments / Teams"
      description="Add, edit, delete departments/teams."
    />
    <EmployeeConfigItem
      title="Locations/Branches"
      description="Manage physical office locations."
    />
    <EmployeeConfigItem
      title="Job Titles/Positions"
      description="Define standard job titles."
    />
    <EmployeeConfigItem
      title="Employment Statuses"
      description="Full-time, Part-time, Contract, Intern, etc."
    />
    <EmployeeConfigItem
      title="Employee Types"
      description="e.g., Salaried, Hourly."
    />
    <EmployeeConfigItem
      title="Export"
      description="Export list of employees."
      buttonLabel="Go"
    />
  </Box>
);

export default EmployeeConfigCard;
