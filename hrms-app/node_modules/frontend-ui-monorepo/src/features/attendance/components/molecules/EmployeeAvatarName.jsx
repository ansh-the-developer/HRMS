import { HStack, Avatar, Text, Box } from "@chakra-ui/react";

const EmployeeAvatarName = ({ name, avatar }) => {
  return (
    <HStack spacing={3}>
      <Avatar size="sm" name={name} src={avatar} />
      <Box>
        <Text fontSize="sm" fontWeight="500" color="text-primary">
          {name}
        </Text>
      </Box>
    </HStack>
  );
};

export default EmployeeAvatarName;
