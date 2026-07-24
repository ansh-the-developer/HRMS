import { Input } from "@chakra-ui/react";

const HRMSInput = ({
  h = "44px",
  borderRadius = "12px",
  ...props
}) => {
  return (
    <Input
      h={h}
      borderRadius={borderRadius}
      fontSize="sm"
      bg="card-bg"
      backdropFilter="blur(20px)"
      color="text-primary"
      borderColor="border-color"
      _placeholder={{ color: "text-muted" }}
      _hover={{
        borderColor: "accent",
        bg: "hover-bg",
      }}
      _focus={{
        borderColor: "accent",
        boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
      }}
      transition="all 180ms cubic-bezier(0.16, 1, 0.3, 1)"
      {...props}
    />
  );
};

export default HRMSInput;
