import { HStack, Button } from "@chakra-ui/react";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WeekdaySelector = ({
  selectedDays = [],
  onToggleDay,
  isDisabled = false,
}) => {
  return (
    <HStack wrap="wrap" spacing={2}>
      {WEEKDAYS.map((day) => {
        const isActive = selectedDays.includes(day);

        return (
          <Button
            key={day}
            size="sm"
            variant={isActive ? "solid" : "outline"}
            colorScheme={isActive ? "purple" : "gray"}
            onClick={() => onToggleDay(day)}
            isDisabled={isDisabled}
          >
            {day.slice(0, 3)}
          </Button>
        );
      })}
    </HStack>
  );
};

export default WeekdaySelector;
