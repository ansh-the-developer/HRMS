import { Box, Flex, Button, HStack, Text } from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import InfoRow from "@/components/atomic/molecules/InfoRow";
import LegendItem from "@/components/atomic/molecules/LegendItem";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const holidays = [
  { date: "April 10, 2025", name: "Mahavir Jayanti", status: "past" },
  { date: "August 15, 2025", name: "Independence Day", status: "upcoming" },
  { date: "October 02, 2025", name: "Dussehra", status: "upcoming" },
];
const HolidaysCard = () => {
  return (
    <HRMSCard>
      <Flex justify="space-between" align="center" mb={4}>
        <SectionTitle>Holidays</SectionTitle>
        <HRMSButton withPlusIcon>Add New Holiday</HRMSButton>
      </Flex>

      <Box mb={4}>
        {holidays.map((h) => (
          <InfoRow
            key={h.date}
            left={h.date}
            right={h.name}
            status={h.status}
          />
        ))}
      </Box>
      <HStack spacing={4}>
        <LegendItem label="Upcoming" color="purple.500" />
        <LegendItem label="Past Holidays" color="gray.400" />
      </HStack>
    </HRMSCard>
  );
};

export default HolidaysCard;
