// src/features/attendance/components/molecules/AttendanceStatusBadge.jsx
import { Box, Text } from "@chakra-ui/react";

const STATUS_STYLES = {
  present: {
    bg: "#E8F8F0",
    color: "#10B981",
    label: "PRESENT"
  },
  absent: {
    bg: "#FFF3E0",
    color: "#F59E0B",
    label: "ABSENT"
  },
  "off day": {
    bg: "#F3E8FF",
    color: "#8B5CF6",
    label: "OFF DAY"
  },
  "on leave": {
    bg: "#EEF2F6",
    color: "#6366F1",
    label: "ON LEAVE"
  }
};

const AttendanceStatusBadge = ({ status }) => {
  const normStatus = (status || "").toLowerCase();
  const styles = STATUS_STYLES[normStatus] || STATUS_STYLES.present;

  return (
    <Box
      px={3}
      py={1}
      borderRadius="md"
      bg={styles.bg}
      width="fit-content"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      fontWeight="600"
      fontSize="2xs"
      letterSpacing="wide"
    >
      <Text fontSize="10px" color={styles.color}>
        {styles.label}
      </Text>
    </Box>
  );
};

export default AttendanceStatusBadge;
