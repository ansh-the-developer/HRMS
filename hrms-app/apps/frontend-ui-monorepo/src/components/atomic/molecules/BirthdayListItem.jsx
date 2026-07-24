import { HStack, VStack, Text, Avatar } from "@chakra-ui/react";

const BirthdayListItem = ({ name, role, date, avatarUrl }) => (
  <HStack spacing={4} py={2}>
    <Avatar name={name} src={avatarUrl} size="md" />

    {/* Name + date on the left */}
    <VStack align="start" spacing={0} flex="1">
      <Text fontSize="sm" fontWeight="semibold">
        {name}
      </Text>
      <Text fontSize="xs" color="text-muted">
        {date}
      </Text>
    </VStack>

    {/* Role on the right */}
    <Text fontSize="xs" color="text-muted">
      {role}
    </Text>
  </HStack>
);

export default BirthdayListItem;
