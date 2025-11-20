import React from "react";
import {
  Box,
  Button,
  Image,
  Text,
  Grid,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useAuth0 } from "@auth0/auth0-react";
import buildingImage from "../../../assets/loginPagePic.jpg";
import Logo from "../../../components/atomic/atoms/Logo";

const LoginPage = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

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
          <VStack spacing={8} align="stretch">
            {/* Welcome Text */}
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">
                Welcome Back!{" "}
              </Text>

              <Heading
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                bgClip="text"
                as="h1"
                size="lg"
                mb={2}
              >
                Please Sign In
              </Heading>
            </Box>

            {/* Auth Buttons */}
            <VStack spacing={4} align="stretch">
              {/* Sign In Button */}
              <Button
                size="lg"
                w="100%"
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, #276AAB, #A9A7A5)",
                  opacity: 0.9,
                }}
                onClick={() => loginWithRedirect()}
                isLoading={isLoading}
              >
                Sign In
              </Button>

              {/* Sign Up Button */}
              <Button
                size="lg"
                w="100%"
                variant="outline"
                colorScheme="blue"
                onClick={() => 
                  loginWithRedirect({ 
                    authorizationParams: { screen_hint: 'signup' } 
                  })
                }
                isLoading={isLoading}
              >
                Sign Up
              </Button>
            </VStack>
          </VStack>
        </Grid>
      </Box>

      {/* Right Section - Image */}
      <Box as="section" display={{ base: "none", md: "block" }}>
        <Image
          src={buildingImage}
          height="100%"
          width="100%"
          objectFit="cover"
        />
      </Box>
    </Grid>
  );
};

export default LoginPage;
