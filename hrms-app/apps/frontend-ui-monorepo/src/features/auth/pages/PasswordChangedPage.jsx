import React from "react";
import {
  Box,
  Button,
  Image,
  Input,
  Text,
  Link,
  Checkbox,
  Grid,
  VStack,
  HStack,
  Heading,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import passSucImg from "../../../assets/passSucImg.png";
import Logo from "../../../components/atomic/atoms/Logo";
import successIcon from "../../../assets/successIcon.png";

const PasswordChangedPage = () => {
  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
      h="100vh"
      w="100vw"
    >
      {/* Left Section - Login Form */}
      <Box as="section" p={10} w={{ base: "100%", md: "auto" }}>
        <Grid
          h="100%"
          templateRows="auto 1fr"
          gap={8}
          alignContent="center"
          maxW="400px"
          mx="auto"
        >
          {/* Logo */}
          <Logo />

          {/* Form Content */}
          <VStack mt={10} spacing={8} align="stretch">
            {/* Form Fields */}
            <Box>
              <Image
                justifySelf="center"
                src={successIcon}
                h="35vh"
                fit="cover"
              />
            </Box>

            <Heading
              bgGradient="linear(to-r, #307DC5, #BDBBB9)"
              bgClip="text"
              as="h1"
              size="lg"
              mb={2}
              textAlign="center"
            >
              Congratulations
            </Heading>

            <Text textAlign="center">
              You have successfully changed your password.
            </Text>

            {/* Sign In Button */}
            <Button
              size="lg"
              w="100%"
              mt={4}
              bgGradient="linear(to-r, #307DC5, #BDBBB9)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, #276AAB, #A9A7A5)",
                opacity: 0.9,
              }}
            >
              Back To Login
            </Button>
          </VStack>
        </Grid>
      </Box>

      {/* Right Section - Image */}
      <Box as="section" display={{ base: "none", md: "block" }}>
        <Image src={passSucImg} height="100%" width="100%" objectFit="cover" />
      </Box>
    </Grid>
  );
};

export default PasswordChangedPage;
