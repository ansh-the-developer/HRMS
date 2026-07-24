/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  Text,
  HStack,
  Badge,
  IconButton,
  VStack,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import DeleteEmployeeModal from "@/features/employee/components/DeleteEmployeeModal";

const AVATAR_COLORS = [
  ["purple.100", "purple.700"],
  ["blue.100", "blue.700"],
  ["green.100", "green.700"],
  ["orange.100", "orange.700"],
  ["pink.100", "pink.700"],
  ["teal.100", "teal.700"],
  ["cyan.100", "cyan.700"],
  ["red.100", "red.700"],
  ["yellow.100", "yellow.700"],
];

const getAvatarColors = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const getFormattedEmpId = (emp) => {
  const code = emp.emp_code || emp.id?.slice(0, 8);
  if (!code) return "—";
  return code.startsWith("#") ? code : `#${code}`;
};

const ColHeader = ({ children }) => (
  <Th
    fontSize="2xs"
    color="text-muted"
    fontWeight="semibold"
    textTransform="uppercase"
    letterSpacing="wider"
    py={4}
    borderColor="border-color"
  >
    {children}
  </Th>
);

const EmployeeTable = ({
  employees = [],
  isLoading,
  error,
  refetchEmployees,
  onEdit,
  onRowClick,
  isReadOnly = false,
}) => {
  const [deleteTarget, setDeleteTarget] = useState(null);

  if (isLoading) {
    return (
      <Box bg="card-bg" borderRadius="2xl" p={16} textAlign="center" boxShadow="sm">
        <Spinner size="lg" color="purple.500" thickness="3px" />
        <Text mt={3} color="text-muted" fontSize="sm">
          Loading employees...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg="card-bg" borderRadius="2xl" p={12} textAlign="center" boxShadow="sm">
        <Text color="red.500" fontSize="sm">
          Error: {error.message}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box bg="card-bg" borderRadius="2xl" boxShadow="sm" overflow="hidden">
        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr borderBottom="1px solid" borderColor="border-color">
                <ColHeader>EMP ID</ColHeader>
                <ColHeader>Nickname</ColHeader>
                <ColHeader>Official Identity</ColHeader>
                <ColHeader>Department</ColHeader>
                <ColHeader>Location</ColHeader>
                {!isReadOnly && <ColHeader>Actions</ColHeader>}
              </Tr>
            </Thead>

            <Tbody>
              {employees.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={isReadOnly ? 5 : 6}
                    py={16}
                    textAlign="center"
                    borderColor="transparent"
                  >
                    <VStack spacing={2} color="text-muted">
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
                      borderBottom="1px solid"
                      borderColor="border-color"
                      _hover={{ bg: "hover-bg" }}
                      transition="background 0.15s"
                      cursor="pointer"
                      onClick={() => onRowClick?.(emp)}
                    >
                      {/* EMP ID */}
                      <Td py={4} borderColor="border-color">
                        <Text
                          fontSize="sm"
                          color="text-muted"
                          fontWeight="medium"
                          fontFamily="mono"
                        >
                          {getFormattedEmpId(emp)}
                        </Text>
                      </Td>

                      {/* Nickname */}
                      <Td py={4} borderColor="border-color">
                        <Text
                          fontSize="sm"
                          color="text-secondary"
                          fontStyle={emp.nickname ? "italic" : "normal"}
                        >
                          {emp.nickname || "—"}
                        </Text>
                      </Td>

                      {/* Official Identity */}
                      <Td py={4} borderColor="border-color" minW="220px">
                        <HStack spacing={3}>
                          <Avatar
                            size="sm"
                            name={emp.name}
                            bg={bgColor}
                            color={textColor}
                            fontWeight="bold"
                            fontSize="xs"
                          />
                          <VStack spacing={0} align="start">
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="text-primary"
                              noOfLines={1}
                            >
                              {emp.name}
                            </Text>
                            <Text fontSize="xs" color="text-muted">
                              {emp.email || "—"}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>

                      {/* Department */}
                      <Td py={4} borderColor="border-color">
                        <Text fontSize="sm" color="text-secondary">
                          {emp.department || "—"}
                        </Text>
                      </Td>

                      {/* Location */}
                      <Td py={4} borderColor="border-color">
                        <Text fontSize="sm" color="text-secondary">
                          {emp.work_location || "—"}
                        </Text>
                      </Td>

                      {/* Actions */}
                      {!isReadOnly && (
                        <Td py={4} borderColor="border-color">
                          <HStack spacing={2} onClick={(e) => e.stopPropagation()}>
                            <IconButton
                              icon={<FiEdit2 size={13} />}
                              size="sm"
                              variant="ghost"
                              color="accent"
                              _hover={{ bg: "hover-bg" }}
                              aria-label="Edit employee"
                              onClick={() => onEdit?.(emp)}
                            />
                            <IconButton
                              icon={<FiTrash2 size={13} />}
                              size="sm"
                              bg="rgba(239, 68, 68, 0.12)"
                              color="red.400"
                              _hover={{ bg: "rgba(239, 68, 68, 0.25)" }}
                              borderRadius="full"
                              aria-label="Delete employee"
                              onClick={() => setDeleteTarget(emp)}
                            />
                          </HStack>
                        </Td>
                      )}
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>

      {!isReadOnly && (
        <DeleteEmployeeModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          employee={deleteTarget}
        />
      )}
    </>
  );
};

export default EmployeeTable;