import { Box, Text, VStack, HStack, Radio, RadioGroup } from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import WeekdaySelector from "../molecules/WeekdaySelector";

const WorkingDaysForm = ({
  mode,
  onModeChange,
  selectedDays,
  onToggleDay,
}) => {
  return (
    <HRMSCard>
      <VStack align="stretch" spacing={5}>
        <Text fontSize="lg" fontWeight="semibold">
          Working Days
        </Text>

        <RadioGroup value={mode} onChange={onModeChange}>
          <HStack spacing={6}>
            <Radio value="standard">Standard</Radio>
            <Radio value="custom">Custom</Radio>
          </HStack>
        </RadioGroup>

        <WeekdaySelector
          selectedDays={selectedDays}
          onToggleDay={onToggleDay}
          isDisabled={mode === "standard"}
        />
      </VStack>
    </HRMSCard>
  );
};

export default WorkingDaysForm;
