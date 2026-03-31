import React, { useState, useEffect } from "react";
import {
  Box, Button, Grid, VStack, Heading, Text,
  FormControl, FormLabel, Input, InputGroup,
  InputRightElement, Alert, AlertIcon, Image,
  Progress,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import buildingImage from "../../../assets/loginPagePic.jpg";
import Logo from "../../../components/atomic/atoms/Logo";
import { useAuth } from "@/hooks/useAuth"; // ✅

// ── Simple password strength scorer ──────────────────────────────────────
const getStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8)           score++;
  if (/[A-Z]/.test(pwd))         score++;
  if (/[0-9]/.test(pwd))         score++;
  if (/[^A-Za-z0-9]/.test(pwd))  score++;
  return score; // 0-4
};

const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
const strengthColor = ["", "red.400", "orange.400", "yellow.400", "green.400"];

const ResetPasswordPage = () => {
  const navigate  = useNavigate();
  const { updatePassword } = useAuth(); // ✅

  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass,        setShowPass]        = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");
  const [tokenMissing,    setTokenMissing]    = useState(false);

  const strength = getStrength(password);

  // ── Guard: Supabase injects #access_token into URL on redirect ───────────
  useEffect(() => {
    const hash = window.location.hash;
    // Supabase puts type=recovery in the hash when the reset link is clicked
    if (!hash.includes("type=recovery") && !hash.includes("access_token")) {
      setTokenMissing(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (strength < 2) {
      setError("Password is too weak. Add uppercase letters, numbers, or symbols.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(password); // ✅ Supabase updateUser({ password })
      navigate("/password-changed");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please request a new link.");
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
              <Text fontSize="sm" color="gray.600">Almost there!</Text>
              <Heading
                bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                bgClip="text"
                as="h1"
                size="lg"
                mb={2}
              >
                Set New Password
              </Heading>
            </Box>

            {/* ── Expired / invalid link ── */}
            {tokenMissing ? (
              <VStack spacing={5} align="stretch">
                <Alert status="warning" borderRadius="lg" fontSize="sm">
                  <AlertIcon />
                  This link is invalid or has expired. Please request a new one.
                </Alert>
                <Button
                  size="lg"
                  w="100%"
                  bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  onClick={() => navigate("/forgot-password")}
                >
                  Request New Link
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
            ) : (
              /* ── Reset Form ── */
              <form onSubmit={handleSubmit}>
                <VStack spacing={5} align="stretch">
                  {error && (
                    <Alert status="error" borderRadius="lg" fontSize="sm">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  {/* New Password */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">New Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        size="lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                      />
                      <InputRightElement h="full">
                        <Button
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          onClick={() => setShowPass(!showPass)}
                          tabIndex={-1}
                        >
                          {showPass ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    {/* Strength bar */}
                    {password.length > 0 && (
                      <Box mt={2}>
                        <Progress
                          value={(strength / 4) * 100}
                          size="xs"
                          colorScheme={
                            strength === 1 ? "red"
                            : strength === 2 ? "orange"
                            : strength === 3 ? "yellow"
                            : "green"
                          }
                          borderRadius="full"
                        />
                        <Text
                          fontSize="xs"
                          color={strengthColor[strength]}
                          mt={1}
                        >
                          {strengthLabel[strength]}
                        </Text>
                      </Box>
                    )}
                  </FormControl>

                  {/* Confirm Password */}
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">Confirm Password</FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter new password"
                        size="lg"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        isInvalid={
                          confirmPassword.length > 0 &&
                          confirmPassword !== password
                        }
                      />
                      <InputRightElement h="full">
                        <Button
                          size="xs"
                          variant="ghost"
                          color="gray.500"
                          onClick={() => setShowConfirm(!showConfirm)}
                          tabIndex={-1}
                        >
                          {showConfirm ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>

                    {/* Match feedback */}
                    {confirmPassword.length > 0 && (
                      <Text
                        fontSize="xs"
                        mt={1}
                        color={
                          confirmPassword === password
                            ? "green.500"
                            : "red.400"
                        }
                      >
                        {confirmPassword === password
                          ? "✓ Passwords match"
                          : "✗ Passwords do not match"}
                      </Text>
                    )}
                  </FormControl>

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="lg"
                    w="100%"
                    mt={2}
                    bgGradient="linear(to-r, #307DC5, #BDBBB9)"
                    color="white"
                    _hover={{ opacity: 0.9 }}
                    isLoading={loading}
                    loadingText="Updating..."
                    isDisabled={
                      !password ||
                      !confirmPassword ||
                      password !== confirmPassword
                    }
                  >
                    Update Password
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

export default ResetPasswordPage;