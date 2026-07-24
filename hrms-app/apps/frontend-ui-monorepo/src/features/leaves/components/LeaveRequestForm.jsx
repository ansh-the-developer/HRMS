// src/features/leaves/components/LeaveRequestForm.jsx
import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  Badge,
  IconButton,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import LeaveUploadOverlay from "./LeaveUploadOverlay";

const LeaveTypeChip = ({ label, isSelected, onClick }) => (
  <Box
    as="button"
    onClick={onClick}
    px={4}
    py={1}
    borderRadius="full"
    fontSize="xs"
    fontWeight="medium"
    bg={isSelected ? "accent" : "border-color"}
    color={isSelected ? "white" : "text-secondary"}
    bgGradient={isSelected ? "linear(to-r, blue.400, blue.600)" : "none"}
    _hover={{ opacity: 0.9 }}
    transition="all 0.2s"
  >
    {label}
  </Box>
);

const LeaveRequestForm = ({ onCancel, onSubmit: parentOnSubmit }) => {
  const [leaveType, setLeaveType] = useState("Casual");
  const [showUpload, setShowUpload] = useState(false);
  
  // 1. New State for Form Data
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);

  // 2. Handle File Selection from Overlay
  const handleFileSelected = (file) => {
    setAttachedFile(file);
    // Optional: Toast notification here
  };

  // 3. Prepare Data for Backend
  const handleSubmit = () => {
    // Standard way to send files + data to backend
    const formData = new FormData();
    formData.append("leave_type", leaveType);
    formData.append("from_date", fromDate);
    formData.append("to_date", toDate);
    formData.append("reason", reason);
    
    if (attachedFile) {
      formData.append("document", attachedFile);
    }

    // For debugging: Log what we are sending
    console.log("🚀 Submitting to Backend:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    // Call parent submit (mocking API call)
    if (parentOnSubmit) parentOnSubmit(formData);
  };

  return (
    <Box position="relative" h="full">
      
      {/* Overlay connects here */}
      {showUpload && (
        <LeaveUploadOverlay 
          onClose={() => setShowUpload(false)} 
          onFileSelected={handleFileSelected} 
        />
      )}

      <VStack spacing={4} align="stretch">
        {/* Leave Type */}
        <Flex align="center" wrap="wrap" gap={2}>
          <Text w="80px" fontWeight="bold" fontSize="xs">Leave Type</Text>
          <HStack spacing={2}>
            {["Casual", "Sick", "Other"].map((type) => (
              <LeaveTypeChip
                key={type}
                label={type}
                isSelected={leaveType === type}
                onClick={() => setLeaveType(type)}
              />
            ))}
          </HStack>
        </Flex>

        {/* Dates & Reason */}
        <Flex gap={4} direction={{ base: "column", md: "row" }}>
          <VStack spacing={3} flex="1" align="stretch">
            <Flex align="center">
              <Text w="60px" fontWeight="bold" fontSize="xs">From</Text>
              <Input 
                type="date" size="xs" bg="app-bg-secondary" border="none" fontWeight="semibold"
                value={fromDate} onChange={(e) => setFromDate(e.target.value)}
              />
            </Flex>
            <Flex align="center">
              <Text w="60px" fontWeight="bold" fontSize="xs">To</Text>
              <Input 
                type="date" size="xs" bg="app-bg-secondary" border="none" fontWeight="semibold"
                value={toDate} onChange={(e) => setToDate(e.target.value)}
              />
            </Flex>
          </VStack>
          <VStack spacing={1} flex="1" align="stretch">
            <Text fontWeight="bold" fontSize="xs" textDecoration="underline">Reason</Text>
            <Textarea 
              rows={3} bg="app-bg-secondary" border="1px solid" borderColor="border-color" resize="none" size="xs"
              value={reason} onChange={(e) => setReason(e.target.value)}
            />
          </VStack>
        </Flex>

        {/* Footer */}
        <Flex justify="space-between" align="flex-end" pt={2}>
          <VStack align="flex-start" spacing={1}>
            <Text fontWeight="bold" fontSize="10px">Submit Docs</Text>
            
            {/* Conditional Rendering: Show Button OR File Name */}
            {!attachedFile ? (
              <HRMSButton 
                size="xs"
                colorScheme="purple" 
                bg="#7B61FF" 
                _hover={{ bg: "#6b51ef" }}
                onClick={() => setShowUpload(true)}
              >
                UPLOAD
              </HRMSButton>
            ) : (
              <HStack spacing={2} bg="rgba(99, 102, 241, 0.12)" px={2} py={1} borderRadius="md" border="1px dashed" borderColor="purple.300">
                <Text fontSize="10px" color="purple.700" maxW="100px" isTruncated>
                  📎 {attachedFile.name}
                </Text>
                <Box 
                  as="button" 
                  color="red.400" 
                  fontWeight="bold" 
                  fontSize="10px"
                  onClick={() => setAttachedFile(null)} // Remove file
                  _hover={{ color: "red.600" }}
                >
                  ✕
                </Box>
              </HStack>
            )}
          </VStack>

          <HStack spacing={2}>
            <HRMSButton size="xs" variant="ghost" onClick={onCancel}>Cancel</HRMSButton>
            <HRMSButton 
              size="xs" 
              colorScheme="blue" 
              bgGradient="linear(to-r, #4A90E2, #9013FE)" 
              _hover={{ opacity: 0.9 }}
              onClick={handleSubmit} // Triggers FormData creation
            >
              Submit
            </HRMSButton>
          </HStack>
        </Flex>
      </VStack>
    </Box>
  );
};

export default LeaveRequestForm;
