import React, { useState } from "react";
import {
  Box, Table, Thead, Tbody, Tr, Th, Td,
  Avatar, Text, HStack, Badge, IconButton,
  VStack, Spinner, Button,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import DeleteEmployeeModal from "@/features/employee/components/DeleteEmployeeModal";

const AVATAR_COLORS = [
  ["purple.100", "purple.700"],
  ["blue.100",   "blue.700"],
  ["green.100",  "green.700"],
  ["orange.100", "orange.700"],
  ["pink.100",   "pink.700"],
  ["teal.100",   "teal.700"],
  ["cyan.100",   "cyan.700"],
  ["red.100",    "red.700"],
  ["yellow.100", "yellow.700"],
];

const getAvatarColors = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const getEmpId = (id = "") => `#${id.slice(0, 8).toUpperCase()}`;

const ColHeader = ({ children }) => (
  <Th
    fontSize="2xs" color="gray.400" fontWeight="semibold"
    textTransform="uppercase" letterSpacing="wider"
    py={4} borderColor="gray.100"
  >
    {children}
  </Th>
);

const EmployeeTable = ({ employees = [], isLoading, error, refetchEmployees, onEdit, onRowClick }) => { // ✅ added onRowClick
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (isLoading) {
    return (
      <Box bg="white" borderRadius="2xl" p={16} textAlign="center" boxShadow="sm">
        <Spinner size="lg" color="purple.500" thickness="3px" />
        <Text mt={3} color="gray.400" fontSize="sm">Loading employees...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="white" borderRadius="2xl" p={12} textAlign="center" boxShadow="sm">
        <Text color="red.500" fontSize="sm">Error: {error.message}</Text>
      </Box>
    );
  }

  return (
    <>
      <Box bg="white" borderRadius="2xl" boxShadow="sm" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr borderBottom="1px solid" borderColor="gray.100">
                <ColHeader>EMP ID</ColHeader>
                <ColHeader>Official Identity</ColHeader>
                <ColHeader>Department</ColHeader>
                <ColHeader>Type</ColHeader>
                <ColHeader>Modify</ColHeader>
                <ColHeader>Delete</ColHeader>
              </Tr>
            </Thead>

            <Tbody>
              {employees.length === 0 ? (
                <Tr>
                  <Td colSpan={6} py={16} textAlign="center" borderColor="transparent">
                    <VStack spacing={2} color="gray.400">
                      <Text fontSize="sm">No employees found</Text>
                    </VStack>
                  </Td>
                </Tr>
              ) : (
                employees.map((emp) => {
                  const [bgColor, textColor] = getAvatarColors(emp.name);
                  return (
                    <Tr
                      key={emp.id}
                      borderBottom="1px solid" borderColor="gray.50"
                      _hover={{ bg: "purple.50" }}             // ✅ purple tint on hover
                      transition="background 0.15s"
                      cursor="pointer"                          // ✅ pointer cursor
                      onClick={() => onRowClick?.(emp)}         // ✅ row click → profile
                    >
                      {/* EMP ID */}
                      <Td py={4} borderColor="gray.50">
                        <Text fontSize="sm" color="gray.500" fontWeight="medium" fontFamily="mono">
                          {getEmpId(emp.id)}
                        </Text>
                      </Td>

                      {/* Official Identity */}
                      <Td py={4} borderColor="gray.50" minW="220px">
                        <HStack spacing={3}>
                          <Avatar
                            size="sm" name={emp.name}
                            bg={bgColor} color={textColor}
                            fontWeight="bold" fontSize="xs"
                          />
                          <VStack spacing={0} align="start">
                            <Text fontSize="sm" fontWeight="semibold" color="gray.800" noOfLines={1}>
                              {emp.name}
                            </Text>
                            <Text fontSize="xs" color="gray.400">
                              {emp.email || "—"}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>

                      {/* Department */}
                      <Td py={4} borderColor="gray.50">
                        <Text fontSize="sm" color="gray.600">{emp.department || "—"}</Text>
                      </Td>

                      {/* Designation badge */}
                      <Td py={4} borderColor="gray.50">
                        <Badge
                          fontSize="2xs" fontWeight="bold" letterSpacing="wider"
                          textTransform="uppercase" colorScheme="purple"
                          variant="subtle" borderRadius="full" px={3} py={1}
                        >
                          {emp.designation || "—"}
                        </Badge>
                      </Td>

                      {/* Modify — stop propagation so row click doesn't fire */}
                      <Td py={4} borderColor="gray.50">
                        <Button
                          size="sm" variant="ghost"
                          leftIcon={<FiEdit2 size={13} />}
                          color="orange.400" fontWeight="semibold" fontSize="sm"
                          _hover={{ bg: "orange.50" }}
                          onClick={(e) => { e.stopPropagation(); onEdit(emp); }} // ✅ stopPropagation
                        >
                          Modify File
                        </Button>
                      </Td>

                      {/* Delete — stop propagation so row click doesn't fire */}
                      <Td py={4} borderColor="gray.50">
                        <IconButton
                          icon={<FiTrash2 size={15} />}
                          size="sm" variant="ghost"
                          color="red.400"
                          _hover={{ bg: "red.50" }}
                          aria-label="Delete employee"
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(emp); }} // ✅ stopPropagation
                        />
                      </Td>
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* ── Secure Delete Modal ── */}
      <DeleteEmployeeModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        employee={deleteTarget}
      />
    </>
  );
};

export default EmployeeTable;