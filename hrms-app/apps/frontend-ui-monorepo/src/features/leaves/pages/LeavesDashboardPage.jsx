import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import this
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import {
  Box,
  SimpleGrid,
  Grid,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import LeaveRequestForm from "../components/LeaveRequestForm";

const LeavesDashboardPage = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const navigate = useNavigate(); // ✅ Initialize hook

  return (
    <DashboardLayout pageTitle="Leaves">
      <VStack spacing={6} align="stretch">
        {/* TOP ROW: 3 Cards */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
          
          {/* 1. CALENDAR (Unchanged) */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="md" fontWeight="semibold">Calendar</Text>
              <Box w="40px" h="40px" bg="purple.50" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                📅
              </Box>
            </Flex>
            <Flex justify="space-between" align="center" mb={4}>
              <HRMSButton size="sm" colorScheme="purple">←</HRMSButton>
              <Text fontSize="sm" fontWeight="medium">July, 2025</Text>
              <HRMSButton size="sm" colorScheme="purple">→</HRMSButton>
            </Flex>
            <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2} textAlign="center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <Text key={d} fontSize="xs" color="gray.500">{d}</Text>)}
            </Grid>
            <Grid templateColumns="repeat(7, 1fr)" gap={1} textAlign="center">
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <Flex key={day} h="32px" align="center" justify="center" borderRadius="full" bg={day === 8 ? "purple.500" : "transparent"} color={day === 8 ? "white" : "gray.700"} fontSize="sm" cursor="default">
                  {day}
                </Flex>
              ))}
            </Grid>
          </Box>

          {/* 2. MIDDLE CARD: Toggle between Summary AND Form */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            {isRequesting ? (
              <LeaveRequestForm 
                onCancel={() => setIsRequesting(false)} 
                onSubmit={() => setIsRequesting(false)}
              />
            ) : (
              <VStack spacing={4} align="stretch" h="full">
                <Flex justify="space-between" align="baseline">
                  <Text fontSize="sm" fontWeight="semibold">Leaves Allotted</Text>
                  <Text fontSize="2xl" fontWeight="bold">2</Text>
                </Flex>
                <Flex justify="space-between" align="baseline">
                  <Text fontSize="sm" fontWeight="semibold">Leaves Available</Text>
                  <Text fontSize="2xl" fontWeight="bold">1</Text>
                </Flex>
                <Divider />
                <Box>
                  <Text fontSize="xs" fontWeight="semibold" color="gray.600" mb={1}>
                    Upcoming Leaves (Approved)
                  </Text>
                  <Text fontSize="md" fontWeight="bold">21 July</Text>
                </Box>
                <Box mt="auto" pt={4}>
                  <HRMSButton 
                    colorScheme="blue" 
                    w="full"
                    onClick={() => setIsRequesting(true)}
                  >
                    Request Leave
                  </HRMSButton>
                </Box>
              </VStack>
            )}
          </Box>

          {/* 3. TEAM MEMBERS (Unchanged) */}
          <Box bg="white" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            <Text fontSize="md" fontWeight="semibold" mb={4}>Team Members on Leave this week</Text>
            <VStack spacing={4} align="stretch">
              {[
                { name: 'Vijay', dates: '15-17 July' },
                { name: 'Rahul', dates: '20-24 July' },
                { name: 'Jaydeep', dates: '21 July' },
              ].map(m => (
                <Flex key={m.name} justify="space-between" align="center">
                  <HStack spacing={3}>
                    <Avatar size="sm" name={m.name} />
                    <Text fontSize="sm">{m.name}</Text>
                  </HStack>
                  <Text fontSize="xs" color="gray.600">{m.dates}</Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>

        {/* BOTTOM: ACTIONS CARD */}
        <Box bg="white" p={8} borderRadius="lg" shadow="sm" borderWidth="1px">
          <VStack spacing={6} align="stretch">
            
            {/* Leave Approval Status */}
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">Leave Approval Status</Text>
                <Text fontSize="sm" color="gray.500">Check status of your leave request</Text>
              </Box>
              <HRMSButton 
                colorScheme="blue" 
                onClick={() => navigate('/leaves/submit-status')} // ✅ FIXED
              >
                Check
              </HRMSButton>
            </Flex>

            <Divider />

            {/* Approve Leaves */}
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">Approve Leaves</Text>
                <Text fontSize="sm" color="gray.500">Check requests and approve leaves</Text>
              </Box>
              <HRMSButton 
                colorScheme="blue" 
                onClick={() => navigate('/leaves/requests')} // ✅ FIXED
              >
                Check
              </HRMSButton>
            </Flex>

            <Divider />

            {/* Define Rules */}
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">Define Rules</Text>
                <Text fontSize="sm" color="gray.400">Notice Period Before Leave, Approval Flow and more</Text>
              </Box>
              <HRMSButton 
                variant="outline" 
                colorScheme="blue" 
                onClick={() => navigate('/leaves/rules')} // ✅ FIXED
              >
                Edit
              </HRMSButton>
            </Flex>
          </VStack>
        </Box>
      </VStack>
    </DashboardLayout>
  );
};

export default LeavesDashboardPage;
