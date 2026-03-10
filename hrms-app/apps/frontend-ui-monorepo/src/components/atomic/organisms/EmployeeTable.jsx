// src/components/atomic/organisms/EmployeeTable.jsx
import { Box, Thead, Tbody, Tr, Th } from "@chakra-ui/react";
import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import EmployeeTableRow from "@/components/atomic/molecules/EmployeeTableRow";
import { useToast } from "@chakra-ui/react";
import { deleteEmployee } from "@/services/employeeApi";
import { HiUserGroup } from "react-icons/hi";

const columns = [
  "Employee Name",
  "Employee ID",
  "Department",
  "Designation",
  "Location",
  "Status",
  "Action",
];

const EmployeeTable = ({
  employees = [],
  filterType,
  filterValue,
  refetchEmployees,
}) => {
  const toast = useToast();

  const handleDelete = async (employeeId) => {
    if (!confirm(`Delete employee ${employeeId}?`)) return;

    try {
      await deleteEmployee(employeeId);
      await refetchEmployees();
      toast({
        title: "Employee deleted",
        description: "Employee record removed successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Filter locally if no server filter
  const filteredEmployees =
    filterType && !filterValue
      ? employees
      : employees.filter((emp) => {
          if (filterType === "department" && filterValue) {
            return emp.department
              ?.toLowerCase()
              .includes(filterValue.toLowerCase());
          }
          return true;
        });

  return (
    <Box
      bg="white"
      borderRadius="xl"
      shadow="sm"
      borderWidth="1px"
      overflow="hidden"
    >
      <HRMSTable>
        {/* TABLE HEADER */}
        <Thead>
          <Tr borderBottomWidth="2px" borderColor="gray.200">
            {columns.map((col, index) => (
              <Th
                key={col}
                position="sticky"
                top={0}
                zIndex={index === 0 ? 4 : 3}
                bg="white"
                fontSize="xs"
                color="gray.600"
                fontWeight="medium"
                whiteSpace="nowrap"
                textTransform="none"
                py={4}
                {...(index === 0 && { left: 0 })}
              >
                {col}
              </Th>
            ))}
          </Tr>
        </Thead>

        {/* TABLE BODY */}
        <Tbody>
          {filteredEmployees.length === 0 ? (
            <Tr>
              <Td colSpan={columns.length} py={12} textAlign="center">
                <VStack spacing={2} color="gray.500">
                  <Icon as={HiUserGroup} w={12} h={12} opacity={0.5} />
                  <Text fontSize="sm">No employees found</Text>
                  {filterValue && (
                    <Text fontSize="xs">{filterValue} returned no results</Text>
                  )}
                </VStack>
              </Td>
            </Tr>
          ) : (
            filteredEmployees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={{
                  ...employee,
                  // Map Supabase data to mock shape
                  id: employee.id,
                  name: employee.name,
                  department: employee.department || "N/A",
                  designation: employee.designation || "N/A",
                  location: "Office", // Mock for now
                  status: "Permanent", // Mock for now
                  avatar: "",
                }}
                // Force action buttons
                onEdit={() => console.log("Edit", employee.id)}
                onDelete={() => handleDelete(employee.id)}
              />
            ))
          )}
        </Tbody>
      </HRMSTable>
    </Box>
  );
};

export default EmployeeTable;
