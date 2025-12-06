// src/components/atomic/molecules/EmployeeTableRow.jsx
import {
  Tr,
  Td,
  HStack,
  Avatar,
  Text,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const statusColor = {
  Permanent: "purple",
  Contract: "orange",
  Intern: "blue",
};

const EmployeeTableRow = ({ employee }) => {
  return (
   <Tr
    borderBottomWidth="1px"
    borderColor="gray.100"
    _last={{ borderBottomWidth: 0 }}
  >
      <Td>
        <HStack spacing={3}>
          <Avatar size="sm" name={employee.name} src={employee.avatar} />
          <Text fontSize="sm" fontWeight="medium">
            {employee.name}
          </Text>
        </HStack>
      </Td>
      <Td>{employee.id}</Td>
      <Td>{employee.department}</Td>
      <Td>{employee.designation}</Td>
      <Td>{employee.location}</Td>
      <Td>
        <Badge
          variant="subtle"
          colorScheme={statusColor[employee.status] || "gray"}
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
        >
          {employee.status}
        </Badge>
      </Td>
      <Td>
        <HStack spacing={1} justify="flex-end">
          <IconButton
            aria-label="View"
            icon={<FiEye />}
            size="xs"
            variant="ghost"
          />
          <IconButton
            aria-label="Edit"
            icon={<FiEdit2 />}
            size="xs"
            variant="ghost"
          />
          <IconButton
            aria-label="Delete"
            icon={<FiTrash2 />}
            size="xs"
            variant="ghost"
          />
        </HStack>
      </Td>
    </Tr>
  );
};

export default EmployeeTableRow;
