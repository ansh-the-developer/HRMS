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
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import authImage from "../../../assets/authImage.jpg";
import companyLogo from "../../../assets/hankukLogo.png";


const TwoFactorPage = () => {
 
  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
      h="100vh"
      w="100vw"
    >
      {/* Left Section - otp input*/}
      <Box as="section" p={10} w={{ base: "100%", md: "auto" }}>
        <Grid
          h="100%"
          templateRows="auto 1fr"
          gap={"10rem"}
          alignContent="center"
          maxW="400px"
          mx="auto"
        >
          {/* Logo */}
          <Box justifySelf="center">
            <Image src={companyLogo} w="18.375em" h="6.5rem" />
          </Box>

          {/* Form Content */}
          <VStack spacing={8} align="stretch">
            <Box textAlign="center">
              <Heading
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                bgClip="text"
                as="h1"
                size="lg"
                mb={2}
              >
                Please enter the 2FA code sent to your mail.
              </Heading>
            </Box>

            {/* Form Fields */}
            <VStack spacing={4} align="stretch">
              <HStack  display="flex" justifyContent="space-between">
                <PinInput  placeholder='' otp autoComplete="off">
                  <PinInputField border='1px solid darkgrey'  />
                  <PinInputField border='1px solid darkgrey' />
                  <PinInputField border='1px solid darkgrey' />
                  <PinInputField border='1px solid darkgrey' />
                  <PinInputField border='1px solid darkgrey' />
                </PinInput>
              </HStack>

              {/* Sign In Button */}
              <Button
                size="lg"
                w="100%"
                mt={{ base: 20, md: 4 }}
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #276AAB, #A9A7A5)",
                  opacity: 0.9,
                }}
              >
                Verify
              </Button>
            </VStack>
          </VStack>
        </Grid>
      </Box>

      {/* Right Section - Image */}
      <Box as="section" display={{ base: "none", md: "block" }}>
        <Image src={authImage} height="100%" width="100%" objectFit="cover" />
      </Box>
    </Grid>
  );
};

export default TwoFactorPage;
