import { HStack, VStack, Text } from "@chakra-ui/react";
import EmployeeAvatar from "@/components/atomic/atoms/EmployeeAvatar";

const BirthdayListItem = ({ name, role, date, avatarUrl, birthdate }) => (
  <HStack spacing={3} py={2} borderBottom="1px solid" borderColor="border-color" _last={{ borderBottom: "none" }}>
    <EmployeeAvatar name={name} src={avatarUrl} birthdate={birthdate} size="sm" />

    {/* Name + date on the left */}
    <VStack align="start" spacing={0} flex="1" minW={0}>
      <Text fontSize="sm" fontWeight="600" color="text-primary" noOfLines={1}>
        {name}
      </Text>
      <Text fontSize="xs" color="text-muted">
        {date}
      </Text>
    </VStack>

    {/* Role on the right */}
    <Text fontSize="xs" color="text-muted" fontWeight="500" noOfLines={1}>
      {role}
    </Text>
  </HStack>
);

export default BirthdayListItem;
