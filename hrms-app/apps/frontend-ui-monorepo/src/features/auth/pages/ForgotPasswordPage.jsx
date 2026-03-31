import React, { useState } from "react";
import {
  Box, Button, Grid, VStack, Heading,
  Text, FormControl, FormLabel, Input,
  Alert, AlertIcon, Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import buildingImage from "../../../assets/loginPagePic.jpg";
import Logo from "../../../components/atomic/atoms/Logo";
import { useAuth } from "@/hooks/useAuth"; // ✅

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
const { forgotPassword: resetPassword } = useAuth(); // destructure alias
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true); // ✅ Show confirmation, don't redirect immediately
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
      h="100vh"
      w="100vw"
    >
      {/* Left Section */}
      <Box as="section" p={10}>
        <Grid
          h="100%"
          templateRows="auto 1fr"
          gap={8}
          alignContent="center"
          maxW="400px"
          mx="auto"
        >
          <Logo />

          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.600">
                Forgot your password?
              </Text>
              <Heading
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                bgClip="text"
                as="h1"
                size="lg"
                mb={2}
              >
                Reset Password
              </Heading>
            </Box>

            {/* ── Success State ── */}
            {success ? (
              <VStack spacing={5} align="stretch">
                <Alert status="success" borderRadius="lg" fontSize="sm">
                  <AlertIcon />
                  Password reset email sent! Check your inbox.
                </Alert>
                <Text fontSize="sm" color="gray.600" textAlign="center">
                  Didn't receive it? Check your spam folder or try again.
                </Text>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  w="100%"
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                >
                  Try Again
                </Button>
                <Button
                  size="lg"
                  w="100%"
                  bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </VStack>
            ) : (
              /* ── Request Form ── */
              <form onSubmit={handleSubmit}>
                <VStack spacing={5} align="stretch">
                  {error && (
                    <Alert status="error" borderRadius="lg" fontSize="sm">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <Text fontSize="sm" color="gray.500">
                    Enter your registered email address. We'll send you a
                    link to reset your password.
                  </Text>

                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Email Address</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      size="lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    size="lg"
                    w="100%"
                    mt={2}
                    bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                    color="white"
                    _hover={{ opacity: 0.9 }}
                    isLoading={loading}
                    loadingText="Sending..."
                  >
                    Send Reset Link
                  </Button>

                  <Button
                    variant="ghost"
                    size="md"
                    w="100%"
                    color="gray.500"
                    onClick={() => navigate("/login")}
                  >
                    ← Back to Login
                  </Button>
                </VStack>
              </form>
            )}
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

export default ForgotPasswordPage;