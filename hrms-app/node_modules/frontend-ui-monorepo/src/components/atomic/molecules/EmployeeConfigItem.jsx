// src/components/atomic/molecules/EmployeeConfigItem.jsx
import { Flex, Box, Text } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const EmployeeConfigItem = ({ title, description, buttonLabel = "Edit" }) => (
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
    <HRMSButton
      minW="80px"
      h="32px"
      fontSize="sm"
      borderRadius="md"
    >
      {buttonLabel}
    </HRMSButton>
  </Flex>
);

export default EmployeeConfigItem;
