// src/components/atomic/molecules/HRMSTable.jsx
import { Box, Table, TableContainer } from "@chakra-ui/react";

const HRMSTable = ({ children }) => (
  <Box
    bg="transparent"        // no outer card border
    borderRadius="0"
    boxShadow="none"
  >
    <TableContainer maxH="440px" overflowY="auto">
      <Table size="sm" variant="unstyled">
        {children}
      </Table>
    </TableContainer>
  </Box>
);

export default HRMSTable;
