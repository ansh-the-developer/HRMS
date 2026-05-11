import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Input,
  Select,
  VStack,
  HStack,
  Button,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { FiUpload, FiImage, FiEdit2 } from "react-icons/fi";
import { MdOutlineShield } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { supabase } from "@/lib/supabaseClient";
import {
  createEmployeeProfile,
  updateEmployeeProfile,
  uploadFile,
} from "@/services/employeeApi";
import { useRole } from "@/hooks/useRole";

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

const SectionHeader = ({ title }) => (
  <Flex align="center" gap={3} mb={5}>
    <Box w="3px" h="14px" bg="purple.600" borderRadius="full" flexShrink={0} />
    <Text
      fontSize="2xs"
      fontWeight="bold"
      color="purple.600"
      letterSpacing="widest"
      textTransform="uppercase"
    >
      {title}
    </Text>
  </Flex>
);

const FieldLabel = ({ children }) => (
  <Text
    fontSize="2xs"
    fontWeight="semibold"
    color="gray.500"
    textTransform="uppercase"
    letterSpacing="wider"
    mb={1}
  >
    {children}
  </Text>
);

const iStyle = {
  bg: "gray.50",
  border: "1px solid",
  borderColor: "gray.200",
  borderRadius: "lg",
  fontSize: "sm",
  h: "40px",
  _placeholder: { color: "gray.400", fontSize: "sm" },
  _focus: {
    borderColor: "purple.400",
    bg: "white",
    boxShadow: "0 0 0 1px #7152F3",
  },
};

const UploadBox = ({
  label,
  hint,
  Icon,
  accept,
  onChange,
  previewUrl,
  fileName,
}) => {
  const inputRef = useRef(null);
  const IconComponent = Icon || FiUpload;

  return (
    <Box>
      <Text
        fontSize="2xs"
        fontWeight="semibold"
        color="whiteAlpha.600"
        textTransform="uppercase"
        letterSpacing="wider"
        mb={2}
      >
        {label}
      </Text>

      <Flex
        role="button"
        tabIndex={0}
        border="2px dashed"
        borderColor={fileName ? "blue.400" : "whiteAlpha.300"}
        borderRadius="xl"
        p={6}
        direction="column"
        align="center"
        justify="center"
        cursor="pointer"
        gap={2}
        bg={fileName ? "whiteAlpha.200" : "transparent"}
        _hover={{ borderColor: "whiteAlpha.500", bg: "whiteAlpha.100" }}
        _focusVisible={{ boxShadow: "0 0 0 2px rgba(96,165,250,0.8)" }}
        transition="all 0.2s"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => onChange?.(e.target.files?.[0] ?? null)}
        />

        {previewUrl && accept?.includes("image") ? (
          <Box
            as="img"
            src={previewUrl}
            h="60px"
            w="60px"
            objectFit="cover"
            borderRadius="md"
            alt="preview"
          />
        ) : (
          <IconComponent
            size={22}
            color={fileName ? "#60A5FA" : "rgba(255,255,255,0.4)"}
          />
        )}

        <Text
          fontSize="xs"
          color={fileName ? "blue.300" : "whiteAlpha.500"}
          textAlign="center"
          noOfLines={1}
          maxW="150px"
        >
          {fileName || hint}
        </Text>
      </Flex>
    </Box>
  );
};

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: "",
  email: "",
  department: "",
  designation: "",
  birthdate: "",
};

const INITIAL_UI = {
  marital_status: "Single",
  personal_number: "",
  present_address: "",
  emp_type: "Permanent",
  location: "",
  emp_id: "",
  monthly_ctc: "",
  blood_group: "",
  emergency_contact: "",
  epfo_uan: "",
  pran: "",
  esic_ip: "",
  pan: "",
  e_shram_uan: "",
  primary_bank_name: "",
  primary_account_number: "",
  primary_ifsc: "",
  secondary_bank_name: "",
  secondary_account_number: "",
  secondary_ifsc: "",
  portal_password: "",
  role: "employee",
  temp_password: "",
};

const INITIAL_FILES = {
  gov_id_proof: null,
  employment_docs: null,
  photo_url: null,
  signature_url: null,
};

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────

