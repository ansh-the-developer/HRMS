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
    <Tr borderBottomWidth="1px" borderColor="gray.100">
      {/* Sticky Employee Name */}
      <Td
        position="sticky"
        left={0}
        bg="white"
        zIndex={1}
        minW="200px"
      >
        <HStack spacing={3}>
          <Avatar size="sm" name={employee.name} src={employee.avatar} />
          <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
            {employee.name}
          </Text>
        </HStack>
      </Td>

      <Td whiteSpace="nowrap">{employee.id}</Td>
      <Td whiteSpace="nowrap">{employee.department}</Td>
      <Td whiteSpace="nowrap">{employee.designation}</Td>
      <Td whiteSpace="nowrap">{employee.location}</Td>

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

      {/* ✅ Action column – SAME on mobile & desktop */}
      <Td whiteSpace="nowrap">
        <HStack spacing={2}>
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
