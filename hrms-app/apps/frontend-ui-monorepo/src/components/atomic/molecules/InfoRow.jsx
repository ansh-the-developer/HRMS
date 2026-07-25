import { Flex, Text, Box } from "@chakra-ui/react";

const InfoRow = ({ left, right, status = "upcoming", description }) => {
  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = left === todayStr;

  let barColor = "accent";
  if (status === "public") barColor = "red.400";
  if (status === "company") barColor = "purple.400";
  if (status === "optional") barColor = "amber.400";

  return (
    <Flex
      align="center"
      py={2.5}
      px={2}
      borderRadius="xl"
      bg={isToday ? "rgba(99, 102, 241, 0.12)" : "transparent"}
      border={isToday ? "1px solid rgba(99, 102, 241, 0.3)" : "none"}
      borderBottomWidth={isToday ? "1px" : "1px"}
      borderColor={isToday ? "rgba(99, 102, 241, 0.3)" : "border-color"}
      _last={{ borderBottomWidth: 0 }}
      transition="all 0.15s ease-in-out"
      _hover={{ bg: "hover-bg" }}
    >
      {/* Vertical status bar */}
      <Box
        w="3.5px"
        h="26px"
        borderRadius="full"
        bg={barColor}
        mr={3}
        flexShrink={0}
      />

      {/* Date + name + description */}
      <Flex justify="space-between" align="center" flex="1" gap={3} minW={0}>
        <Flex align="center" gap={2} minW={0}>
          <Text fontSize="sm" fontWeight="700" color="accent" flexShrink={0}>
            {left}
          </Text>
          <Text fontSize="sm" color="text-primary" fontWeight="600" noOfLines={1}>
            {right}
          </Text>
          {isToday && (
            <Box
              bg="purple.500"
              color="white"
              fontSize="9px"
              fontWeight="bold"
              px={1.5}
              py={0.5}
              borderRadius="md"
              flexShrink={0}
            >
              TODAY
            </Box>
          )}
        </Flex>

        {description && (
          <Text fontSize="xs" color="text-muted" noOfLines={1} maxW="160px">
            {description}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default InfoRow;
