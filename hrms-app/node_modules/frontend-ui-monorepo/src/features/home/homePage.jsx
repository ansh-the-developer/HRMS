import React from "react";
import { Button, Box, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionHeading = motion.create(Heading);
const MotionText = motion.create(Text);
const MotionBox = motion.create(Box);

export default function HomePage() {
  return (
    <Box minH="100vh" w="full" bg="gray.50" display="flex" flexDirection="column" alignItems="center" py={10} px={4}>
      
      {/* Hero Section */}
      <Box maxW="5xl" w="full" textAlign="center" mb={16}>
        <MotionHeading
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          fontSize="5xl"
          fontWeight="bold"
          mb={6}
          color="gray.900"
        >
          Welcome to Cyber Alliance HRMS
        </MotionHeading>

        <MotionText
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          fontSize="lg"
          color="gray.600"
          mb={8}
        >
          A clean and modern React + Tailwind template to kickstart your project.
        </MotionText>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button size="lg" px={6} py={6} borderRadius="2xl" shadow="md" colorScheme="blue">
            Get Started
          </Button>
        </MotionBox>
      </Box>

      {/* Features Section */}
      <Box
        maxW="6xl"
        w="full"
        display="grid"
        gridTemplateColumns={["1fr", "repeat(3, 1fr)"]}
        gap={8}
      >
        {[1, 2, 3].map((item) => (
          <Box
            key={item}
            bg="white"
            borderRadius="2xl"
            shadow="sm"
            p={6}
          >
            <Heading fontSize="2xl" fontWeight="semibold" mb={3} color="gray.800">
              Feature {item}
            </Heading>
            <Text color="gray.600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
            </Text>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Text mt={20} color="gray.500" fontSize="sm">
        © 2025 Your Company. All rights reserved.
      </Text>
    </Box>
  );
}
