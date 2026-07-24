import { Flex, Text } from "@chakra-ui/react";

const WorkingDayItem = ({ day }) => {
  return (
    <Flex
      px={4}
      py={2}
      borderRadius="md"
      borderWidth="1px"
      borderColor="border-color"
    >
      <Text fontSize="sm">{day}</Text>
    </Flex>
  );
};

export default WorkingDayItem;
