import { Flex, Text, Box } from "@chakra-ui/react";

const InfoRow = ({ left, right, status = "upcoming" }) => {
  const color = status === "upcoming" ? "#7152F3" : "gray.300";

  return (
    <Flex
      align="center"
      py={2}
      borderBottomWidth="1px"
      borderColor="gray.100"
      _last={{ borderBottomWidth: 0 }}
    >
      {/* Vertical status bar */}
      <Box
        w="3px"
        h="24px"
        borderRadius="full"
        bg={color}
        mr={3}
      />

      {/* Date + name */}
      <Flex justify="space-between" align="center" flex="1">
        <Text fontSize="sm" color="blue.600" textDecor="underline">
          {left}
        </Text>
        <Text fontSize="sm" color="gray.700">
          {right}
        </Text>
      </Flex>
    </Flex>
  );
};

export default InfoRow;
