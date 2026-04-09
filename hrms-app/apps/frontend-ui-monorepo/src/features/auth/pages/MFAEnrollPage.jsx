import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  HStack,
  Image,
  Code,
  IconButton,
  useClipboard,
  Divider,
  Spinner,
  Center,
  Badge,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import { FiCopy, FiCheck, FiShield } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/atomic/atoms";

const MFAEnrollPage = () => {
  const { enrollMFA, challengeMFA, verifyMFA } = useAuth();
  const navigate = useNavigate();

  const [factorData, setFactorData]   = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [code, setCode]               = useState("");
  const [error, setError]             = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(true);

  const { hasCopied, onCopy } = useClipboard(factorData?.totp?.secret || "");

  // On mount → enroll and create first challenge
  useEffect(() => {
    const init = async () => {
      try {
        const data      = await enrollMFA();
        setFactorData(data);
        const challenge = await challengeMFA(data.id);
        setChallengeId(challenge.id);
      } catch (err) {
        setError(err.message || "Failed to set up authenticator. Please try again.");
      } finally {
        setIsEnrolling(false);
      }
    };
    init();
  }, []);

  const handleVerify = async () => {
    if (code.length !== 6 || !challengeId) return;
    setIsVerifying(true);
    setError("");
    try {
      await verifyMFA(factorData.id, challengeId, code);
      navigate("/home", { replace: true });
    } catch (err) {                                             // ✅ named err
      setError(`Invalid code. Please check your authenticator app and try again.${err}`);
      setCode("");
      // Refresh challenge so user can retry
      try {
        const newChallenge = await challengeMFA(factorData.id);
        setChallengeId(newChallenge.id);
      } catch (challengeErr) {                                  // ✅ surfaces to user
        setError(
          challengeErr.message ||
          "Could not refresh challenge. Please reload the page."
        );
      }
    } finally {
      setIsVerifying(false);
    }
  };

  // Loading state while enrolling
  if (isEnrolling) {
    return (
      <Center minH="100vh" bg="gray.50">
        <VStack spacing={3}>
          <Spinner size="xl" color="purple.500" thickness="3px" />
          <Text fontSize="sm" color="gray.500">
            Setting up your authenticator…
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
      py={10}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        w="full"
        maxW="460px"
        mx={4}
      >
        <VStack spacing={6} align="stretch">

          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Logo />
            <Badge colorScheme="purple" px={3} py={1} borderRadius="full" mt={2}>
              First-time setup
            </Badge>
            <Heading size="md" mt={1}>
              Set up Two-Factor Authentication
            </Heading>
            <Text fontSize="sm" color="gray.500" maxW="340px" mx="auto">
              Scan the QR code with <strong>Google Authenticator</strong> or{" "}
              <strong>ProtonPass</strong>. This screen will not appear again.
            </Text>
          </VStack>

          <Divider />

          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Step 1 — QR Code */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Step 1 — Scan this QR code
            </Text>
            {factorData?.totp?.qr_code && (
              <Box
                border="1px solid"
                borderColor="gray.200"
                borderRadius="lg"
                p={4}
                display="flex"
                justifyContent="center"
                bg="white"
              >
                <Image
                  src={factorData.totp.qr_code}
                  alt="TOTP QR Code — scan with your authenticator app"
                  boxSize="180px"
                />
              </Box>
            )}
          </VStack>

          {/* Step 2 — Manual secret key */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Step 2 — Or enter the key manually
            </Text>
            <HStack
              bg="gray.50"
              px={3}
              py={2}
              borderRadius="md"
              border="1px solid"
              borderColor="gray.200"
              justify="space-between"
            >
              <Code
                fontSize="xs"
                bg="transparent"
                letterSpacing="wider"
                wordBreak="break-all"
                userSelect="all"
              >
                {factorData?.totp?.secret}
              </Code>
              <IconButton
                size="xs"
                icon={hasCopied ? <FiCheck /> : <FiCopy />}
                onClick={onCopy}
                aria-label="Copy secret key"
                colorScheme={hasCopied ? "green" : "gray"}
                variant="ghost"
                flexShrink={0}
              />
            </HStack>
            <Text fontSize="xs" color="orange.500">
              ⚠️ Save this key somewhere safe — you'll need it if you lose your phone.
            </Text>
          </VStack>

          {/* Step 3 — Enter 6-digit code */}
          <VStack spacing={4} align="stretch">
            <Text fontSize="sm" fontWeight="semibold" color="gray.700">
              Step 3 — Enter the 6-digit code from your app
            </Text>
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
              Confirm & Continue
            </Button>
          </VStack>

        </VStack>
      </Box>
    </Box>
  );
};

export default MFAEnrollPage;