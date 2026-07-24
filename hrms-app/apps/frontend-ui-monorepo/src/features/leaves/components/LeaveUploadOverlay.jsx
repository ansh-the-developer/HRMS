// src/features/leaves/components/LeaveUploadOverlay.jsx
import React, { useRef, useState } from "react";
import { Box, Text, VStack, Center, useToast } from "@chakra-ui/react";

const LeaveUploadOverlay = ({ onClose, onFileSelected }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndUpload = (file) => {
    if (!file) return;

    // Backend-ready validation: Check MIME types
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or JPEG file.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Pass file back to parent
    onFileSelected(file);
    onClose();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndUpload(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    validateAndUpload(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="full"
      h="full"
      bg="blackAlpha.200"
      backdropFilter="blur(4px)"
      zIndex="10"
      display="flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="lg"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box
        position="relative"
        bg={isDragging ? "purple.50" : "white"}
        w="90%"
        maxW="400px"
        h="180px"
        borderRadius="xl"
        borderWidth="2px"
        borderColor={isDragging ? "purple.500" : "purple.300"}
        borderStyle="dashed"
        boxShadow="lg"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        transition="all 0.2s"
        cursor="pointer" // Indicate clickable
        onClick={handleClick} // Click anywhere to upload
      >
        {/* Hidden Input for Backend Compatibility */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".pdf,.jpg,.jpeg"
          onChange={handleInputChange}
        />

        {/* Close Button */}
        <Box
          as="button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering upload click
            onClose();
          }}
          position="absolute"
          top="-15px"
          right="-15px"
          w="32px"
          h="32px"
          bg="purple.300"
          color="white"
          borderRadius="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          lineHeight="1"
          _hover={{ bg: "purple.400" }}
          zIndex="20"
        >
          ✕
        </Box>

        <VStack spacing={2}>
          <Center
            w="48px"
            h="48px"
            bg="#7B61FF"
            borderRadius="xl"
            color="white"
            mb={2}
            boxShadow="0px 4px 10px rgba(123, 97, 255, 0.3)"
            transform={isDragging ? "scale(1.1)" : "scale(1)"}
            transition="transform 0.2s"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </Center>

          <Text fontSize="sm" fontWeight="medium" color="text-secondary">
            {isDragging ? "Drop file here" : "Drag & Drop or "}
            {!isDragging && (
              <Text as="span" color="purple.500" textDecoration="underline">
                choose file
              </Text>
            )}
          </Text>

          <Text fontSize="xs" color="text-muted">
            Supported formats : Jpeg, pdf
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default LeaveUploadOverlay;
