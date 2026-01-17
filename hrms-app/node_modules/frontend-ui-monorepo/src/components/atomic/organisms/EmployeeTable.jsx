// src/components/atomic/organisms/EmployeeTable.jsx
import { Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import EmployeeTableRow from "@/components/atomic/molecules/EmployeeTableRow";

/* ✅ UNIQUE MOCK DATA (NO DUPLICATE KEYS) */
const mockEmployees = [
  { id: "EMP001", name: "Jaydeep", department: "HR", designation: "HR Manager", location: "Gurugram", status: "Permanent", avatar: "" },
  { id: "EMP002", name: "Yudhvir", department: "Design", designation: "Graphic Designer", location: "Office", status: "Contract", avatar: "" },
  { id: "EMP003", name: "Vaishali", department: "Management", designation: "Project Manager", location: "Office", status: "Intern", avatar: "" },
  { id: "EMP004", name: "Debjoyti", department: "Accounts", designation: "Accountant", location: "Office", status: "Permanent", avatar: "" },
  { id: "EMP005", name: "Aman", department: "Engineering", designation: "Frontend Developer", location: "Remote", status: "Permanent", avatar: "" },
  { id: "EMP006", name: "Neha", department: "Engineering", designation: "Backend Developer", location: "Remote", status: "Permanent", avatar: "" },
  { id: "EMP007", name: "Rohit", department: "Engineering", designation: "QA Engineer", location: "Office", status: "Contract", avatar: "" },
  { id: "EMP008", name: "Pooja", department: "Marketing", designation: "SEO Specialist", location: "Office", status: "Permanent", avatar: "" },
  { id: "EMP009", name: "Kunal", department: "Marketing", designation: "Content Writer", location: "Remote", status: "Intern", avatar: "" },
  { id: "EMP010", name: "Sneha", department: "Sales", designation: "Sales Executive", location: "Office", status: "Permanent", avatar: "" },
  { id: "EMP011", name: "Arjun", department: "Sales", designation: "Sales Manager", location: "Office", status: "Permanent", avatar: "" },
  { id: "EMP012", name: "Megha", department: "HR", designation: "HR Executive", location: "Office", status: "Contract", avatar: "" },
  { id: "EMP013", name: "Sahil", department: "Engineering", designation: "DevOps Engineer", location: "Remote", status: "Permanent", avatar: "" },
  { id: "EMP014", name: "Anjali", department: "Design", designation: "UI Designer", location: "Remote", status: "Permanent", avatar: "" },
  { id: "EMP015", name: "Vikas", department: "Support", designation: "Support Engineer", location: "Office", status: "Permanent", avatar: "" },
  { id: "EMP016", name: "Nitin", department: "Support", designation: "Customer Support", location: "Office", status: "Contract", avatar: "" },
  { id: "EMP017", name: "Riya", department: "Product", designation: "Product Analyst", location: "Remote", status: "Permanent", avatar: "" },
  { id: "EMP018", name: "Manish", department: "Product", designation: "Product Manager", location: "Office", status: "Permanent", avatar: "" },
  { id: "EMP019", name: "Isha", department: "Finance", designation: "Finance Analyst", location: "Office", status: "Intern", avatar: "" },
  { id: "EMP020", name: "Tarun", department: "Finance", designation: "Finance Manager", location: "Office", status: "Permanent", avatar: "" },
];

const columns = [
  "Employee Name",
  "Employee ID",
  "Department",
  "Designation",
  "Location",
  "Status",
  "Action",
];

const EmployeeTable = () => {
  return (
    <HRMSTable>
      {/* TABLE HEADER */}
      <Thead>
        <Tr borderBottomWidth="1px" borderColor="gray.200">
          {columns.map((col, index) => (
            <Th
              key={col}
              position="sticky"
              top={0}
              zIndex={index === 0 ? 4 : 3}
              bg="white"
              fontSize="xs"
              color="gray.500"
              whiteSpace="nowrap"
              textTransform="none"
              {...(index === 0 && { left: 0 })}
            >
              {col}
            </Th>
          ))}
        </Tr>
      </Thead>

      {/* TABLE BODY */}
      <Tbody>
        {mockEmployees.map((employee) => (
          <EmployeeTableRow
            key={employee.id} //  UNIQUE
            employee={employee}
          />
        ))}
      </Tbody>
    </HRMSTable>
  );
};

export default EmployeeTable;
