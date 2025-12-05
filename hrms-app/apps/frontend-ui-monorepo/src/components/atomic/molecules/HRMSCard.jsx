import { Box, useColorModeValue } from "@chakra-ui/react";

const HRMSCard = ({ children, ...props }) => {
  const bg = useColorModeValue("white", "gray.800");
  return (
    <Box
      bg={bg}
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      p={6}
      {...props}
    >
      {children}
    </Box>
  );
};

export default HRMSCard;
