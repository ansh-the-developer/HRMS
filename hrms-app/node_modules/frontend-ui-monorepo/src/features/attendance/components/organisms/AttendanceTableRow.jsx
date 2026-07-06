// src/features/attendance/components/organisms/AttendanceTableRow.jsx
import { Tr, Td, Text, HStack, Avatar, VStack, Box } from "@chakra-ui/react";
import AttendanceStatusBadge from "../molecules/AttendanceStatusBadge";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const AVATAR_COLORS = [
  ["#F3E8FF", "#8B5CF6"],
  ["#DBEAFE", "#2563EB"],
  ["#D1FAE5", "#059669"],
  ["#FEF3C7", "#D97706"],
  ["#FCE7F3", "#DB2777"],
  ["#E0F2FE", "#0284C7"],
  ["#E0F2F1", "#00897B"]
];

const getAvatarColors = (name = "") => {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const AttendanceTableRow = ({ row, employee, onAction, onRowClick }) => {
  if (!employee) return null;

  const [avatarBg, avatarColor] = getAvatarColors(employee.name);
  const isOffDay = row.status === "Off Day";

  return (
    <Tr
      borderBottomWidth="1px"
      borderColor="gray.100"
      _hover={{ bg: "gray.50" }}
      transition="background 0.15s"
      cursor="pointer"
      onClick={() => onRowClick?.(employee)}
    >
      {/* EMP ID */}
      <Td whiteSpace="nowrap" py={3}>
        <Text fontSize="sm" color="gray.500" fontWeight="600" fontFamily="mono">
          {employee.emp_code ? `#${employee.emp_code}` : `#${employee.id.slice(0, 8)}`}
        </Text>
      </Td>

      {/* EMPLOYEE (Avatar, Name, Email) */}
      <Td py={3}>
        <HStack spacing={3}>
          <Avatar
            size="sm"
            name={employee.name}
            bg={avatarBg}
            color={avatarColor}
            fontWeight="bold"
            fontSize="xs"
          />
          <VStack spacing={0} align="start">
            <Text fontSize="sm" fontWeight="700" color="#1E293B">
              {employee.name}
            </Text>
            <Text fontSize="xs" color="gray.400">
              {employee.email}
            </Text>
          </VStack>
        </HStack>
      </Td>

      {/* DEPARTMENT */}
      <Td whiteSpace="nowrap" py={3}>
        <Text fontSize="sm" color="gray.600">
          {employee.department || "—"}
        </Text>
      </Td>

      {/* LOCATION */}
      <Td whiteSpace="nowrap" py={3}>
        <Text fontSize="sm" color="gray.600">
          {employee.work_location || "—"}
        </Text>
      </Td>

      {/* IN TIME */}
      <Td whiteSpace="nowrap" py={3}>
        <Text fontSize="sm" color="gray.600" fontWeight="500">
          {row.in_time || "--:--"}
        </Text>
      </Td>

      {/* OUT TIME */}
      <Td whiteSpace="nowrap" py={3}>
        <Text fontSize="sm" color="gray.600" fontWeight="500">
          {row.out_time || "--:--"}
        </Text>
      </Td>

      {/* STATUS */}
      <Td whiteSpace="nowrap" py={3} onClick={(e) => e.stopPropagation()}>
        <AttendanceStatusBadge status={row.status} />
      </Td>

      {/* ACTIONS */}
      <Td whiteSpace="nowrap" py={3} onClick={(e) => e.stopPropagation()}>
        <HRMSButton
          size="xs"
          bg={isOffDay ? "#4F46E5" : "#4F46E5"} // matches blue/purple
          color="white"
          borderRadius="md"
          px={3}
          py={1.5}
          fontSize="11px"
          fontWeight="700"
          _hover={{ bg: "#4338CA" }}
          onClick={() => onAction(row.emp_id, isOffDay ? "remove_off" : "mark_off")}
        >
          {isOffDay ? "Remove Off" : "Mark Off"}
        </HRMSButton>
      </Td>
    </Tr>
  );
};

export default AttendanceTableRow;
