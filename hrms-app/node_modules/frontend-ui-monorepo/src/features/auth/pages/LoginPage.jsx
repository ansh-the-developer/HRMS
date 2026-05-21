import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Link,
  Divider,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { getProfile } from "@/services/profileApi";
import { Logo } from "@/components/atomic/atoms";

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
      bg="gray.50"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        w="full"
        maxW="420px"
        mx={4}
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Logo />
            <Heading size="md" mt={4}>
              Welcome back
            </Heading>
            <Text fontSize="sm" color="gray.500" mt={1}>
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
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize="sm">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <InputRightElement>
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
                  color="purple.600"
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                colorScheme="purple"
                w="full"
                isLoading={isLoading}
                loadingText="Signing in…"
              >
                Sign In
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
