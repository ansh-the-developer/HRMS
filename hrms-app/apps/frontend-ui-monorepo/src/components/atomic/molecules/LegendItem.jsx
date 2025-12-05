import { HStack, Text } from "@chakra-ui/react";
import StatusDot from "@/components/atomic/atoms/StatusDot";

const LegendItem = ({ label, color }) => (
  <HStack spacing={2}>
    <StatusDot color={color} />
    <Text fontSize="xs" color="gray.600">
      {label}
    </Text>
  </HStack>
);

export default LegendItem;
