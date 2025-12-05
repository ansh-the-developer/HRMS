import { Text, VStack } from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";

const NoticeBoardCard = () => {
  return (
    <HRMSCard>
      <SectionTitle>Notice Board</SectionTitle>
      <VStack align="start" spacing={2}>
        <Text fontSize="sm" color="gray.700">
          We’re thrilled to welcome Sandeep to the HR team!
        </Text>
        <Text fontSize="sm" color="gray.700">
          Sandeep is joining us as an HR intern and will be a valuable asset.
        </Text>
      </VStack>
    </HRMSCard>
  );
};

export default NoticeBoardCard;
