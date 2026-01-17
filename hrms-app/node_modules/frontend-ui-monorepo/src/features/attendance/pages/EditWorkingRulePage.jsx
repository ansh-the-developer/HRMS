import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { Box, Heading, Text } from "@chakra-ui/react";

const EditWorkingRulePage = () => {
  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Heading size="md" mb={1}>
          EditWorkingRulePage
        </Heading>
        <Text fontSize="sm" color="gray.500">
          EditWorkingRulePage module UI
        </Text>
      </Box>
    </DashboardLayout>
  );
};

export default EditWorkingRulePage;
