import { Box, Table, Thead, Tbody, Tr, Th } from "@chakra-ui/react";

/**
 * HRMSTable
 * - Mobile-first (horizontal scroll)
 * - Desktop-friendly
 * - PWA-safe
 */
const HRMSTable = ({ columns = [], children }) => {
  return (
    <Box
      width="100%"
      overflowX="auto"
      sx={{
        WebkitOverflowScrolling: "touch",

        /* Optional scrollbar styling */
        "&::-webkit-scrollbar": {
          height: "6px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#E2E8F0",
          borderRadius: "4px",
        },
      }}
    >
      <Table
        size="sm"
        variant="unstyled"
        minW="900px" // 🔑 forces scroll on small screens
      >
        {/* HEADER */}
        <Thead>
          <Tr
            borderBottomWidth="1px"
            borderColor="gray.200" // ✅ subtle divider
          >
            {columns.map((col, index) => (
              <Th
                key={col}
                fontSize="xs"
                fontWeight="400"
                color="gray.500"
                whiteSpace="nowrap"
                position={index === 0 ? "sticky" : "static"}
                left={index === 0 ? 0 : "auto"}
                bg="white"
                zIndex={index === 0 ? 2 : 1}
              >
                {col}
              </Th>
            ))}
          </Tr>
        </Thead>

        {/* BODY */}
        <Tbody>{children}</Tbody>
      </Table>
    </Box>
  );
};

export default HRMSTable;
