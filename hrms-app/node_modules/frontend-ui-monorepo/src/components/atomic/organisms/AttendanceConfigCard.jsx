import { Box } from "@chakra-ui/react";
import AttendanceConfigItem from "@/components/atomic/molecules/AttendanceConfigItem";
const AttendanceConfigCard = () => {
  return (
    <Box
      bg="card-bg"
      borderRadius="lg"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="border-color"
      p={4}
    >
      <AttendanceConfigItem
        title="Standard / Custom Working Days"
        description="Select working days of the week (e.g., Monday–Friday, Monday–Saturday)."
        to="/attendance/working-days"
        buttonLabel="Edit"  // ← CHANGE "Export" to "Edit"
      />

      <AttendanceConfigItem
        title="Standard / Custom Working Hours"
        description="Define start and end times for the workday (e.g., 9:00 AM – 6:00 PM)."
        to="/attendance/working-hours"
        buttonLabel="Edit"  // ← CHANGE "Export" to "Edit"
      />

      <AttendanceConfigItem
        title="Define Rules"
        description="For grace period, half-day, overtime & minimum working hours."
        to="/attendance/working-rules"
        buttonLabel="Edit"  // ← CHANGE "Export" to "Edit"
      />

      <AttendanceConfigItem
        title="Manual Attendance"
        description="Manage manual attendance entries."
        to="/attendance/edit"
        buttonLabel="Edit"  // ← CHANGE "Export" to "Edit"
      />

      <AttendanceConfigItem
        title="Export"
        description="Export attendance reports."
        buttonLabel="Export"
        to="/attendance/export"
      />
    </Box>
  );
};


export default AttendanceConfigCard;
