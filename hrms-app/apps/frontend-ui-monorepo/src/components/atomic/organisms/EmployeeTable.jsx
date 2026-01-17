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
        maxH="440px"
        overflowY="auto"
    >
      {/* ✅ Sticky first column */}
      <Td
        position="sticky"
        left={0}
        bg="white"
        zIndex={1}
        whiteSpace="nowrap"
      >
        <HStack spacing={3}>
          <Avatar size="sm" name={employee.name} src={employee.avatar} />
          <Text fontSize="sm" fontWeight="medium">
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

      {/* ✅ Hide actions on mobile */}
      <Td
        whiteSpace="nowrap"
        display={{ base: "none", md: "table-cell" }}
      >
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
