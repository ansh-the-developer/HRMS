import { Flex, Box, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const AttendanceConfigItem = ({
  title,
  description,
  buttonLabel = "Edit",
  to,
}) => {
  const navigate = useNavigate();

  return (
    <Flex
      align="center"
      justify="space-between"
      py={3}
      _notLast={{ borderBottomWidth: "1px", borderColor: "gray.100" }}
    >
      <Box>
        <Text fontSize="sm" fontWeight="semibold">
          {title}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {description}
        </Text>
      </Box>

      {/* Let Chakra handle sizing naturally */}
      <HRMSButton
        size="sm"        // Chakra sm size works
        onClick={() => navigate(to)}
        minW="80px"     // ← smaller minW
      >
        {buttonLabel}
      </HRMSButton>
    </Flex>
  );
};

export default AttendanceConfigItem;
