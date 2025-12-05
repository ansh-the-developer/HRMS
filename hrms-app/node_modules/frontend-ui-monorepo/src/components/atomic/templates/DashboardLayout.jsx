import { Box, Flex } from "@chakra-ui/react";
import HRMSSidebar from "@/components/atomic/organisms/HRMSSidebar";
import TopBar from "@/components/atomic/organisms/TopBar";

const DashboardLayout = ({ children }) => {
  return (
    <Flex>
      {/* Fixed sidebar */}
      <HRMSSidebar />

      {/* Right side: header + content */}
      <Box ml="260px" w="100%" minH="100vh" bg="white">
        <TopBar />
        <Box as="main" px={{ base: 4, md: 8 }} py={6}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
