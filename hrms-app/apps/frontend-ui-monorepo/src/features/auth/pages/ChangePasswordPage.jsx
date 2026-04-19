import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  Divider,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import { FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/atomic/atoms";
import { useProfile } from './../../../services/useProfile';

// ── Password strength rules ───────────────────────────────
const RULES = [
  { id: "length",  label: "At least 8 characters",       test: (p) => p.length >= 8 },
  { id: "upper",   label: "One uppercase letter",         test: (p) => /[A-Z]/.test(p) },
  { id: "lower",   label: "One lowercase letter",         test: (p) => /[a-z]/.test(p) },
  { id: "number",  label: "One number",                   test: (p) => /[0-9]/.test(p) },
  { id: "special", label: "One special character (!@#$)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const ChangePasswordPage = () => {
  const { updatePassword } = useAuth();
  const { updateProfile }        = useProfile();
  const navigate                 = useNavigate();

  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState("");
  const [isLoading,       setIsLoading]       = useState(false);

  const ruleResults  = RULES.map((r) => ({ ...r, passed: r.test(newPassword) }));
  const allPassed    = ruleResults.every((r) => r.passed);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!allPassed) {
      setError("Password does not meet all requirements.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // 1️⃣ Change the password
      await updatePassword(newPassword);

      // 2️⃣ Mark must_change_password = false in profiles
      await updateProfile({ must_change_password: false });

      // 3️⃣ Send to MFA enrolment
      navigate("/enroll-mfa", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        maxW="440px"
        mx={4}
      >
        <VStack spacing={6} align="stretch">

          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Logo />
            <Heading size="md" mt={2}>Set Your New Password</Heading>
            <Text fontSize="sm" color="gray.500">
              This is your first login. Please choose a secure password.
            </Text>
          </VStack>

          <Divider />

          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>

              {/* New Password */}
              <FormControl isRequired>
                <FormLabel fontSize="sm">New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showNew ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowNew(!showNew)}
                      aria-label={showNew ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {/* Password rules — shown once user starts typing */}
              {newPassword.length > 0 && (
                <List spacing={1} w="full" fontSize="xs">
                  {ruleResults.map((r) => (
                    <ListItem
                      key={r.id}
                      color={r.passed ? "green.500" : "red.400"}
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <ListIcon
                        as={r.passed ? FiCheck : FiX}
                        color={r.passed ? "green.500" : "red.400"}
                      />
                      {r.label}
                    </ListItem>
                  ))}
                </List>
              )}

              {/* Confirm Password */}
              <FormControl isRequired>
                <FormLabel fontSize="sm">Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    borderColor={
                      confirmPassword.length > 0
                        ? passwordsMatch ? "green.400" : "red.400"
                        : undefined
                    }
                  />
                  <InputRightElement>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      icon={showConfirm ? <FiEyeOff /> : <FiEye />}
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="purple"
                w="full"
                isLoading={isLoading}
                loadingText="Updating…"
                isDisabled={!allPassed || !passwordsMatch}
                mt={2}
              >
                Set Password & Continue
              </Button>

            </VStack>
          </form>

        </VStack>
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;