// src/features/attendance/components/organisms/AttendanceConfigCard.jsx
import { Box, VStack, HStack, Text } from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";

const CONFIG_ITEMS = [
  {
    title: "Standard / Custom Working Days",
    description:
      "Select working days of the week (e.g., Monday–Friday, Monday–Saturday).",
    action: "Edit",
  },
  {
    title: "Standard / Custom Working Hours",
    description:
      "Define start and end times for the workday (e.g., 9:00 AM – 6:00 PM).",
    action: "Edit",
  },
  {
    title: "Define Rules",
    description:
      "For grace period, half-day, overtime & minimum working hours.",
    action: "Edit",
  },
  {
    title: "Manual Attendance",
    description:
      "Full-time, Part-time, Contract, Intern, Terminated, On Leave.",
    action: "Edit",
  },
  {
    title: "Export",
    description: "Export attendance reports",
    action: "Export",
  },
];

const AttendanceConfigCard = () => {
  return (
    <HRMSCard p={6}>
      <VStack spacing={6} align="stretch">
        {CONFIG_ITEMS.map((item) => (
          <HStack
            key={item.title}
            justify="space-between"
            align="flex-start"
          >
            <Box>
              <Text fontWeight="500">{item.title}</Text>
              <Text fontSize="sm" color="gray.500">
                {item.description}
              </Text>
            </Box>

            <HRMSButton size="sm">
              {item.action}
            </HRMSButton>
          </HStack>
        ))}
      </VStack>
    </HRMSCard>
  );
};

export default AttendanceConfigCard;
