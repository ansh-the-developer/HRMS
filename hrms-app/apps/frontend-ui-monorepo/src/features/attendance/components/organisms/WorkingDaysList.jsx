import { VStack, Text } from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import WorkingDayItem from "../molecules/WorkingDayItem";

const WorkingDaysList = ({ days = [] }) => {
  return (
    <HRMSCard>
      <VStack align="stretch" spacing={3}>
        <Text fontSize="lg" fontWeight="semibold">
          Selected Working Days
        </Text>

        {days.length === 0 ? (
          <Text fontSize="sm" color="gray.500">
            No working days selected
          </Text>
        ) : (
          days.map((day) => (
            <WorkingDayItem key={day} day={day} />
          ))
        )}
      </VStack>
    </HRMSCard>
  );
};

export default WorkingDaysList;
