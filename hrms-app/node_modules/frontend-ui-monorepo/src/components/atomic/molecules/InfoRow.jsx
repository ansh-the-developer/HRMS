import { Flex, Text } from "@chakra-ui/react";

const InfoRow = ({ left, right }) => {
  return (
    <Flex
      justify="space-between"
      align="center"
      py={2}
      borderBottomWidth="1px"
      borderColor="gray.100"
      _last={{ borderBottomWidth: 0 }}
    >
      <Text fontSize="sm" color="blue.600" textDecor="underline">
        {left}
      </Text>
      <Text fontSize="sm" color="gray.700">
        {right}
      </Text>
    </Flex>
  );
};

export default InfoRow;
