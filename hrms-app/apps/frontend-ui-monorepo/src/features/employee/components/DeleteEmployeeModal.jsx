// src/features/employee/components/DeleteEmployeeModal.jsx
import React, { useState } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter,
  Box, Flex, Text, Input, Button, VStack, HStack,
  useToast, PinInput, PinInputField,
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/fi";
import { deleteEmployee } from "@/services/employeeApi";
import { verifyTOTP } from "@/lib/totpUtils";
import { useQueryClient } from "@tanstack/react-query";

const DeleteEmployeeModal = ({ isOpen, onClose, employee }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [totp, setTotp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totpError, setTotpError] = useState(false);

  const handleClose = () => {
    setTotp("");
    setTotpError(false);
    onClose();
  };

  const handleDelete = async () => {
    if (totp.length !== 6) {
      setTotpError(true);
      return;
    }

    const isValid = verifyTOTP(totp);
    if (!isValid) {
      setTotpError(true);
      toast({
        title: "Invalid authenticator code",
        description: "Please check your TOTP app and try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setTotp("");
      return;
    }

    setIsLoading(true);
    try {
      await deleteEmployee(employee.id);
      // ✅ Invalidate React Query cache → table auto-refreshes
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Employee deleted",
        description: `${employee.name}'s record has been permanently removed.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      handleClose();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!employee) return null;

  // Short EMP ID from UUID
  const empShortId = `#${employee.id?.slice(0, 8).toUpperCase()}`;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" isCentered motionPreset="scale">
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} overflow="hidden" boxShadow="2xl">

        {/* ── Red/Pink Header ───────────────────────────────── */}
        <Box bg="red.50" px={6} pt={6} pb={5}>
          <HStack spacing={3} align="flex-start">
            <Flex
              w="40px" h="40px" bg="red.100" borderRadius="xl"
              align="center" justify="center" flexShrink={0}
            >
              <FiTrash2 size={18} color="#E53E3E" />
            </Flex>
            <Box>
              <Text fontSize="lg" fontWeight="bold" color="red.600" lineHeight="1.2">
                Delete Employee
              </Text>
              <Text fontSize="sm" color="red.400" mt={0.5}>
                This action cannot be undone
              </Text>
            </Box>
          </HStack>
        </Box>

        {/* ── Body ─────────────────────────────────────────── */}
        <ModalBody px={6} py={5}>
          <VStack spacing={5} align="stretch">
            <Text fontSize="sm" color="text-secondary" lineHeight="1.6">
              You are about to permanently delete{" "}
              <Text as="span" fontWeight="bold" color="text-primary">
                {employee.name}
              </Text>{" "}
              <Text as="span" fontWeight="bold" color="text-primary">
                ({empShortId})
              </Text>{" "}
              and all their files.
            </Text>

            {/* ── TOTP Input ──────────────────────────────── */}
            <Box>
              <Text
                fontSize="2xs"
                fontWeight="bold"
                color="text-muted"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={3}
              >
                Authenticator Code (TOTP)
              </Text>
              <HStack justify="center">
                <PinInput
                  otp
                  size="lg"
                  value={totp}
                  onChange={(val) => {
                    setTotp(val);
                    setTotpError(false);
                  }}
                  isInvalid={totpError}
                  placeholder="0"
                >
                  {[...Array(6)].map((_, i) => (
                    <PinInputField
                      key={i}
                      h="52px"
                      w="52px"
                      fontSize="xl"
                      fontWeight="bold"
                      borderRadius="xl"
                      borderColor={totpError ? "red.400" : "gray.200"}
                      bg={totpError ? "red.50" : "gray.50"}
                      _focus={{
                        borderColor: totpError ? "red.400" : "accent",
                        boxShadow: totpError
                          ? "0 0 0 3px rgba(239, 68, 68, 0.25)"
                          : "0 0 0 3px rgba(99, 102, 241, 0.25)",
                        bg: "card-bg",
                      }}
                    />
                  ))}
                </PinInput>
              </HStack>
              {totpError && (
                <Text fontSize="xs" color="red.500" textAlign="center" mt={2}>
                  Invalid code. Check your authenticator app.
                </Text>
              )}
            </Box>
          </VStack>
        </ModalBody>

        {/* ── Footer ───────────────────────────────────────── */}
        <ModalFooter px={6} pb={6} pt={2}>
          <HStack spacing={3} w="full" justify="flex-end">
            <Button
              variant="ghost"
              color="text-muted"
              fontWeight="medium"
              fontSize="sm"
              onClick={handleClose}
              _hover={{ color: "gray.700" }}
              h="44px"
              px={5}
            >
              Cancel
            </Button>
            <Button
              bg="red.500"
              color="white"
              fontWeight="bold"
              fontSize="sm"
              h="44px"
              px={6}
              borderRadius="xl"
              _hover={{ bg: "red.600" }}
              _active={{ bg: "red.700" }}
              onClick={handleDelete}
              isLoading={isLoading}
              loadingText="Deleting..."
              isDisabled={totp.length !== 6}
            >
              Confirm & Delete
            </Button>
          </HStack>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
};

export default DeleteEmployeeModal;