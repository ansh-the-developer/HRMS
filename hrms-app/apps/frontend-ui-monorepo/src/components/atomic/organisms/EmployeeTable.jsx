import { Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import HRMSTable from "../molecules/HRMSTable";
import EmployeeTableRow from "../molecules/EmployeeTableRow";

const mockEmployees = [
  {
    name: "Jaydeep",
    id: "009918765",
    department: "Human Resources",
    designation: "HR Manager",
    location: "Gurugram",
    status: "Permanent",
    avatar: "",
  },
  {
    name: "Yudhvir",
    id: "124355111",
    department: "Design",
    designation: "Graphic Designer",
    location: "Office",
    status: "Contract",
    avatar: "",
  },
  {
    name: "Vaishali",
    id: "435540099",
    department: "Management",
    designation: "Project Manager",
    location: "Office",
    status: "Intern",
    avatar: "",
  },
  {
    name: "Debjoyti",
    id: "009812890",
    department: "Accounts",
    designation: "Accountant",
    location: "Office",
    status: "Permanent",
    avatar: "",
  },
  {
    name: "Deepak",
    id: "671190345",
    department: "Procurement",
    designation: "Procurement Officer",
    location: "Office",
    status: "Permanent",
    avatar: "",
  },
  {
    name: "Prince",
    id: "091233412",
    department: "Marketing",
    designation: "Brand Manager",
    location: "Remote",
    status: "Permanent",
    avatar: "",
  },
];

const EmployeeTable = () => (
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
            textTransform="none" // keep exact casing
          >
            {col}
          </Th>
        ))}
      </Tr>
    </Thead>
    <Tbody>
      {mockEmployees.map((emp) => (
        <EmployeeTableRow key={emp.id} employee={emp} />
      ))}
    </Tbody>
  </HRMSTable>
);
export default EmployeeTable;
