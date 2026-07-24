import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  useToast,
  Spinner,
} from "@chakra-ui/react";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import LeaveRequestForm from "../components/LeaveRequestForm";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";
import { useCreateLeaveRequest } from "@/hooks/useLeaves";
import { uploadLeaveDocument } from "@/services/leaveApi";
import { supabase } from "@/lib/supabaseClient";

const LeavesDashboardPage = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { role, originalRole } = useRole();
  const { user } = useAuth();
  const isEmployeeMode = role === "employee";

  const createLeaveMutation = useCreateLeaveRequest();

  const handleRequestSubmit = async (formData) => {
    if (submitting) return;

    const fromDate = formData.get("from_date");
    const toDate   = formData.get("to_date");

    // Validate required date fields
    if (!fromDate || !toDate) {
      toast({ title: "Please select both start and end dates.", status: "warning", duration: 3000 });
      return;
    }

    try {
      setSubmitting(true);

      // Resolve employee record ID directly at submit time — avoids race conditions
      const { data: empRow, error: empErr } = await supabase
        .from("employees")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (empErr) throw empErr;
      if (!empRow?.id) {
        toast({ title: "No employee profile linked to your account. Please contact HR.", status: "error", duration: 5000 });
        return;
      }

      const file = formData.get("document");
      let documentUrl = null;
      if (file) {
        documentUrl = await uploadLeaveDocument(file);
      }

      await createLeaveMutation.mutateAsync({
        employee_id:  empRow.id,
        type:         formData.get("leave_type"),
        start_date:   fromDate,
        end_date:     toDate,
        reason:       formData.get("reason") || null,
        status:       "Pending",
        document_url: documentUrl,
      });

      toast({
        title: "Leave Requested",
        description: "Your leave application has been submitted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setIsRequesting(false);
    } catch (err) {
      toast({
        title: "Request Failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Leaves">
      <VStack spacing={6} align="stretch">
        {/* TOP ROW: 3 Cards */}
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
          
          {/* 1. CALENDAR (Unchanged) */}
          <Box bg="card-bg" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="md" fontWeight="semibold">Calendar</Text>
              <Box w="40px" h="40px" bg="rgba(99, 102, 241, 0.12)" borderRadius="lg" display="flex" alignItems="center" justifyContent="center">
                📅
              </Box>
            </Flex>
            <Flex justify="space-between" align="center" mb={4}>
              <HRMSButton size="sm" colorScheme="purple">←</HRMSButton>
              <Text fontSize="sm" fontWeight="medium">July, 2025</Text>
              <HRMSButton size="sm" colorScheme="purple">→</HRMSButton>
            </Flex>
            <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={2} textAlign="center">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <Text key={d} fontSize="xs" color="text-muted">{d}</Text>)}
            </Grid>
            <Grid templateColumns="repeat(7, 1fr)" gap={1} textAlign="center">
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <Flex key={day} h="32px" align="center" justify="center" borderRadius="full" bg={day === 8 ? "purple.500" : "transparent"} color={day === 8 ? "white" : "text-secondary"} fontSize="sm" cursor="default">
                  {day}
                </Flex>
              ))}
            </Grid>
          </Box>

          {/* 2. MIDDLE CARD: Toggle between Summary AND Form */}
          <Box bg="card-bg" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
            {submitting ? (
              <Flex align="center" justify="center" h="full" minH="200px">
                <Spinner color="purple.500" size="lg" />
              </Flex>
            ) : isRequesting ? (
              <LeaveRequestForm 
                onCancel={() => setIsRequesting(false)} 
                onSubmit={handleRequestSubmit}
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
                  <Text fontSize="xs" fontWeight="semibold" color="text-secondary" mb={1}>
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
          <Box bg="card-bg" p={6} borderRadius="lg" shadow="sm" borderWidth="1px">
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
                  <Text fontSize="xs" color="text-secondary">{m.dates}</Text>
                </Flex>
              ))}
            </VStack>
          </Box>
        </SimpleGrid>

        {/* BOTTOM: ACTIONS CARD */}
        <Box bg="card-bg" p={8} borderRadius="lg" shadow="sm" borderWidth="1px">
          <VStack spacing={6} align="stretch">
            
            {/* Leave Approval Status */}
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontSize="md" fontWeight="semibold">Leave Approval Status</Text>
                <Text fontSize="sm" color="text-muted">Check status of your leave request</Text>
              </Box>
              <HRMSButton 
                colorScheme="blue" 
                onClick={() => navigate('/leaves/submit-status')}
              >
                Check
              </HRMSButton>
            </Flex>
            
            {!isEmployeeMode && (
              <>
                <Divider />

                {/* Approve Leaves */}
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontSize="md" fontWeight="semibold">Approve Leaves</Text>
                    <Text fontSize="sm" color="text-muted">Check requests and approve leaves</Text>
                  </Box>
                  <HRMSButton 
                    colorScheme="blue" 
                    onClick={() => navigate('/leaves/requests')}
                  >
                    Check
                  </HRMSButton>
                </Flex>
              </>
            )}

            {role === "hr" && (
              <>
                <Divider />

                {/* Define Rules */}
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontSize="md" fontWeight="semibold">Define Rules</Text>
                    <Text fontSize="sm" color="text-muted">Notice Period Before Leave, Approval Flow and more</Text>
                  </Box>
                  <HRMSButton 
                    variant="outline" 
                    colorScheme="blue" 
                    onClick={() => navigate('/leaves/rules')}
                  >
                    Edit
                  </HRMSButton>
                </Flex>
              </>
            )}
          </VStack>
        </Box>
      </VStack>
    </DashboardLayout>
  );
};

export default LeavesDashboardPage;
