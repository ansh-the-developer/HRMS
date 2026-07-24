import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Link,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/profileApi";
import { Logo, HRMSButton, HRMSInput } from "@/components/atomic/atoms";
import RainGlassEffect from "@/components/ui/RainGlassEffect";
import { designTokens } from "@/theme/designTokens";

const LoginPage = () => {
  const { signIn, getMFALevel, listMFAFactors } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1️⃣ Sign in
      const { user } = await signIn(email, password);

      // 2️⃣ Fetch profile row — null-safe
      let profile = null;
      try {
        profile = await getProfile(user.id);
      } catch (err) {
        console.warn("⚠️ no profile row found:", err.message);
      }


      // 3️⃣ No profile OR first-login flag → force password change
      if (!profile || profile.must_change_password) {
        navigate("/change-password", { replace: true });
        return;
      }

      // 4️⃣ Check MFA assurance level
      const { currentLevel, nextLevel } = await getMFALevel();

      // 4a. Session already at aal2 → straight to app
      if (currentLevel === "aal2") {
        navigate("/home", { replace: true });
        return;
      }

      // 4b. MFA required → check if enrolled
      if (nextLevel === "aal2") {
        const factors = await listMFAFactors();
        const totpFactor = factors?.totp?.[0];

        if (totpFactor) {
          // Enrolled but not verified this session → verify
          navigate("/verify-mfa", {
            replace: true,
            state: { factorId: totpFactor.id },
          });
        } else {
          // Never enrolled → force enrolment
          navigate("/enroll-mfa", { replace: true });
        }
        return;
      }

      // 4c. No MFA requirement → go home
      navigate("/home", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      {/* Premium Background Layer (Aurora gradient shapes) */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-2}
        bg="app-bg"
        overflow="hidden"
        pointerEvents="none"
      >
        {designTokens.enableBackgroundOverlay && (
          <>
            <Box
              position="absolute"
              top="-20%"
              left="-10%"
              w="55%"
              h="60%"
              bgGradient={useColorModeValue(
                "radial(circle, rgba(79, 70, 229, 0.06) 0%, rgba(79, 70, 229, 0) 70%)",
                "radial(circle, rgba(99, 102, 241, 0.12) 0%, rgba(99, 102, 241, 0) 75%)"
              )}
              filter="blur(90px)"
            />
            <Box
              position="absolute"
              bottom="-15%"
              right="-10%"
              w="60%"
              h="65%"
              bgGradient={useColorModeValue(
                "radial(circle, rgba(147, 51, 234, 0.04) 0%, rgba(147, 51, 234, 0) 70%)",
                "radial(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0) 75%)"
              )}
              filter="blur(110px)"
            />
          </>
        )}
      </Box>

      {/* Subtle Rain droplets */}
      <RainGlassEffect />

      {/* Main card box container */}
      <Box
        bg="card-bg"
        p={8}
        borderRadius={designTokens.borderRadiusCard}
        boxShadow={designTokens.cardShadow}
        border="1px solid"
        borderColor="border-color"
        w="full"
        maxW="420px"
        mx={4}
        zIndex={1}
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Logo />
            <Heading size="md" mt={4}>
              Welcome back
            </Heading>
            <Text fontSize="sm" color="text-secondary" mt={1}>
              Sign in to your HRMS account
            </Text>
          </VStack>

          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel fontSize="sm">Email</FormLabel>
                <HRMSInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Password</FormLabel>
                <InputGroup>
                  <HRMSInput
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <InputRightElement h="44px">
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showPw ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Box w="full" textAlign="right">
                <Link
                  as={RouterLink}
                  to="/forgot-password"
                  fontSize="sm"
                  color="brand.500"
                  fontWeight="500"
                >
                  Forgot password?
                </Link>
              </Box>

              <HRMSButton
                type="submit"
                w="full"
                isLoading={isLoading}
                loadingText="Signing in…"
              >
                Sign In
              </HRMSButton>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
