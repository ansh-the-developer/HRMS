// src/components/atomic/molecules/HRMSTable.jsx
import { Box, Table } from "@chakra-ui/react";

const HRMSTable = ({ children }) => {
  return (
    <Box
      width="100%"
      maxH="440px"          //  vertical scroll here
      overflowY="auto"      //  MUST be here
      overflowX="auto"
    >
      <Table
        size="sm"
        variant="unstyled"
        minW="900px"
      >
        {children}
      </Table>
    </Box>
  );
};

export default HRMSTable;
