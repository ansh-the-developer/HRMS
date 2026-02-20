import React, { useState } from "react";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  Flex,
  Text,
  VStack,
  Grid,
  Input,
  Select,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

const PerformanceNewReviewPage = () => {
  const [quarter] = useState("Q2 2025");
  const [employee, setEmployee] = useState("");
  const [ratings, setRatings] = useState({
    knowledge1: "",
    knowledge2: "",
    quality1: "",
    quality2: "",
  });
  const [comments, setComments] = useState("");

  const handleRatingChange = (key, value) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const payload = { quarter, employee, ratings, comments };
    console.log("Performance review submit:", payload);
  };

  return (
    <DashboardLayout pageTitle="Performance">
      <Box bg="white" p={8} borderRadius="xl" shadow="sm" borderWidth="1px">
        <VStack align="stretch" spacing={8}>
          <VStack align="flex-start" spacing={4}>
            <Flex align="center" gap={4}>
              <Text fontSize="sm" fontWeight="semibold">
                Quarter:
              </Text>
              <Box
                px={4}
                py={1}
                borderRadius="full"
                bg="gray.200"
                fontSize="sm"
              >
                {quarter}
              </Box>
            </Flex>

            <Flex align="center" gap={4}>
              <Text fontSize="sm" fontWeight="semibold">
                Employee:
              </Text>
              <Select
                placeholder="Choose"
                size="sm"
                maxW="220px"
                bg="gray.50"
                border="none"
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
              >
                <option value="Jaydeep">Jaydeep</option>
                <option value="Rahul">Rahul</option>
                <option value="Aman">Aman</option>
              </Select>
            </Flex>
          </VStack>

          <Box borderRadius="md" overflow="hidden">
            <Grid templateColumns="2fr 1fr">
              <Box
                bg="#4A90E2"
                color="white"
                px={4}
                py={2}
                fontWeight="semibold"
                borderRightWidth="1px"
                borderColor="whiteAlpha.400"
              >
                Knowledge of job skills
              </Box>
              <Box
                bg="#4A90E2"
                color="white"
                px={4}
                py={2}
                fontWeight="semibold"
              >
                Rating
              </Box>
            </Grid>

            <Grid templateColumns="2fr 1fr" bg="#E2E5EA">
              <Box px={4} py={2} borderBottomWidth="1px">
                Understands role and scope of work
              </Box>
              <Box px={4} py={2} borderBottomWidth="1px">
                <Input
                  size="sm"
                  bg="white"
                  value={ratings.knowledge1}
                  onChange={(e) =>
                    handleRatingChange("knowledge1", e.target.value)
                  }
                />
              </Box>

              <Box px={4} py={2}>
                Applies domain knowledge effectively
              </Box>
              <Box px={4} py={2}>
                <Input
                  size="sm"
                  bg="white"
                  value={ratings.knowledge2}
                  onChange={(e) =>
                    handleRatingChange("knowledge2", e.target.value)
                  }
                />
              </Box>
            </Grid>
          </Box>

          <Box borderRadius="md" overflow="hidden">
            <Grid templateColumns="2fr 1fr">
              <Box
                bg="#4A90E2"
                color="white"
                px={4}
                py={2}
                fontWeight="semibold"
                borderRightWidth="1px"
                borderColor="whiteAlpha.400"
              >
                Quality / quantity of work
              </Box>
              <Box
                bg="#4A90E2"
                color="white"
                px={4}
                py={2}
                fontWeight="semibold"
              >
                Rating
              </Box>
            </Grid>

            <Grid templateColumns="2fr 1fr" bg="#E2E5EA">
              <Box px={4} py={2} borderBottomWidth="1px">
                Meets deadlines and output expectations
              </Box>
              <Box px={4} py={2} borderBottomWidth="1px">
                <Input
                  size="sm"
                  bg="white"
                  value={ratings.quality1}
                  onChange={(e) =>
                    handleRatingChange("quality1", e.target.value)
                  }
                />
              </Box>

              <Box px={4} py={2}>
                Maintains accuracy and attention to detail
              </Box>
              <Box px={4} py={2}>
                <Input
                  size="sm"
                  bg="white"
                  value={ratings.quality2}
                  onChange={(e) =>
                    handleRatingChange("quality2", e.target.value)
                  }
                />
              </Box>
            </Grid>
          </Box>

          <Box borderRadius="md" overflow="hidden">
            <Grid templateColumns="2fr 1fr">
              <Box
                bg="#4A90E2"
                color="white"
                px={4}
                py={2}
                fontWeight="semibold"
              >
                Comments
              </Box>
              <Box bg="#4A90E2" />
            </Grid>
            <Box bg="#E2E5EA" px={4} py={3}>
              <Input
                size="sm"
                bg="white"
                placeholder="Write overall comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Box>
          </Box>

          <Box>
            <HRMSButton
              colorScheme="blue"
              bgGradient="linear(to-r, #4A90E2, #B0B0B0)"
              onClick={handleSubmit}
            >
              Submit
            </HRMSButton>
          </Box>
        </VStack>
      </Box>
    </DashboardLayout>
  );
};

export default PerformanceNewReviewPage;
