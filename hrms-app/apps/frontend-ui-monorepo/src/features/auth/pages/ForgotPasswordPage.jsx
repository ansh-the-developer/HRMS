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
import passwordForgotImage from "../../../assets/forgetPassword.png";
import companyLogo from "../../../assets/hankukLogo.png";

const ForgotPasswordPage = () => {
  return (
    <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }}>
      <Box as="section" p={10} w={{ base: "100%", md: "auto" }}>
        <Grid
          h="100%"
          templateRows="auto 1fr"
          gap={8}
          alignContent="center"
          maxW="400px"
          mx="auto"
        
        >
          <Box justifySelf="center">
            <Image src={companyLogo} />
          </Box>

          <VStack  spacing={4} align="stretch">
            <Box>
              <Text>Password Recovery</Text>
              <Heading
               bgGradient="linear(to-r, #307DC5, #BDBBB9)"
               bgClip='text'
               >
                Forgot your password?</Heading>
              <Text pt={4}>
                Kindly enter the email address address linked to this account
                and we will send you a code to enable you change your password .
              </Text>
            </Box>

            <FormControl pt={10} >
              <FormLabel>Email address</FormLabel>
              <Input placeholder='Enter email address' size="lg" type="password" />
            </FormControl>

            <Button 
                size="lg"
                w="100%"
                mt={7}
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #276AAB, #A9A7A5)",
                  opacity: 0.9,
                }}

            >
              send
            </Button>
          </VStack>
        </Grid>
      </Box>

      <Box as="section" display={{ base: "none", md: "block" }}>
        <Image h="100vh" src={passwordForgotImage} />
      </Box>
    </Grid>
  );
};

export default ForgotPasswordPage;
