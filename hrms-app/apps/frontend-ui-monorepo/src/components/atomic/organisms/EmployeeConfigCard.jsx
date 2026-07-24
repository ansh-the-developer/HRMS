// src/components/atomic/organisms/EmployeeConfigCard.jsx
import { Box } from "@chakra-ui/react";
import EmployeeConfigItem from "@/components/atomic/molecules/EmployeeConfigItem";

const EmployeeConfigCard = () => (
  <Box
    mt={8}
    bg="card-bg"
    borderRadius="lg"
    boxShadow="sm"
    borderWidth="1px"
    borderColor="border-color"
    p={4}
  >
    <EmployeeConfigItem
      title="Departments / Teams"
      description="Add, edit, delete departments/teams."
      to="/employees/departments"
    />

    <EmployeeConfigItem
      title="Locations/Branches"
      description="Manage physical office locations."
      to="/employees/branches"
    />

    <EmployeeConfigItem
      title="Job Titles / Positions"
      description="Define standard job titles."
      to="/employees/designations"
    />

    <EmployeeConfigItem
      title="Employment Statuses"
      description="Full-time, Part-time, Contract, Intern, etc."
      to="/employees/statuses"
    />

    <EmployeeConfigItem
      title="Employee Types"
      description="e.g., Salaried, Hourly."
      to="/employees/types"
    />

    <EmployeeConfigItem
      title="Export"
      description="Export list of employees."
      buttonLabel="Go"
      to="/employees/export"
    />
  </Box>
);

export default EmployeeConfigCard;
