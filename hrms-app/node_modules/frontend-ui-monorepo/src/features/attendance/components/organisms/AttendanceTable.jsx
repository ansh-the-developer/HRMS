import { Thead, Tbody, Tr, Th } from "@chakra-ui/react";

import HRMSTable from "@/components/atomic/molecules/HRMSTable";
import AttendanceTableRow from "./AttendanceTableRow";

const columns = [
  "Employee Name",
  "Designation",
  "Location",
  "Check In Time",
  "Status",
];

const AttendanceTable = ({ data = [] }) => {
  return (
    <HRMSTable>
      {/* TABLE HEADER */}
      <Thead>
        <Tr borderBottomWidth="1px" borderColor="gray.200">
          {columns.map((col) => (
            <Th
           key={col}
        position="sticky"
        top={0}
        zIndex={3}
        bg="white"
        fontSize="xs"
        color="gray.500"
        whiteSpace="nowrap"
            >
              {col}
            </Th>
          ))}
        </Tr>
      </Thead>

      {/* TABLE BODY */}
      <Tbody>
        {data.map((row) => (
          <AttendanceTableRow key={row.id} row={row} />
        ))}
      </Tbody>
    </HRMSTable>
  );
};

export default AttendanceTable;
