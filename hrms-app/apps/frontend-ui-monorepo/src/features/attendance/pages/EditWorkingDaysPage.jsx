import { useState } from "react";
import { Box, Flex } from "@chakra-ui/react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";

import WorkingDaysForm from "../components/organisms/WorkingDaysForm";
import WorkingDaysList from "../components/organisms/WorkingDaysList";

const DEFAULT_STANDARD_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const EditWorkingDaysPage = () => {
  const [mode, setMode] = useState("standard"); // standard | custom
  const [workingDays, setWorkingDays] = useState(DEFAULT_STANDARD_DAYS);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);

    if (nextMode === "standard") {
      setWorkingDays(DEFAULT_STANDARD_DAYS);
    }
  };

  const handleToggleDay = (day) => {
    setWorkingDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  return (
    <DashboardLayout>
      <Flex gap={6} align="flex-start">
        <Box flex="1">
          <WorkingDaysForm
            mode={mode}
            onModeChange={handleModeChange}
            selectedDays={workingDays}
            onToggleDay={handleToggleDay}
          />
        </Box>

        <Box flex="1">
          <WorkingDaysList days={workingDays} />
        </Box>
      </Flex>
    </DashboardLayout>
  );
};

export default EditWorkingDaysPage;
