import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  HStack,
  Divider,
  Spinner,
  Center,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { FiShield } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/atomic/atoms";

const TwoFactorPage = () => {
  const { challengeMFA, verifyMFA } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const factorId = location.state?.factorId;

  const [challengeId, setChallengeId]     = useState(null);
  const [code, setCode]                   = useState("");
  const [error, setError]                 = useState("");
  const [isVerifying, setIsVerifying]     = useState(false);
  const [isChallenging, setIsChallenging] = useState(true);

  // Guard: no factorId means user navigated here directly → send back to login
  useEffect(() => {
    if (!factorId) {
      navigate("/login", { replace: true });
      return;
    }
    const createChallenge = async () => {
      try {
        const challenge = await challengeMFA(factorId);
        setChallengeId(challenge.id);
      } catch (err) {
        setError(err.message || "Failed to start verification. Please log in again.");
      } finally {
        setIsChallenging(false);
      }
    };
    createChallenge();
  }, [factorId]);

  const handleVerify = async () => {
    if (code.length !== 6 || !challengeId) return;
    setIsVerifying(true);
    setError("");
    try {
      await verifyMFA(factorId, challengeId, code);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(`Invalid code. Please check your authenticator app and try again. ${err}`);
      setCode("");
      // Refresh challenge so user can retry
      try {
        const newChallenge = await challengeMFA(factorId);
        setChallengeId(newChallenge.id);
      } catch (challengeErr) {
        setError(
          challengeErr.message ||
          "Could not refresh challenge. Please log in again."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Loading state while creating challenge
  if (isChallenging) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={3}>
          <Spinner size="xl" color="purple.500" thickness="3px" />
          <Text fontSize="sm" color="gray.500">
            Preparing verification…
          </Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        w="full"
        maxW="400px"
        mx={4}
      >
        <VStack spacing={6} align="stretch">

          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Logo />
            <Heading size="md" mt={2}>
              Two-Factor Verification
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Enter the 6-digit code from your authenticator app.
            </Text>
          </VStack>

          <Divider />

          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* PIN Input */}
          <VStack spacing={4}>
            <HStack justify="center">
              <PinInput
                otp
                size="lg"
                value={code}
                onChange={setCode}
                onComplete={handleVerify}
                isDisabled={isVerifying}
                autoFocus
              >
                {[...Array(6)].map((_, i) => (
                  <PinInputField key={i} />
                ))}
              </PinInput>
            </HStack>

            <Button
              colorScheme="purple"
              leftIcon={<FiShield />}
              onClick={handleVerify}
              isLoading={isVerifying}
              loadingText="Verifying…"
              isDisabled={code.length !== 6}
              w="full"
            >
              Verify & Sign In
            </Button>

            <Button
              variant="ghost"
              size="sm"
              color="gray.500"
              onClick={() => navigate("/login", { replace: true })}
            >
              ← Back to Login
            </Button>
          </VStack>

        </VStack>
      </Box>
    </Box>
  );
};

export default TwoFactorPage;