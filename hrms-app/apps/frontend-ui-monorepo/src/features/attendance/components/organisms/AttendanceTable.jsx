import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import AttendanceTableRow from "./AttendanceTableRow";

const columns = [
  "Employee Name",
  "Designation",
  "Location",
  "Check In Time",
  "Status",
];

const AttendanceTable = ({ data }) => {
  return (
    <HRMSTable columns={columns}>
      {data.map((row) => (
        <AttendanceTableRow key={row.id} row={row} />
      ))}
    </HRMSTable>
  );
};

export default AttendanceTable;
