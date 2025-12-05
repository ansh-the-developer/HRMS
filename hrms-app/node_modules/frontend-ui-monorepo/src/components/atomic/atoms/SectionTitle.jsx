import { Heading } from "@chakra-ui/react";

const SectionTitle = ({ children }) => (
  <Heading as="h2" size="md" mb={4}>
    {children}
  </Heading>
);

export default SectionTitle;
