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
  if (!employee) return null; // 🔒 prevents runtime crash

  return (
    <Tr
      borderBottomWidth="1px"
      borderColor="border-color"
      _hover={{ bg: "hover-bg" }}
      transition="background 0.15s"
    >
      {/* Sticky Employee Name */}
      <Td
        position="sticky"
        left={0}
        bg="inherit"
        zIndex={1}
        minW="200px"
      >
        <HStack spacing={3}>
          <Avatar size="sm" name={employee.name} src={employee.avatar} />
          <Text fontSize="sm" fontWeight="medium" color="text-primary" noOfLines={1}>
            {employee.name}
          </Text>
        </HStack>
      </Td>

      <Td whiteSpace="nowrap" color="text-secondary">{employee.id}</Td>
      <Td whiteSpace="nowrap" color="text-secondary">{employee.department}</Td>
      <Td whiteSpace="nowrap" color="text-secondary">{employee.designation}</Td>
      <Td whiteSpace="nowrap" color="text-secondary">{employee.location}</Td>

      <Td whiteSpace="nowrap">
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

      {/* Action column */}
      <Td whiteSpace="nowrap">
        <HStack spacing={2}>
          <IconButton aria-label="View" icon={<FiEye />} size="xs" variant="ghost" />
          <IconButton aria-label="Edit" icon={<FiEdit2 />} size="xs" variant="ghost" />
          <IconButton aria-label="Delete" icon={<FiTrash2 />} size="xs" variant="ghost" />
        </HStack>
      </Td>
    </Tr>
  );
};

export default EmployeeTableRow;
