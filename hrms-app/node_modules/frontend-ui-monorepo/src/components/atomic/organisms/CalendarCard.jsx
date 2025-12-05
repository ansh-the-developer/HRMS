import { Box, Flex, IconButton, Text, SimpleGrid, Button } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";

const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const CalendarCard = ({ minH }) => {
  return (
    <HRMSCard minH={minH}>
      <Flex justify="space-between" align="center" mb={4}>
        <SectionTitle>Calendar</SectionTitle>
        <IconButton
          aria-label="Open full calendar"
          icon={<FiCalendar />}
          size="sm"
          variant="ghost"
        />
      </Flex>

      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold">July, 2025</Text>
        <Flex gap={2}>
          <IconButton aria-label="Previous month" icon={<FiChevronLeft />} size="sm" variant="outline" />
          <IconButton aria-label="Next month" icon={<FiChevronRight />} size="sm" variant="outline" />
        </Flex>
      </Flex>

      <SimpleGrid columns={7} spacing={1} mb={2}>
        {days.map((d) => (
          <Text key={d} fontSize="xs" textAlign="center" color="gray.500">
            {d}
          </Text>
        ))}
      </SimpleGrid>

      {/* Very simple static grid for now */}
      <SimpleGrid columns={7} spacing={1}>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <Button
            key={d}
            size="xs"
            variant={d === 8 ? "solid" : "ghost"}
            colorScheme={d === 8 ? "purple" : "gray"}
            borderRadius="full"
          >
            {d}
          </Button>
        ))}
      </SimpleGrid>
    </HRMSCard>
  );
};

export default CalendarCard;
