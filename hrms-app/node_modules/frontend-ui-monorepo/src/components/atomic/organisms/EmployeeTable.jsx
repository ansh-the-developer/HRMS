// src/components/atomic/organisms/EmployeeTable.jsx
import { useMemo } from "react";
import { Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import HRMSTable from "../molecules/HRMSTable";
import EmployeeTableRow from "../molecules/EmployeeTableRow";

// Static list of employees shown in the table
const mockEmployees = [
  {
    name: "Jaydeep",
    id: "009918765",
    department: "Human Resources",
    team: "Aman’s Team",                 // ✅
    designation: "HR Manager",
    location: "Gurugram",
    status: "Permanent",
    avatar: "",
  },
  {
    name: "Yudhvir",
    id: "124355111",
    department: "Design",
    team: "Rahul’s Team",               // ✅
    designation: "Graphic Designer",
    location: "Office",
    status: "Contract",
    avatar: "",
  },
  {
    name: "Vaishali",
    id: "435540099",
    department: "Management",
    team: "Yashoda’s Team",             // ✅
    designation: "Project Manager",
    location: "Office",
    status: "Intern",
    avatar: "",
  },
  {
    name: "Debjoyti",
    id: "009812890",
    department: "Accounts",
    team: "Ravi’s Team",                // ✅
    designation: "Accountant",
    location: "Office",
    status: "Permanent",
    avatar: "",
  },
  {
    name: "Deepak",
    id: "671190345",
    department: "Procurement",
    team: "Mohit’s Team",               // ✅
    designation: "Procurement Officer",
    location: "Office",
    status: "Permanent",
    avatar: "",
  },
  {
    name: "Prince",
    id: "091233412",
    department: "Marketing",
    team: "Rahul’s Team",               // ✅
    designation: "Brand Manager",
    location: "Remote",
    status: "Permanent",
    avatar: "",
  },
];


// Accept filter props from EmployeeListPage
const EmployeeTable = ({ filterType, filterValue }) => {
  // Decide which employees to show based on incoming filter
   const visibleEmployees = useMemo(() => {
    if (!filterType || !filterValue) return mockEmployees;

    // ✅ generic filtering for department, team, status, etc.
    return mockEmployees.filter(
      (emp) =>
        emp[filterType]?.toLowerCase() === filterValue.toLowerCase()
    );
  }, [filterType, filterValue]);
  return (
    <HRMSTable>
      <Thead>
        <Tr borderBottomWidth="1px" borderColor="gray.100">
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
              fontFamily="'Lexend', system-ui, -apple-system, BlinkMacSystemFont"
              fontWeight="300"
              fontSize="15.09px"
              lineHeight="22.64px"
              letterSpacing="0"
              color="#A2A1A8"
              borderBottom="none"
              textTransform="none"
            >
              {col}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {visibleEmployees.map((emp) => (
          <EmployeeTableRow key={emp.id} employee={emp} />
        ))}
      </Tbody>
    </HRMSTable>
  );
};

export default EmployeeTable;
