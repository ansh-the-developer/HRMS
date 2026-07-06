// src/features/attendance/components/organisms/AttendanceTable.jsx
import React, { useState } from "react";
import { Thead, Tbody, Tr, Th, Box, Flex, Text } from "@chakra-ui/react";
import { FiChevronUp, FiChevronDown, FiActivity } from "react-icons/fi";
import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import AttendanceTableRow from "./AttendanceTableRow";

const AttendanceTable = ({ data = [], employees = [], onAction, onRowClick }) => {
  const [sortKey, setSortKey] = useState("in_time"); // default sorted by in_time from screenshot (descending)
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const getSortedData = () => {
    const items = [...data];
    if (!sortKey) return items;

    return items.sort((a, b) => {
      const empA = employees.find((e) => e.id === a.emp_id) || {};
      const empB = employees.find((e) => e.id === b.emp_id) || {};

      let valA = "";
      let valB = "";

      switch (sortKey) {
        case "emp_id":
          valA = empA.emp_code || a.emp_id;
          valB = empB.emp_code || b.emp_id;
          break;
        case "name":
          valA = empA.name || "";
          valB = empB.name || "";
          break;
        case "department":
          valA = empA.department || "";
          valB = empB.department || "";
          break;
        case "location":
          valA = empA.work_location || "";
          valB = empB.work_location || "";
          break;
        case "in_time":
          valA = a.in_time || "ZZZZ"; // Push empty check-ins to bottom
          valB = b.in_time || "ZZZZ";
          break;
        case "out_time":
          valA = a.out_time || "ZZZZ";
          valB = b.out_time || "ZZZZ";
          break;
        case "status":
          valA = a.status || "";
          valB = b.status || "";
          break;
        default:
          break;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  };

  const sortedData = getSortedData();

  const renderHeader = (label, key, isSortable = true, extraElement = null) => {
    const isCurrent = sortKey === key;
    return (
      <Th
        onClick={isSortable ? () => handleSort(key) : undefined}
        cursor={isSortable ? "pointer" : "default"}
        py={4}
        fontSize="xs"
        fontWeight="700"
        color="gray.400"
        textTransform="uppercase"
        borderColor="gray.100"
        userSelect="none"
      >
        <Flex align="center" gap={1}>
          <Text fontSize="10px" letterSpacing="wider" color="#64748B">
            {label}
          </Text>
          {extraElement}
          {isSortable && (
            <Flex direction="column" align="center" fontSize="8px" color={isCurrent ? "#6366F1" : "gray.300"}>
              {(!isCurrent || sortOrder === "asc") && <FiChevronUp />}
              {(!isCurrent || sortOrder === "desc") && <FiChevronDown />}
            </Flex>
          )}
        </Flex>
      </Th>
    );
  };

  return (
    <Box bg="white" borderRadius="2xl" overflow="hidden" shadow="sm" border="1px solid" borderColor="gray.100" p={2}>
      <HRMSTable>
        <Thead>
          <Tr borderBottomWidth="1.5px" borderColor="gray.100">
            {renderHeader("EMP ID", "emp_id")}
            {renderHeader(
              "EMPLOYEE",
              "name",
              true,
              <Box bg="#EEF2F6" px={1.5} py={0.5} borderRadius="sm" fontSize="8px" fontWeight="800" color="#6366F1" ml={1}>
                NAME
              </Box>
            )}
            {renderHeader("DEPARTMENT", "department")}
            {renderHeader("LOCATION", "location")}
            {renderHeader("IN TIME", "in_time")}
            {renderHeader("OUT TIME", "out_time")}
            {renderHeader("STATUS", "status")}
            {renderHeader("ACTIONS", null, false)}
          </Tr>
        </Thead>
        <Tbody>
          {sortedData.length === 0 ? (
            <Tr>
              <Th colSpan={8} textAlign="center" py={12} color="gray.400" textTransform="none" fontSize="sm">
                No attendance logs found for this filter.
              </Th>
            </Tr>
          ) : (
            sortedData.map((row) => {
              const employee = employees.find((e) => e.id === row.emp_id);
              return (
                <AttendanceTableRow
                  key={row.emp_id}
                  row={row}
                  employee={employee}
                  onAction={onAction}
                  onRowClick={onRowClick}
                />
              );
            })
          )}
        </Tbody>
      </HRMSTable>
    </Box>
  );
};

export default AttendanceTable;
