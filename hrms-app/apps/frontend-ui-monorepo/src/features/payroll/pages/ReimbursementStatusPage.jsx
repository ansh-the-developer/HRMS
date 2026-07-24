import React, { useState, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  VStack,
  HStack,
  useToast,
  Button,
} from "@chakra-ui/react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

export default function ReimbursementStatusPage() {
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    type: "Food",
    date: "",
    file: null,
  });

  const reimbursementTypes = ["Food", "Travel", "Other"];

  // ── Handlers ──
  const handleTypeSelect = (type) => setForm({ ...form, type });
  const handleDateChange = (e) => setForm({ ...form, date: e.target.value });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, file });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!form.date) {
      toast({
        title: "Date missing",
        description: "Please select a date.",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Process submission logic here (API call, state update)
    console.log("Submitted:", form);

    toast({
      title: "Reimbursement Submitted",
      description: `Your ${form.type.toLowerCase()} claim has been requested.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    // Reset form
    setForm({ type: "Food", date: "", file: null });
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 6 }} py={6} maxW="4xl">
        {/* Header */}
        <Box mb={6}>
          <Text fontSize="lg" fontWeight="semibold" color="text-primary">
            Reimbursement Status
          </Text>
          <Text fontSize="sm" color="text-muted">
            Request claims (Pending, Approved, Rejected).
          </Text>
        </Box>

        {/* Form Card */}
        <Box bg="card-bg" borderRadius="xl" boxShadow="sm" p={{ base: 5, md: 8 }} border="1px solid" borderColor="border-color">
          <VStack spacing={8} align="stretch">
            
            {/* 1. Reimbursement Type */}
            <Flex direction={{ base: "column", md: "row" }} align={{ md: "center" }} gap={4}>
              <Text fontWeight="medium" fontSize="sm" color="text-secondary" minW="160px">
                Reimbursement Type
              </Text>
              <HStack spacing={3}>
                {reimbursementTypes.map((type) => {
                  const isActive = form.type === type;
                  return (
                    <Box
                      key={type}
                      as="button"
                      onClick={() => handleTypeSelect(type)}
                      px={6} py={1.5}
                      borderRadius="full"
                      fontSize="sm"
                      fontWeight="medium"
                      transition="all 0.2s"
                      bg={isActive ? "accent" : "app-bg-secondary"}
                      color={isActive ? "white" : "text-secondary"}
                      _hover={{ bg: isActive ? "accent" : "hover-bg" }}
                      boxShadow={isActive ? "md" : "none"}
                    >
                      {type}
                    </Box>
                  );
                })}
              </HStack>
            </Flex>

            {/* 2. For Date */}
            <Flex direction={{ base: "column", md: "row" }} align={{ md: "center" }} gap={4}>
              <Text fontWeight="medium" fontSize="sm" color="text-secondary" minW="160px">
                For Date
              </Text>
              <Input
                type="date"
                value={form.date}
                onChange={handleDateChange}
                maxW="200px"
                bg="card-bg"
                fontSize="sm"
                color="text-secondary"
                borderColor="border-color"
              />
            </Flex>

            {/* 3. Submit Documents */}
            <Flex direction={{ base: "column", md: "row" }} align={{ md: "center" }} justify="space-between" gap={4}>
              <Flex direction={{ base: "column", md: "row" }} align={{ md: "center" }} gap={4}>
                <Box minW="160px">
                  <Text fontWeight="medium" fontSize="sm" color="text-secondary">
                    Submit Documents
                  </Text>
                  <Text fontSize="xs" color="text-muted">
                    (If Applicable)
                  </Text>
                </Box>
                
                {/* Upload Button Component (not HRMSButton to match purple style in screenshot) */}
                <Flex align="center" gap={3}>
                  <Button
                    onClick={handleUploadClick}
                    bg="#6b46c1"
                    color="white"
                    _hover={{ bg: "#553c9a" }}
                    borderRadius="lg"
                    px={6}
                    size="sm"
                    fontWeight="medium"
                  >
                    UPLOAD
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  {form.file && (
                    <Text fontSize="xs" color="text-muted" isTruncated maxW="150px">
                      {form.file.name}
                    </Text>
                  )}
                </Flex>
              </Flex>

              {/* Submit Button */}
              <HRMSButton onClick={handleSubmit} px={8}>
                Submit
              </HRMSButton>
            </Flex>

          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
