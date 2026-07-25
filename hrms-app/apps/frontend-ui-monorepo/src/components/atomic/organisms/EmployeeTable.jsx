import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  HStack,
  IconButton,
  VStack,
  Spinner,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Switch,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";
import DeleteEmployeeModal from "@/features/employee/components/DeleteEmployeeModal";
import EmployeeAvatar from "@/components/atomic/atoms/EmployeeAvatar";

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
  const [showAlias, setShowAlias] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [locFilter, setLocFilter] = useState("");

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (emp.nickname && emp.nickname.toLowerCase().includes(q)) ||
        (emp.email && emp.email.toLowerCase().includes(q)) ||
        (emp.emp_code && emp.emp_code.toLowerCase().includes(q));

      const matchDept =
        !deptFilter ||
        (emp.department && emp.department.toLowerCase().includes(deptFilter.toLowerCase().trim()));

      const matchLoc =
        !locFilter ||
        (emp.work_location && emp.work_location.toLowerCase().includes(locFilter.toLowerCase().trim()));

      return matchSearch && matchDept && matchLoc;
    });
  }, [employees, searchTerm, deptFilter, locFilter]);

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
        {/* Table Filter Controls Header */}
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          gap={3}
          p={4}
          borderBottom="1px solid"
          borderColor="border-color"
          bg="app-bg-secondary"
        >
          <HStack spacing={3} flex={1} wrap="wrap">
            <InputGroup size="sm" maxW="240px">
              <InputLeftElement pointerEvents="none" color="text-muted">
                <FiSearch size={14} />
              </InputLeftElement>
              <Input
                placeholder="Search name, ID, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="xl"
                bg="card-bg"
                borderColor="border-color"
              />
            </InputGroup>

            <Input
              size="sm"
              maxW="160px"
              placeholder="Filter Dept..."
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              borderRadius="xl"
              bg="card-bg"
              borderColor="border-color"
            />

            <Input
              size="sm"
              maxW="160px"
              placeholder="Filter Location..."
              value={locFilter}
              onChange={(e) => setLocFilter(e.target.value)}
              borderRadius="xl"
              bg="card-bg"
              borderColor="border-color"
            />
          </HStack>

          {/* Alias Name Toggle Switch */}
          <FormControl display="flex" alignItems="center" w="auto">
            <FormLabel htmlFor="alias-toggle" mb="0" fontSize="xs" color="text-secondary" fontWeight="semibold">
              Show Nickname/Alias
            </FormLabel>
            <Switch
              id="alias-toggle"
              size="sm"
              colorScheme="purple"
              isChecked={showAlias}
              onChange={(e) => setShowAlias(e.target.checked)}
            />
          </FormControl>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
              <Tr borderBottom="1px solid" borderColor="border-color">
                <ColHeader>EMP ID</ColHeader>
                <ColHeader>{showAlias ? "Alias / Nickname" : "Official Name"}</ColHeader>
                <ColHeader>Department</ColHeader>
                <ColHeader>Location</ColHeader>
                {!isReadOnly && <ColHeader>Actions</ColHeader>}
              </Tr>
            </Thead>

            <Tbody>
              {filteredEmployees.length === 0 ? (
                <Tr>
                  <Td
                    colSpan={isReadOnly ? 4 : 5}
                    py={16}
                    textAlign="center"
                    borderColor="transparent"
                  >
                    <VStack spacing={2} color="text-muted">
                      <Text fontSize="sm">No matching employees found</Text>
                    </VStack>
                  </Td>
                </Tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const displayName = showAlias ? (emp.nickname || emp.name) : emp.name;

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

                      {/* Name / Alias + Avatar */}
                      <Td py={4} borderColor="border-color" minW="220px">
                        <HStack spacing={3}>
                          <EmployeeAvatar
                            size="sm"
                            employee={emp}
                            name={emp.name}
                            src={emp.avatar_url || emp.profile_picture}
                            birthdate={emp.birthdate}
                          />
                          <VStack spacing={0} align="start">
                            <Text
                              fontSize="sm"
                              fontWeight="semibold"
                              color="text-primary"
                              noOfLines={1}
                            >
                              {displayName}
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