const EmployeeMasterForm = ({ isOpen, onClose, employee, onSuccess }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isHR } = useRole();

  const [form, setForm] = useState(INITIAL_FORM);
  const [ui, setUi] = useState(INITIAL_UI);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [isPending, setIsPending] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [signPreview, setSignPreview] = useState("");

  const isEditing = !!employee;

  const setF = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));
  const setU = (field) => (e) =>
    setUi((p) => ({ ...p, [field]: e.target.value }));
  const setFile = (field) => (file) =>
    setFiles((p) => ({ ...p, [field]: file }));

  const resetAll = () => {
    setForm(INITIAL_FORM);
    setUi(INITIAL_UI);
    setFiles(INITIAL_FILES);
    setPhotoPreview("");
    setSignPreview("");
  };

  useEffect(() => {
    if (!isOpen) return;

    if (employee) {
      setForm({
        name: employee.name || "",
        email: employee.email || "",
        department: employee.department || "",
        designation: employee.designation || "",
        birthdate: employee.birthdate || "",
      });

      setUi({
        ...INITIAL_UI,
        personal_number: employee.personal_number || "",
        present_address: employee.present_address || "",
        emp_id: employee.emp_code || "",
        emp_type: employee.employee_type || "Permanent",
        location: employee.work_location || "",
        monthly_ctc: employee.monthly_ctc || "",
        blood_group: employee.blood_group || "",
        emergency_contact: employee.emergency_contact || "",
        epfo_uan: employee.compliance?.epfo_uan || "",
        pran: employee.compliance?.pran || "",
        esic_ip: employee.compliance?.esic_ip || "",
        pan: employee.compliance?.pan || "",
        e_shram_uan: employee.compliance?.e_shram_uan || "",
        primary_bank_name: employee.banking?.primary_bank?.bank_name || "",
        primary_account_number:
          employee.banking?.primary_bank?.account_number || "",
        primary_ifsc: employee.banking?.primary_bank?.ifsc_code || "",
        secondary_bank_name: employee.banking?.secondary_bank?.bank_name || "",
        secondary_account_number:
          employee.banking?.secondary_bank?.account_number || "",
        secondary_ifsc: employee.banking?.secondary_bank?.ifsc_code || "",
        role: employee.role || "employee",
        temp_password: "",
      });

      setFiles(INITIAL_FILES);
      setPhotoPreview(employee.documents?.photo_url || "");
      setSignPreview(employee.documents?.signature_url || "");
    } else {
      resetAll();
    }
  }, [employee, isOpen]);

  useEffect(() => {
    if (!files.photo_url) {
      setPhotoPreview(employee?.documents?.photo_url || "");
      return;
    }

    const url = URL.createObjectURL(files.photo_url);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [files.photo_url]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!files.signature_url) {
      setSignPreview(employee?.documents?.signature_url || "");
      return;
    }

    const url = URL.createObjectURL(files.signature_url);
    setSignPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [files.signature_url]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    if (!isHR) {
      toast({
        title: "Access denied",
        description: "Only HR can create or edit employee records.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (!form.name.trim()) {
      toast({
        title: "Full name is required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (!form.email.trim()) {
      toast({
        title: "Official email is required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    if (!isEditing && !ui.temp_password.trim()) {
      toast({
        title: "Temporary password is required",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsPending(true);

    try {
      const employeePayload = {
        name: form.name.trim(),
        email: form.email.trim() || null,
        department: form.department || null,
        designation: form.designation || null,
        birthdate: form.birthdate || null,
        monthly_ctc: ui.monthly_ctc || null,
        blood_group: ui.blood_group || null,
        emergency_contact: ui.emergency_contact || null,
        work_location: ui.location || null,
        employee_type: ui.emp_type || null,
        emp_code: ui.emp_id || null,
        personal_number: ui.personal_number || null,
        present_address: ui.present_address || null,
      };

      const compliancePayload = {
        epfo_uan: ui.epfo_uan || null,
        pan: ui.pan || null,
        pran: ui.pran || null,
        esic_ip: ui.esic_ip || null,
        e_shram_uan: ui.e_shram_uan || null,
      };

      const bankingPayload = {
        primary_bank: {
          bank_name: ui.primary_bank_name || "",
          account_number: ui.primary_account_number || "",
          ifsc_code: ui.primary_ifsc || "",
        },
        secondary_bank: {
          bank_name: ui.secondary_bank_name || "",
          account_number: ui.secondary_account_number || "",
          ifsc_code: ui.secondary_ifsc || "",
        },
      };

      let savedEmployee;

      if (isEditing) {
        savedEmployee = await updateEmployeeProfile(employee.id, {
          employee: employeePayload,
          compliance: compliancePayload,
          banking: bankingPayload,
        });
      } else {
        const { data, error } = await supabase.functions.invoke(
          "create-employee-user",
          {
            body: {
              email: form.email.trim(),
              full_name: form.name.trim(),
              temp_password: ui.temp_password,
              role: ui.role,
            },
          }
        );

        if (error) throw error;

        const authUserId = data?.user_id;
        if (!authUserId) {
          throw new Error("No user_id returned from create-employee-user");
        }

        savedEmployee = await createEmployeeProfile({
          employee: { ...employeePayload, auth_user_id: authUserId },
          compliance: compliancePayload,
          banking: bankingPayload,
        });
      }

      const empId = savedEmployee?.id;
      if (!empId) throw new Error("Employee record did not return an id");

      const govUrl = files.gov_id_proof
        ? await uploadFile("employee-docs", files.gov_id_proof, empId)
        : employee?.documents?.gov_id_proof || null;

      const empDocUrl = files.employment_docs
        ? await uploadFile("employee-docs", files.employment_docs, empId)
        : employee?.documents?.employment_docs || null;

      const photoUrl = files.photo_url
        ? await uploadFile("employee-photos", files.photo_url, empId)
        : employee?.documents?.photo_url || null;

      const signUrl = files.signature_url
        ? await uploadFile("employee-signatures", files.signature_url, empId)
        : employee?.documents?.signature_url || null;

      if (govUrl || empDocUrl || photoUrl || signUrl) {
        await updateEmployeeProfile(empId, {
          documents: {
            gov_id_proof: govUrl,
            employment_docs: empDocUrl,
            photo_url: photoUrl,
            signature_url: signUrl,
          },
        });
      }

      toast({
        title: isEditing ? "Employee updated!" : "Employee created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess?.();
      handleClose();
    } catch (err) {
      toast({
        title: "Error saving record",
        description: err?.message || "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsPending(false);
    }
  };

  // ── handle close (reset state) ────────────────────────
  const handleClose = () => {
    resetAll();
    onClose();
  };

  if (!isHR) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius="2xl"
        mx={4}
        my={6}
        maxH="90vh"
        overflow="hidden"
      >
        <ModalHeader pb={3} pt={6} px={8}>
          <Text fontSize="xl" fontWeight="bold" color="gray.900">
            {isEditing
              ? `Modifying: ${employee?.name || "Employee"}`
              : "Create New Master Record"}
          </Text>
          <Text
            fontSize="2xs"
            fontWeight="bold"
            color="purple.500"
            letterSpacing="widest"
            textTransform="uppercase"
            mt={1}
          >
            Compliance & Financial Management
          </Text>
        </ModalHeader>

        <ModalCloseButton top={5} right={6} />
        <Divider borderColor="gray.100" />

        <ModalBody px={8} py={6} overflowY="auto">
          <VStack spacing={8} align="stretch">
            <Box>
              <SectionHeader title="Personal Identity (KYC)" />
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={4}
              >
                <GridItem>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input
                    {...iStyle}
                    value={form.name}
                    onChange={setF("name")}
                    placeholder="John Doe"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>DOB</FieldLabel>
                  <Input
                    {...iStyle}
                    type="date"
                    value={form.birthdate}
                    onChange={setF("birthdate")}
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>Marital Status</FieldLabel>
                  <Select
                    {...iStyle}
                    value={ui.marital_status}
                    onChange={setU("marital_status")}
                  >
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Select>
                </GridItem>

                <GridItem>
                  <FieldLabel>Personal Number</FieldLabel>
                  <Input
                    {...iStyle}
                    value={ui.personal_number}
                    onChange={setU("personal_number")}
                    placeholder="+91 99999 00000"
                  />
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <FieldLabel>Present Address</FieldLabel>
                  <Input
                    {...iStyle}
                    value={ui.present_address}
                    onChange={setU("present_address")}
                    placeholder="Full present address"
                  />
                </GridItem>
              </Grid>
            </Box>

            <Box>
              <SectionHeader title="Corporate Identity" />
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap={4}
              >
                <GridItem>
                  <FieldLabel>Official Email</FieldLabel>
                  <Input
                    {...iStyle}
                    type="email"
                    value={form.email}
                    onChange={setF("email")}
                    placeholder="john@company.com"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>EMP Type</FieldLabel>
                  <Select
                    {...iStyle}
                    value={ui.emp_type}
                    onChange={setU("emp_type")}
                  >
                    <option>Permanent</option>
                    <option>Contract</option>
                    <option>Intern</option>
                    <option>Probation</option>
                    <option>Freelancer</option>
                  </Select>
                </GridItem>

                <GridItem>
                  <FieldLabel>Role</FieldLabel>
                  <Select {...iStyle} value={ui.role} onChange={setU("role")}>
                    <option value="hr">HR</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </Select>
                </GridItem>

                {!isEditing && (
                  <GridItem>
                    <FieldLabel>Temporary Password</FieldLabel>
                    <Input
                      {...iStyle}
                      type="password"
                      value={ui.temp_password}
                      onChange={setU("temp_password")}
                      placeholder="Temporary password"
                    />
                  </GridItem>
                )}

                <GridItem>
                  <FieldLabel>Department</FieldLabel>
                  <Input
                    {...iStyle}
                    value={form.department}
                    onChange={setF("department")}
                    placeholder="e.g. Engineering"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>Designation</FieldLabel>
                  <Input
                    {...iStyle}
                    value={form.designation}
                    onChange={setF("designation")}
                    placeholder="e.g. Developer"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>Location</FieldLabel>
                  <Input
                    {...iStyle}
                    value={ui.location}
                    onChange={setU("location")}
                    placeholder="e.g. Delhi"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>EMP ID</FieldLabel>
                  <Input
                    {...iStyle}
                    value={ui.emp_id}
                    onChange={setU("emp_id")}
                    placeholder="e.g. CA-1005"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>Monthly CTC (₹)</FieldLabel>
                  <Input
                    {...iStyle}
                    type="number"
                    value={ui.monthly_ctc}
                    onChange={setU("monthly_ctc")}
                    placeholder="e.g. 50000"
                  />
                </GridItem>

                <GridItem>
                  <FieldLabel>Blood Group</FieldLabel>
                  <Select
                    {...iStyle}
                    value={ui.blood_group}
                    onChange={setU("blood_group")}
                  >
                    <option value="">— Select —</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (bg) => (
                        <option key={bg}>{bg}</option>
                      )
                    )}
                  </Select>
                </GridItem>

                <GridItem>
                  <FieldLabel>Emergency Contact</FieldLabel>
                  <Input
                    {...iStyle}
                    value={ui.emergency_contact}
                    onChange={setU("emergency_contact")}
                    placeholder="Name · Relation · Phone"
                  />
                </GridItem>
              </Grid>
            </Box>

            <Box>
              <SectionHeader title="Statutory & Compliance" />
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
                gap={3}
                mb={5}
              >
                {[
                  ["EPFO (UAN)", "epfo_uan", false],
                  ["PRAN", "pran", false],
                  ["ESIC IP", "esic_ip", false],
                  ["PAN", "pan", false],
                  ["E-SHRAM UAN", "e_shram_uan", true],
                ].map(([label, field, highlight]) => (
                  <GridItem key={field}>
                    <FieldLabel>{label}</FieldLabel>
                    <Input
                      {...iStyle}
                      bg={highlight ? "blue.50" : "gray.50"}
                      value={ui[field]}
                      onChange={(e) =>
                        setUi((p) => ({ ...p, [field]: e.target.value }))
                      }
                    />
                  </GridItem>
                ))}
              </Grid>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  p={4}
                >
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color="purple.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={3}
                  >
                    Primary Salary Account
                  </Text>

                  <VStack spacing={3}>
                    <Input
                      {...iStyle}
                      w="full"
                      placeholder="Bank Name"
                      value={ui.primary_bank_name}
                      onChange={setU("primary_bank_name")}
                    />
                    <Grid templateColumns="1fr 1fr" gap={3} w="full">
                      <Input
                        {...iStyle}
                        placeholder="Account Number"
                        value={ui.primary_account_number}
                        onChange={setU("primary_account_number")}
                      />
                      <Input
                        {...iStyle}
                        placeholder="IFSC Code"
                        value={ui.primary_ifsc}
                        onChange={setU("primary_ifsc")}
                      />
                    </Grid>
                  </VStack>
                </Box>

                <Box
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  p={4}
                >
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color="gray.500"
                    textTransform="uppercase"
                    letterSpacing="wider"
                    mb={3}
                  >
                    Secondary (Reimbursements)
                  </Text>

                  <VStack spacing={3}>
                    <Input
                      {...iStyle}
                      w="full"
                      placeholder="Bank Name"
                      value={ui.secondary_bank_name}
                      onChange={setU("secondary_bank_name")}
                    />
                    <Grid templateColumns="1fr 1fr" gap={3} w="full">
                      <Input
                        {...iStyle}
                        placeholder="Account Number"
                        value={ui.secondary_account_number}
                        onChange={setU("secondary_account_number")}
                      />
                      <Input
                        {...iStyle}
                        placeholder="IFSC Code"
                        value={ui.secondary_ifsc}
                        onChange={setU("secondary_ifsc")}
                      />
                    </Grid>
                  </VStack>
                </Box>
              </Grid>
            </Box>

            <Box bg="#182140" borderRadius="2xl" p={6}>
              <HStack spacing={3} mb={5}>
                <MdOutlineShield size={22} color="#60A5FA" />
                <Text fontWeight="bold" color="white" fontSize="lg">
                  Verification Vault
                </Text>
              </HStack>

              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
                mb={5}
              >
                <UploadBox
                  label="Government Docs"
                  hint="Click to upload • PDF recommended"
                  Icon={FiUpload}
                  accept=".pdf,.doc,.docx"
                  onChange={setFile("gov_id_proof")}
                  fileName={
                    files.gov_id_proof?.name ||
                    (employee?.documents?.gov_id_proof ? "Uploaded ✓" : null)
                  }
                />

                <UploadBox
                  label="Employment Dossier"
                  hint="Click to upload • PDF recommended"
                  Icon={FiUpload}
                  accept=".pdf,.doc,.docx"
                  onChange={setFile("employment_docs")}
                  fileName={
                    files.employment_docs?.name ||
                    (employee?.documents?.employment_docs ? "Uploaded ✓" : null)
                  }
                />

                <UploadBox
                  label="Employee Photo"
                  hint="Click to upload • WEBP or JPG recommended"
                  Icon={FiImage}
                  accept="image/*"
                  onChange={setFile("photo_url")}
                  fileName={files.photo_url?.name}
                  previewUrl={photoPreview}
                />

                <UploadBox
                  label="Signature"
                  hint="Click to upload • PNG recommended"
                  Icon={FiEdit2}
                  accept="image/png,image/jpeg"
                  onChange={setFile("signature_url")}
                  fileName={files.signature_url?.name}
                  previewUrl={signPreview}
                />
              </Grid>

              <Box bg="whiteAlpha.100" borderRadius="xl" p={4}>
                <Text
                  fontSize="2xs"
                  fontWeight="bold"
                  color="whiteAlpha.600"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  mb={3}
                >
                  Portal Password Manager
                </Text>
                <Input
                  bg="whiteAlpha.100"
                  border="none"
                  borderRadius="xl"
                  color="white"
                  h="44px"
                  placeholder="New Access Password"
                  type="password"
                  _placeholder={{ color: "whiteAlpha.400", fontSize: "sm" }}
                  _focus={{
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.3)",
                    bg: "whiteAlpha.200",
                  }}
                  value={ui.portal_password}
                  onChange={setU("portal_password")}
                />
              </Box>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter px={8} py={5} borderTop="1px solid" borderColor="gray.100">
          <Flex justify="flex-end" align="center" gap={4} w="full">
            <Button
              variant="ghost"
              color="gray.400"
              fontWeight="medium"
              fontSize="sm"
              onClick={handleClose}
              _hover={{ color: "gray.600" }}
            >
              Discard Changes
            </Button>

            <HRMSButton
              onClick={handleSubmit}
              isLoading={isPending}
              loadingText="Saving..."
              px={8}
              h="44px"
            >
              Synchronize File
            </HRMSButton>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EmployeeMasterForm;