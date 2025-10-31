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
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
const ResetPasswordPage = () => {
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
          <Box justifySelf="center">
            <Image src={companyLogo} w="18.375em" h="6.5rem" />
          </Box>

          {/* Form Content */}
          <VStack spacing={8} align="stretch">
            {/* Welcome Text */}
            <Box>
              <Text fontSize="sm" color="gray.600">
                Password recovery.
              </Text>

              <Heading
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                bgClip="text"
                as="h1"
                size="lg"
                mb={2}
              >
                Password reset
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Kindly enter a new password.
              </Text>
            </Box>

            {/* Form Fields */}
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input placeholder="Enter password" />
                  <InputRightElement>
                    <IconButton icon={<FiEyeOff />} size="sm" variant="ghost" />
                  </InputRightElement>
                </InputGroup>{" "}
              </FormControl>

              <FormControl>
                <FormLabel>Confirm new password</FormLabel>
                <InputGroup>
                  <Input placeholder="Enter password" />
                  <InputRightElement>
                    <IconButton icon={<FiEyeOff />} size="sm" variant="ghost" />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

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
                Reset
              </Button>
            </VStack>
          </VStack>
        </Grid>
      </Box>

      {/* Right Section - Image */}
      <Box as="section" display={{ base: "none", md: "block" }}>
        <Image
          src={passwordForgotImage}
          height="100%"
          width="100%"
          objectFit="cover"
        />
      </Box>
    </Grid>
  );
};

export default ResetPasswordPage;
