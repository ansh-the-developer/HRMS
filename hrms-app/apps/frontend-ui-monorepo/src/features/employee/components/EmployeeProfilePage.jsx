import React, { useState, useEffect } from "react";
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
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Center,
  Icon,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiUser,
} from "react-icons/fi";
import { MdOutlineShield } from "react-icons/md";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import { useUpdateEmployee } from "@/hooks/useEmployees";
import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import EmployeeMasterForm from "./EmployeeMasterForm";
import { useRole } from "@/hooks/useRole";
import { useAuth } from "@/hooks/useAuth";

const Card = ({ children, title, icon }) => (
  <Box
    bg="card-bg"
    border="1px solid"
    borderColor="border-color"
    borderRadius="2xl"
    p={5}
    shadow="sm"
  >
    <HStack spacing={3} mb={4}>
      {icon}
      <Text fontSize="sm" fontWeight="bold" color="text-primary">
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
    borderColor="border-color"
  >
    <Text
      fontSize="xs"
      color="text-muted"
      textTransform="uppercase"
      letterSpacing="wider"
    >
      {label}
    </Text>
    <Text fontSize="sm" color="text-primary" textAlign="right" maxW="60%">
      {value || "—"}
    </Text>
  </HStack>
);

export default function EmployeeProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { isHR, isManager, isEmployee } = useRole();
  const { user } = useAuth();
  
  const targetId = isEmployee ? (user?.id || id) : (id || user?.id);
  const { data, isLoading, isError, error } = useEmployeeProfile(targetId, user?.email);
  const updateMutation = useUpdateEmployee();

  // Edit Mode toggle
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [presentAddress, setPresentAddress] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [employeeType, setEmployeeType] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [monthlyCtc, setMonthlyCtc] = useState("");

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");

  // Sync state variables once data loads from database
  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setBirthdate(data.birthdate || "");
      setMaritalStatus(data.marital_status || "");
      setPersonalNumber(data.personal_number || "");
      setPresentAddress(data.present_address || "");
      setBloodGroup(data.blood_group || "");
      setEmergencyContact(data.emergency_contact || "");
      
      setDepartment(data.department || "");
      setDesignation(data.designation || "");
      setEmployeeType(data.employee_type || "");
      setEmpCode(data.emp_code || "");
      setWorkLocation(data.work_location || "");
      setMonthlyCtc(data.monthly_ctc || "");

      setBankName(data.banking?.primary_bank?.bank_name || "");
      setAccountNumber(data.banking?.primary_bank?.account_number || "");
      setIfscCode(data.banking?.primary_bank?.ifsc_code || "");
    }
  }, [data]);

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
    (!!user?.id && String(targetId) === String(user.id)) ||
    (!!user?.id && !!employee?.auth_user_id && String(user.id) === String(employee.auth_user_id)) ||
    (!!user?.email && !!employee?.email && employee.email.toLowerCase() === user.email.toLowerCase());

  // If profile data is loading or being resolved for logged-in user
  if (isLoading || (!data && (isEmployee || String(targetId) === String(user?.id)))) {
    return (
      <DashboardLayout pageTitle="My Profile">
        <Flex minH="60vh" align="center" justify="center">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      </DashboardLayout>
    );
  }

  // In Employee Mode, restrict viewing other employees' profiles
  if (isEmployee && !isOwnProfile && data) {
    return <Navigate to={`/employees/${user?.id || ""}`} replace />;
  }

  const canViewProfile = isHR || isManager || isOwnProfile || (isEmployee && String(targetId) === String(user?.id));
  const canViewSensitiveSections = isHR || isOwnProfile;
  const canOpenDocuments = isHR || isOwnProfile;

  if (!canViewProfile) {
    return <Navigate to="/home" replace />;
  }

  const handleSave = async () => {
    try {
      const bankingPayload = {
        ...employee.banking,
        primary_bank: {
          bank_name: bankName,
          account_number: accountNumber,
          ifsc_code: ifscCode,
        }
      };

      const updates = {
        name,
        birthdate,
        marital_status: maritalStatus,
        personal_number: personalNumber,
        present_address: presentAddress,
        blood_group: bloodGroup,
        emergency_contact: emergencyContact,
        banking: bankingPayload,
      };

      // HR can edit corporate fields
      if (isHR) {
        updates.department = department;
        updates.designation = designation;
        updates.employee_type = employeeType;
        updates.emp_code = empCode;
        updates.work_location = workLocation;
        updates.monthly_ctc = monthlyCtc ? parseFloat(monthlyCtc) : null;
      }

      await updateMutation.mutateAsync({ id: employee.id, updates });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Update Failed",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6} bg="transparent" minH="100vh">
        <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={3}>
          {/* Back button only for HR/Manager looking at list */}
          {!isEmployee ? (
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              color="text-secondary"
              fontWeight="medium"
              onClick={() => navigate("/employees")}
            >
              Back to Employees
            </Button>
          ) : (
            <Box />
          )}

          <HStack spacing={3} wrap="wrap">
            {isHR && (
              <Badge colorScheme="purple" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                HR Access
              </Badge>
            )}

            {isManager && !isHR && (
              <Badge colorScheme="blue" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                Manager View
              </Badge>
            )}

            {isEmployee && isOwnProfile && !isHR && (
              <Badge colorScheme="green" px={3} py={1} borderRadius="full" fontSize="xs" fontWeight="bold">
                My Profile
              </Badge>
            )}

            {/* Edit action buttons under RBAC */}
            {isHR && (
              <Button
                size="sm"
                bg="purple.500"
                color="white"
                _hover={{ bg: "purple.600" }}
                onClick={() => setIsEditing(true)}
                leftIcon={<FiFileText />}
              >
                Edit Profile
              </Button>
            )}
          </HStack>
        </Flex>

        {!isHR && (
          <Alert status="info" borderRadius="xl" mb={6}>
            <AlertIcon />
            {isManager
              ? "You have view-only access to this employee profile."
              : "You can only view your own employee profile. Some official fields are read-only."}
          </Alert>
        )}

        <Box
          bg="card-bg"
          borderRadius="2xl"
          p={6}
          border="1px solid"
          borderColor="border-color"
          mb={6}
          shadow="sm"
        >
          <Flex align="center" gap={5} wrap="wrap">
            <Avatar
              size="xl"
              name={name || employee.name}
              src={employee.documents?.photo_url || ""}
            />
            <Box flex="1">
              <Heading size="lg" color="text-primary">
                {name || employee.name || "Unnamed Employee"}
              </Heading>
              <HStack spacing={1} mt={1} mb={3} wrap="wrap">
                <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                  {designation || employee.designation || "—"}
                </Badge>
                <Badge colorScheme="gray" variant="subtle" fontSize="xs">
                  {department || employee.department || "—"}
                </Badge>
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  {employeeType || employee.employee_type || "—"}
                </Badge>
              </HStack>
              <HStack spacing={5} wrap="wrap">
                <HStack spacing={1} color="text-muted">
                  <FiMail size={13} />
                  <Text fontSize="sm">{employee.email || "—"}</Text>
                </HStack>
                <HStack spacing={1} color="text-muted">
                  <FiPhone size={13} />
                  <Text fontSize="sm">{personalNumber || employee.personal_number || "—"}</Text>
                </HStack>
                <HStack spacing={1} color="text-muted">
                  <FiMapPin size={13} />
                  <Text fontSize="sm">{workLocation || employee.work_location || "—"}</Text>
                </HStack>
              </HStack>
            </Box>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Card 1: Personal KYC */}
          <Card title="Personal Identity (KYC)" icon={<FiFileText color="#7C3AED" />}>
            {isEditing ? (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Full Name</FormLabel>
                  <Input size="sm" borderRadius="md" value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">DOB</FormLabel>
                  <Input size="sm" type="date" borderRadius="md" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Marital Status</FormLabel>
                  <Select size="sm" borderRadius="md" value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)}>
                    <option value="">—</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Personal Number</FormLabel>
                  <Input size="sm" borderRadius="md" value={personalNumber} onChange={(e) => setPersonalNumber(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Present Address</FormLabel>
                  <Input size="sm" borderRadius="md" value={presentAddress} onChange={(e) => setPresentAddress(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Blood Group</FormLabel>
                  <Input size="sm" borderRadius="md" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Emergency Contact</FormLabel>
                  <Input size="sm" borderRadius="md" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
                </FormControl>
              </VStack>
            ) : (
              <>
                <Row label="Full Name" value={employee.name} />
                <Row label="DOB" value={employee.birthdate} />
                <Row label="Marital Status" value={employee.marital_status} />
                <Row label="Personal Number" value={employee.personal_number} />
                <Row label="Present Address" value={employee.present_address} />
                <Row label="Blood Group" value={employee.blood_group} />
                <Row label="Emergency Contact" value={employee.emergency_contact} />
              </>
            )}
          </Card>

          {/* Card 2: Corporate Identity */}
          <Card title="Corporate Identity" icon={<FiFileText color="#7C3AED" />}>
            {isEditing && isHR ? (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Official Email</FormLabel>
                  <Input size="sm" borderRadius="md" value={employee.email || ""} isDisabled />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Department</FormLabel>
                  <Input size="sm" borderRadius="md" value={department} onChange={(e) => setDepartment(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Designation</FormLabel>
                  <Input size="sm" borderRadius="md" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">EMP Type</FormLabel>
                  <Input size="sm" borderRadius="md" value={employeeType} onChange={(e) => setEmployeeType(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">EMP ID</FormLabel>
                  <Input size="sm" borderRadius="md" value={empCode} onChange={(e) => setEmpCode(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Location</FormLabel>
                  <Input size="sm" borderRadius="md" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">Monthly CTC</FormLabel>
                  <Input size="sm" borderRadius="md" type="number" value={monthlyCtc} onChange={(e) => setMonthlyCtc(e.target.value)} />
                </FormControl>
              </VStack>
            ) : (
              <>
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
              </>
            )}
          </Card>

          {/* Card 3: Statutory & Compliance */}
          <Card title="Statutory & Compliance" icon={<MdOutlineShield color="#7C3AED" />}>
            <Row
              label="EPFO UAN"
              value={canViewSensitiveSections ? employee.compliance?.epfo_uan : "Restricted"}
            />
            <Row
              label="PRAN"
              value={canViewSensitiveSections ? employee.compliance?.pran : "Restricted"}
            />
            <Row
              label="ESIC IP"
              value={canViewSensitiveSections ? employee.compliance?.esic_ip : "Restricted"}
            />
            <Row
              label="PAN"
              value={canViewSensitiveSections ? employee.compliance?.pan : "Restricted"}
            />
            <Row
              label="E-SHRAM UAN"
              value={canViewSensitiveSections ? employee.compliance?.e_shram_uan : "Restricted"}
            />
          </Card>

          {/* Card 4: Banking Details */}
          <Card title="Banking Details" icon={<MdOutlineShield color="#7C3AED" />}>
            {canViewSensitiveSections ? (
              isEditing ? (
                <VStack spacing={4} align="stretch">
                  <Text fontSize="xs" fontWeight="bold" color="purple.500" textTransform="uppercase" letterSpacing="wider">
                    Primary Salary Account
                  </Text>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="bold">Bank Name</FormLabel>
                    <Input size="sm" borderRadius="md" value={bankName} onChange={(e) => setBankName(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="bold">Account Number</FormLabel>
                    <Input size="sm" borderRadius="md" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="xs" fontWeight="bold">IFSC</FormLabel>
                    <Input size="sm" borderRadius="md" value={ifscCode} onChange={(e) => setIfscCode(e.target.value)} />
                  </FormControl>
                </VStack>
              ) : (
                <>
                  <Text fontSize="xs" fontWeight="bold" color="purple.500" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Primary Salary Account
                  </Text>
                  <Row label="Bank Name" value={employee.banking?.primary_bank?.bank_name} />
                  <Row label="Account Number" value={employee.banking?.primary_bank?.account_number} />
                  <Row label="IFSC" value={employee.banking?.primary_bank?.ifsc_code} />
                  <Divider my={4} />
                  <Text fontSize="xs" fontWeight="bold" color="text-muted" textTransform="uppercase" letterSpacing="wider" mb={2}>
                    Secondary (Reimbursements)
                  </Text>
                  <Row label="Bank Name" value={employee.banking?.secondary_bank?.bank_name} />
                  <Row label="Account Number" value={employee.banking?.secondary_bank?.account_number} />
                  <Row label="IFSC" value={employee.banking?.secondary_bank?.ifsc_code} />
                </>
              )
            ) : (
              <Text fontSize="sm" color="text-muted">
                Banking details are restricted to HR and the employee who owns this profile.
              </Text>
            )}
          </Card>

          {/* Verification Vault */}
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
                      <Text fontSize="xs" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="wider" mb={2}>
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
                      <Text fontSize="xs" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="wider" mb={2}>
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
                  <Text fontSize="xs" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="wider" mb={3}>
                    Documents
                  </Text>
                  <VStack align="stretch" spacing={0}>
                    <HStack justify="space-between" py={3} borderBottom="1px solid" borderColor="whiteAlpha.100">
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

                    <HStack justify="space-between" py={3} borderBottom="1px solid" borderColor="whiteAlpha.100">
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

      {isHR && (
        <EmployeeMasterForm
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          employee={data}
        />
      )}
    </DashboardLayout>
  );
}