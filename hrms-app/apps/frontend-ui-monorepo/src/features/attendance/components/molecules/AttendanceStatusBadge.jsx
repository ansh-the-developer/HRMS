import { Box, Text } from "@chakra-ui/react";

const STATUS_STYLES = {
  late: {
    bg: "red.50",
    color: "red.400",
  },
  on_time: {
    bg: "green.50",
    color: "green.400",
  },
};

const AttendanceStatusBadge = ({ status }) => {
  const key = status === "Late" ? "late" : "on_time";
  const styles = STATUS_STYLES[key];

  return (
    <Box
      px={3}
      py={1}
      borderRadius="md"
      bg={styles.bg}
      width="fit-content"
    >
      <Text fontSize="xs" color={styles.color}>
        {status}
      </Text>
    </Box>
  );
};

export default AttendanceStatusBadge;
