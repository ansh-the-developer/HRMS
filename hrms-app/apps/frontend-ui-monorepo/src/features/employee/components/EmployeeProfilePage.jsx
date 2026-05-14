import React from "react";
import {
  Box,
  Flex,
  Text,
  Heading,
  Avatar,
  Badge,
  Button,
  Divider,
  VStack,
  HStack,
  SimpleGrid,
  Link,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
} from "react-icons/fi";
import { MdOutlineShield } from "react-icons/md";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";

const Card = ({ children, title, icon }) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor="gray.200"
    borderRadius="2xl"
    p={5}
    shadow="sm"
  >
    <HStack spacing={3} mb={4}>
      {icon}
      <Text fontSize="sm" fontWeight="bold" color="gray.800">
        {title}
      </Text>
    </HStack>
    {children}
  </Box>
);

const Row = ({ label, value }) => (
  <HStack
    justify="space-between"
    align="start"
    py={2}
    borderBottom="1px solid"
    borderColor="gray.100"
  >
    <Text
      fontSize="xs"
      color="gray.500"
      textTransform="uppercase"
      letterSpacing="wider"
    >
      {label}
    </Text>
    <Text fontSize="sm" color="gray.800" textAlign="right" maxW="60%">
      {value || "—"}
    </Text>
  </HStack>
);

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isHR, isManager, isEmployee } = useRole();
  const { user } = useAuth();

  const { data, isLoading, isError, error } = useEmployeeProfile(id);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Flex minH="60vh" align="center" justify="center">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <Box p={8}>
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            {error?.message || "Failed to load employee profile"}
          </Alert>
        </Box>
      </DashboardLayout>
    );
  }

  const employee = data || {};
  const isOwnProfile =
    !!user?.id &&
    !!employee?.auth_user_id &&
    String(user.id) === String(employee.auth_user_id);

  const canViewProfile = isHR || isManager || (isEmployee && isOwnProfile);
  const canViewSensitiveSections = isHR || isOwnProfile;
  const canOpenDocuments = isHR || isOwnProfile;

  if (!canViewProfile) {
    return <Navigate to="/employees" replace />;
  }

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6} bg="gray.50" minH="100vh">
        <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            color="gray.600"
            fontWeight="medium"
            onClick={() => navigate("/employees")}
          >
            Back to Employees
          </Button>

          <HStack spacing={2} wrap="wrap">
            {isHR && (
              <Badge
                colorScheme="purple"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
              >
                HR Access
              </Badge>
            )}

            {isManager && !isHR && (
              <Badge
                colorScheme="blue"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
              >
                Manager View
              </Badge>
            )}

            {isEmployee && isOwnProfile && !isHR && (
              <Badge
                colorScheme="green"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="xs"
                fontWeight="bold"
              >
                My Profile
              </Badge>
            )}
          </HStack>
        </Flex>

        {!isHR && (
          <Alert status="info" borderRadius="xl" mb={6}>
            <AlertIcon />
            {isManager
              ? "You have view-only access to this employee profile."
              : "You can only view your own employee profile."}
          </Alert>
        )}

        <Box
          bg="white"
          borderRadius="2xl"
          p={6}
          border="1px solid"
          borderColor="gray.200"
          mb={6}
          shadow="sm"
        >
          <Flex align="center" gap={5} wrap="wrap">
            <Avatar
              size="xl"
              name={employee.name}
              src={employee.documents?.photo_url || ""}
            />
            <Box flex="1">
              <Heading size="lg" color="gray.900">
                {employee.name || "Unnamed Employee"}
              </Heading>
              <HStack spacing={1} mt={1} mb={3} wrap="wrap">
                <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                  {employee.designation || "—"}
                </Badge>
                <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                  {employee.department || "—"}
                </Badge>
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  {employee.employee_type || "—"}
                </Badge>
              </HStack>
              <HStack spacing={5} wrap="wrap">
                <HStack spacing={1} color="gray.500">
                  <FiMail size={13} />
                  <Text fontSize="sm">{employee.email || "—"}</Text>
                </HStack>
                <HStack spacing={1} color="gray.500">
                  <FiPhone size={13} />
                  <Text fontSize="sm">{employee.personal_number || "—"}</Text>
                </HStack>
                <HStack spacing={1} color="gray.500">
                  <FiMapPin size={13} />
                  <Text fontSize="sm">{employee.work_location || "—"}</Text>
                </HStack>
              </HStack>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card title="Personal Identity (KYC)" icon={<FiFileText color="#7C3AED" />}>
            <Row label="Full Name" value={employee.name} />
            <Row label="DOB" value={employee.birthdate} />
            <Row label="Marital Status" value={employee.marital_status} />
            <Row label="Personal Number" value={employee.personal_number} />
            <Row label="Present Address" value={employee.present_address} />
            <Row label="Blood Group" value={employee.blood_group} />
            <Row label="Emergency Contact" value={employee.emergency_contact} />
          </Card>

          <Card title="Corporate Identity" icon={<FiFileText color="#7C3AED" />}>
            <Row label="Official Email" value={employee.email} />
            <Row label="Department" value={employee.department} />
            <Row label="Designation" value={employee.designation} />
            <Row label="EMP Type" value={employee.employee_type} />
            <Row label="EMP ID" value={employee.emp_code} />
            <Row label="Location" value={employee.work_location} />
            <Row
              label="Monthly CTC"
              value={
                canViewSensitiveSections && employee.monthly_ctc
                  ? `₹${Number(employee.monthly_ctc).toLocaleString("en-IN")}`
                  : canViewSensitiveSections
                    ? "—"
                    : "Restricted"
              }
            />
          </Card>

          <Card title="Statutory & Compliance" icon={<MdOutlineShield color="#7C3AED" />}>
            <Row
              label="EPFO UAN"
              value={
                canViewSensitiveSections
                  ? employee.compliance?.epfo_uan
                  : "Restricted"
              }
            />
            <Row
              label="PRAN"
              value={
                canViewSensitiveSections ? employee.compliance?.pran : "Restricted"
              }
            />
            <Row
              label="ESIC IP"
              value={
                canViewSensitiveSections
                  ? employee.compliance?.esic_ip
                  : "Restricted"
              }
            />
            <Row
              label="PAN"
              value={
                canViewSensitiveSections ? employee.compliance?.pan : "Restricted"
              }
            />
            <Row
              label="E-SHRAM UAN"
              value={
                canViewSensitiveSections
                  ? employee.compliance?.e_shram_uan
                  : "Restricted"
              }
            />
          </Card>

          <Card title="Banking Details" icon={<MdOutlineShield color="#7C3AED" />}>
            {canViewSensitiveSections ? (
              <>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="purple.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Primary Salary Account
                </Text>
                <Row
                  label="Bank Name"
                  value={employee.banking?.primary_bank?.bank_name}
                />
                <Row
                  label="Account Number"
                  value={employee.banking?.primary_bank?.account_number}
                />
                <Row
                  label="IFSC"
                  value={employee.banking?.primary_bank?.ifsc_code}
                />
                <Divider my={4} />
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={2}
                >
                  Secondary (Reimbursements)
                </Text>
                <Row
                  label="Bank Name"
                  value={employee.banking?.secondary_bank?.bank_name}
                />
                <Row
                  label="Account Number"
                  value={employee.banking?.secondary_bank?.account_number}
                />
                <Row
                  label="IFSC"
                  value={employee.banking?.secondary_bank?.ifsc_code}
                />
              </>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Banking details are restricted to HR and the employee who owns this profile.
              </Text>
            )}
          </Card>

          <Box
            bg="#182140"
            borderRadius="2xl"
            p={5}
            border="1px solid"
            borderColor="whiteAlpha.100"
            gridColumn={{ base: "1", lg: "1 / -1" }}
          >
            <HStack spacing={3} mb={5}>
              <MdOutlineShield size={20} color="#60A5FA" />
              <Text fontWeight="bold" color="white" fontSize="md">
                Verification Vault
              </Text>
            </HStack>

            {canViewSensitiveSections ? (
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <VStack align="start" spacing={4}>
                  {employee.documents?.photo_url ? (
                    <Box>
                      <Text
                        fontSize="xs"
                        color="whiteAlpha.600"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        mb={2}
                      >
                        Employee Photo
                      </Text>
                      <Box
                        as="img"
                        src={employee.documents.photo_url}
                        alt="Employee"
                        h="120px"
                        w="120px"
                        objectFit="cover"
                        borderRadius="xl"
                      />
                    </Box>
                  ) : (
                    <Text fontSize="sm" color="whiteAlpha.400">
                      No photo uploaded
                    </Text>
                  )}

                  {employee.documents?.signature_url ? (
                    <Box>
                      <Text
                        fontSize="xs"
                        color="whiteAlpha.600"
                        textTransform="uppercase"
                        letterSpacing="wider"
                        mb={2}
                      >
                        Signature
                      </Text>
                      <Box
                        as="img"
                        src={employee.documents.signature_url}
                        alt="Signature"
                        h="60px"
                        w="180px"
                        objectFit="contain"
                        borderRadius="lg"
                        bg="whiteAlpha.100"
                        p={2}
                      />
                    </Box>
                  ) : (
                    <Text fontSize="sm" color="whiteAlpha.400">
                      No signature uploaded
                    </Text>
                  )}
                </VStack>

                <Box>
                  <Text
                    fontSize="xs"
                    color="whiteAlpha.600"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={3}
                  >
                    Documents
                  </Text>
                  <VStack align="stretch" spacing={0}>
                    <HStack
                      justify="space-between"
                      py={3}
                      borderBottom="1px solid"
                      borderColor="whiteAlpha.100"
                    >
                      <Text fontSize="sm" color="whiteAlpha.800">
                        Government Docs
                      </Text>
                      {employee.documents?.gov_id_proof && canOpenDocuments ? (
                        <Link
                          href={employee.documents.gov_id_proof}
                          isExternal
                          color="blue.300"
                          fontSize="sm"
                          fontWeight="semibold"
                        >
                          Open ↗
                        </Link>
                      ) : (
                        <Text fontSize="sm" color="whiteAlpha.300">
                          Not available
                        </Text>
                      )}
                    </HStack>

                    <HStack
                      justify="space-between"
                      py={3}
                      borderBottom="1px solid"
                      borderColor="whiteAlpha.100"
                    >
                      <Text fontSize="sm" color="whiteAlpha.800">
                        Employment Dossier
                      </Text>
                      {employee.documents?.employment_docs && canOpenDocuments ? (
                        <Link
                          href={employee.documents.employment_docs}
                          isExternal
                          color="blue.300"
                          fontSize="sm"
                          fontWeight="semibold"
                        >
                          Open ↗
                        </Link>
                      ) : (
                        <Text fontSize="sm" color="whiteAlpha.300">
                          Not available
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                </Box>
              </SimpleGrid>
            ) : (
              <Text fontSize="sm" color="whiteAlpha.700">
                Verification documents are restricted to HR and the employee who owns this profile.
              </Text>
            )}
          </Box>
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  );
}