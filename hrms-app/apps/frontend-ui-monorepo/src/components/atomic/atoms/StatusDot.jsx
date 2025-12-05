import { Box } from "@chakra-ui/react";

const StatusDot = ({ color = "purple.500", ...props }) => (
  <Box
    as="span"
    w="8px"
    h="8px"
    borderRadius="full"
    bg={color}
    display="inline-block"
    {...props}
  />
);

export default StatusDot;
