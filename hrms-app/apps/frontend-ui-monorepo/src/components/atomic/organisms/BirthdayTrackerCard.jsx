import { VStack, Flex } from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import BirthdayListItem from "@/components/atomic/molecules/BirthdayListItem";

const birthdays = [
  { name: "Jaydeep", role: "HR Executive", date: "15/03/1989" },
  { name: "Kwanjin Choi", role: "Managing Director", date: "13/08/1996" },
  { name: "Taein Choi", role: "Director", date: "07/10/1990" },
];

const BirthdayTrackerCard = ({ minH }) => (
  <HRMSCard minH={minH} h="100%">
    <Flex direction="column" h="100%">
      <SectionTitle>Birthday Tracker 🎂</SectionTitle>
      <VStack align="stretch" spacing={2} mt={2} flex="1">
        {birthdays.map((b) => (
          <BirthdayListItem key={b.name} {...b} />
        ))}
      </VStack>
    </Flex>
  </HRMSCard>
);

export default BirthdayTrackerCard;
