import React, { useState } from "react";
import {
  Box, Button, Image, Text, Grid, VStack,
  Heading, FormControl, FormLabel, Input,
  InputGroup, InputRightElement, IconButton,
  Alert, AlertIcon, Divider,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import buildingImage from "../../../assets/loginPagePic.jpg";
import Logo from "../../../components/atomic/atoms/Logo";
import { useAuth } from "@/hooks/useAuth"; // ✅ NEW

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn, isLoading } = useAuth(); // ✅ NEW

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await signIn(email, password);

      // ── Check if MFA is required ──────────────────
      if (data?.session?.user?.factors?.length > 0) {
        // User has TOTP enrolled → go to MFA verify page
        navigate("/verify-mfa", {
          state: {
            factorId: data.session.user.factors[0].id,
          },
        });
        return;
      }

      // ── No MFA → go straight to home ─────────────
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
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
      <Box as="section" p={10} w={{ base: "100%", md: "auto" }}>
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
              <Text fontSize="sm" color="gray.600">Welcome Back!</Text>
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

            {/* ── Error Alert ── */}
            {error && (
              <Alert status="error" borderRadius="lg" fontSize="sm">
                <AlertIcon />
                {error}
              </Alert>
            )}

            {/* ── Form ── */}
            <form onSubmit={handleLogin}>
              <VStack spacing={4} align="stretch">
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

                <FormControl isRequired>
                  <FormLabel fontSize="sm">Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Enter your password"
                      size="lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                    <InputRightElement h="full">
                      <IconButton
                        icon={showPass ? <FiEyeOff /> : <FiEye />}
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPass(!showPass)}
                        aria-label="Toggle password"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                {/* Forgot Password */}
                <Box textAlign="right">
                  <Text
                    fontSize="sm"
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </Text>
                </Box>

                {/* Sign In Button */}
                <Button
                  type="submit"
                  size="lg"
                  w="100%"
                  mt={2}
                  bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                  color="white"
                  _hover={{ bgGradient: "linear(to-r, #276AAB, #A9A7A5)", opacity: 0.9 }}
                  isLoading={loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </VStack>
        </Grid>
      </Box>

      {/* Right Section - Image */}
      <Box as="section" display={{ base: "none", md: "block" }}>
        <Image src={buildingImage} height="100%" width="100%" objectFit="cover" />
      </Box>
    </Grid>
  );
};

export default LoginPage;