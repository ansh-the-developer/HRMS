// src/components/atomic/organisms/EmployeeTable.jsx
import { Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import EmployeeTableRow from "@/components/atomic/molecules/EmployeeTableRow";

/* ✅ TEMP MOCK DATA (safe & explicit) */
const mockEmployees = [
  {
    id: "EMP001",
    name: "Jaydeep",
    department: "Human Resources",
    designation: "HR Manager",
    location: "Gurugram",
    status: "Permanent",
    avatar: "",
  },
  {
    id: "EMP002",
    name: "Yudhvir",
    department: "Design",
    designation: "Graphic Designer",
    location: "Office",
    status: "Contract",
    avatar: "",
  },
  {
    id: "EMP003",
    name: "Vaishali",
    department: "Management",
    designation: "Project Manager",
    location: "Office",
    status: "Intern",
    avatar: "",
  },
  {
    id: "EMP004",
    name: "Debjoyti",
    department: "Accounts",
    designation: "Accountant",
    location: "Office",
    status: "Permanent",
    avatar: "",
  },
];

const EmployeeTable = () => {
  return (
    <HRMSTable>
      {/* HEADER */}
      <Thead>
        <Tr borderBottomWidth="1px" borderColor="gray.200">
          {[
            "Employee Name",
            "Employee ID",
            "Department",
            "Designation",
            "Location",
            "Status",
            "Action",
          ].map((col) => (
            <Th
              key={col}
              fontSize="xs"
              color="gray.500"
              whiteSpace="nowrap"
              textTransform="none"
            >
              {col}
            </Th>
          ))}
        </Tr>
      </Thead>

      {/* BODY */}
      <Tbody>
        {mockEmployees.map((employee) => (
          <EmployeeTableRow
            key={employee.id}
            employee={employee}
          />
        ))}
      </Tbody>
    </HRMSTable>
  );
};

export default EmployeeTable;
