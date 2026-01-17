import { Tr, Td, Text } from "@chakra-ui/react";
import EmployeeAvatarName from "../molecules/EmployeeAvatarName";
import AttendanceStatusBadge from "../molecules/AttendanceStatusBadge";

const AttendanceTableRow = ({ row }) => {
  return (
    <Tr borderBottomWidth="1px" borderColor="gray.100">
      {/* ✅ Sticky first column */}
      <Td
        position="sticky"
        left={0}
        bg="white"
        zIndex={1}
        whiteSpace="nowrap"
      >
        <EmployeeAvatarName
          name={row.name}
          avatar={row.avatar}
        />
      </Td>

      <Td whiteSpace="nowrap">
        <Text fontSize="sm">{row.designation}</Text>
      </Td>

      <Td whiteSpace="nowrap">
        <Text fontSize="sm">{row.location}</Text>
      </Td>

      <Td whiteSpace="nowrap">
        <Text fontSize="sm">{row.checkIn}</Text>
      </Td>

      <Td whiteSpace="nowrap">
        <AttendanceStatusBadge status={row.status} />
      </Td>
    </Tr>
  );
};

export default AttendanceTableRow;
