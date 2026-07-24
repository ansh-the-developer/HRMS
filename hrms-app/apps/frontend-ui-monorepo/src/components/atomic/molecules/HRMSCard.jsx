import { Box, useColorModeValue } from "@chakra-ui/react";
import { designTokens } from "@/theme/designTokens";

const HRMSCard = ({ children, ...props }) => {
  const boxShadow = useColorModeValue(
    designTokens.glassShadowLight,
    designTokens.glassShadowDark
  );

  return (
    <Box
      bg="card-bg"
      backdropFilter={`blur(${designTokens.glassBlur})`}
      borderRadius={designTokens.borderRadiusCard}
      boxShadow={boxShadow}
      border="1px solid"
      borderColor="border-color"
      p={6}
      transition="transform 0.25s ease, box-shadow 0.25s ease"
      {...props}
    >
      {children}
    </Box>
  );
};

export default HRMSCard;
