import { Box, Flex, Button, HStack } from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import InfoRow from "@/components/atomic/molecules/InfoRow";
import LegendItem from "@/components/atomic/molecules/LegendItem";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const events = [
  { date: "November 02, 2025", name: "Company Incorporation" },
  { date: "August 14, 2025", name: "Independence Day Decoration" },
  { date: "September 19, 2025", name: "Sample Event" },
];

const CompanyEventsCard = () => {
  return (
    <HRMSCard>
      <Flex justify="space-between" align="center" mb={4}>
        <SectionTitle>Company Events</SectionTitle>
        <HRMSButton withPlusIcon>Add an Event</HRMSButton>{" "}
      </Flex>

      <Box mb={4}>
        {events.map((e) => (
          <InfoRow key={e.date} left={e.date} right={e.name} />
        ))}
      </Box>

      <HStack spacing={4}>
        <LegendItem label="Upcoming" color="purple.500" />
        <LegendItem label="Past Events" color="gray.400" />
      </HStack>
    </HRMSCard>
  );
};

export default CompanyEventsCard;
