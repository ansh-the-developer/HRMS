import React, { useState, useEffect } from "react";
import {
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, ModalCloseButton,
  Box, Flex, Grid, GridItem, Text, Input,
  Select, VStack, HStack, Button, Divider,
  useToast,
} from "@chakra-ui/react";
import { FiUpload, FiImage, FiEdit2 } from "react-icons/fi";
import { MdOutlineShield } from "react-icons/md";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import {
  createEmployeeProfile,
  updateEmployeeProfile,
  uploadFile,
} from "@/services/employeeApi";
import { useQueryClient } from "@tanstack/react-query";


const SectionHeader = ({ title }) => (
  <Flex align="center" gap={3} mb={5}>
    <Box w="3px" h="14px" bg="purple.600" borderRadius="full" flexShrink={0} />
    <Text fontSize="2xs" fontWeight="bold" color="purple.600" letterSpacing="widest" textTransform="uppercase">
      {title}
    </Text>
  </Flex>
);


const FieldLabel = ({ children }) => (
  <Text fontSize="2xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={1}>
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
  _focus: { borderColor: "purple.400", bg: "white", boxShadow: "0 0 0 1px #7152F3" },
};


const UploadBox = ({ label, hint, Icon = FiUpload, accept, onChange, previewUrl, fileName }) => {
  const inputRef = React.useRef();
  return (
    <Box>
      <Text fontSize="2xs" fontWeight="semibold" color="whiteAlpha.600"
        textTransform="uppercase" letterSpacing="wider" mb={2}>
        {label}
      </Text>
      <Flex
        border="2px dashed"
        borderColor={fileName ? "blue.400" : "whiteAlpha.300"}
        borderRadius="xl" p={6} direction="column" align="center"
        justify="center" cursor="pointer" gap={2}
        bg={fileName ? "whiteAlpha.200" : "transparent"}
        _hover={{ borderColor: "whiteAlpha.500", bg: "whiteAlpha.100" }}
        transition="all 0.2s"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => onChange?.(e.target.files[0])}
        />
        {previewUrl && accept?.includes("image") ? (
          <Box as="img" src={previewUrl} h="60px" w="60px" objectFit="cover" borderRadius="md" />
        ) : (
          <Icon size={22} color={fileName ? "#60A5FA" : "rgba(255,255,255,0.4)"} />
        )}
        <Text fontSize="xs" color={fileName ? "blue.300" : "whiteAlpha.500"}
          textAlign="center" noOfLines={1} maxW="150px">
          {fileName || hint}
        </Text>
      </Flex>
    </Box>
  );
};


const INITIAL_FORM = {
  name:        "",
  email:       "",
  department:  "",
  designation: "",
  birthdate:   "",
};


const INITIAL_UI = {
  marital_status:           "Single",
  personal_number:          "",
  present_address:          "",
  emp_type:                 "Permanent",
  location:                 "",
  emp_id:                   "",
  monthly_ctc:              "",
  blood_group:              "",
  emergency_contact:        "",
  epfo_uan:                 "",
  pran:                     "",
  esic_ip:                  "",
  pan:                      "",
  e_shram_uan:              "",
  primary_bank_name:        "",
  primary_account_number:   "",
  primary_ifsc:             "",
  secondary_bank_name:      "",
  secondary_account_number: "",
  secondary_ifsc:           "",
  portal_password:          "",
};


// ✅ Outside component so it's stable
const INITIAL_FILES = {
  gov_id_proof:    null,
  employment_docs: null,
  photo_url:       null,
  signature_url:   null,
};


const EmployeeMasterForm = ({ isOpen, onClose, employee, onSuccess }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm]           = useState(INITIAL_FORM);
  const [ui, setUi]               = useState(INITIAL_UI);
  const [files, setFiles]         = useState(INITIAL_FILES);
  const [isPending, setIsPending] = useState(false);
  const isEditing                 = !!employee;


  const setFile = (field) => (file) =>
    setFiles((p) => ({ ...p, [field]: file }));


  useEffect(() => {
    if (!isOpen) return;


    if (employee) {
      setForm({
        name:        employee.name        || "",
        email:       employee.email       || "",
        department:  employee.department  || "",
        designation: employee.designation || "",
        birthdate:   employee.birthdate   || "",
      });


      setUi({
        marital_status:           INITIAL_UI.marital_status,
        personal_number:          employee.personal_number   || "",
        present_address:          employee.present_address   || "",
        emp_id:                   employee.emp_code          || "",
        emp_type:                 employee.employee_type     || "Permanent",
        location:                 employee.work_location     || "",
        monthly_ctc:              employee.monthly_ctc       || "",
        blood_group:              employee.blood_group       || "",
        emergency_contact:        employee.emergency_contact || "",
        epfo_uan:                 employee.compliance?.epfo_uan    || "",
        pran:                     employee.compliance?.pran        || "",
        esic_ip:                  employee.compliance?.esic_ip     || "",
        pan:                      employee.compliance?.pan         || "",
        e_shram_uan:              employee.compliance?.e_shram_uan || "",
        primary_bank_name:        employee.banking?.primary_bank?.bank_name       || "",
        primary_account_number:   employee.banking?.primary_bank?.account_number  || "",
        primary_ifsc:             employee.banking?.primary_bank?.ifsc_code        || "",
        secondary_bank_name:      employee.banking?.secondary_bank?.bank_name      || "",
        secondary_account_number: employee.banking?.secondary_bank?.account_number || "",
        secondary_ifsc:           employee.banking?.secondary_bank?.ifsc_code      || "",
        portal_password:          "",
      });


      // ✅ Reset files on edit open
      setFiles(INITIAL_FILES);


    } else {
      setForm(INITIAL_FORM);
      setUi(INITIAL_UI);
      setFiles(INITIAL_FILES);
    }
  }, [employee, isOpen]);


  const setF = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setU = (field) => (e) => setUi((p) => ({ ...p, [field]: e.target.value }));


  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast({ title: "Full name is required", status: "warning", duration: 3000 });
      return;
    }


    setIsPending(true);
    try {
      // ✅ Step 1: Create/update employee + compliance + banking first
      let savedEmployee;


      const employeePayload = {
        name:              form.name,
        email:             form.email       || null,
        department:        form.department  || null,
        designation:       form.designation || null,
        birthdate:         form.birthdate   || null,
        monthly_ctc:       ui.monthly_ctc       || null,
        blood_group:       ui.blood_group       || null,
        emergency_contact: ui.emergency_contact || null,
        work_location:     ui.location          || null,
        employee_type:     ui.emp_type          || null,
        emp_code:          ui.emp_id            || null,
        personal_number:   ui.personal_number   || null,
        present_address:   ui.present_address   || null,
      };


      const compliancePayload = {
        epfo_uan:    ui.epfo_uan    || null,
        pan:         ui.pan         || null,
        pran:        ui.pran        || null,
        esic_ip:     ui.esic_ip     || null,
        e_shram_uan: ui.e_shram_uan || null,
      };


      const bankingPayload = {
        primary_bank: {
          bank_name:      ui.primary_bank_name      || "",
          account_number: ui.primary_account_number || "",
          ifsc_code:      ui.primary_ifsc            || "",
        },
        secondary_bank: {
          bank_name:      ui.secondary_bank_name      || "",
          account_number: ui.secondary_account_number || "",
          ifsc_code:      ui.secondary_ifsc            || "",
        },
      };


      if (isEditing) {
        savedEmployee = await updateEmployeeProfile(employee.id, {
          employee:   employeePayload,
          compliance: compliancePayload,
          banking:    bankingPayload,
        });
      } else {
        savedEmployee = await createEmployeeProfile({
          employee:   employeePayload,
          compliance: compliancePayload,
          banking:    bankingPayload,
        });
      }


      const empId = savedEmployee.id;


      // ✅ Step 2: Upload files to storage + collect URLs
      const [govUrl, empDocUrl, photoUrl, signUrl] = await Promise.all([
        files.gov_id_proof
          ? uploadFile("employee-docs",       files.gov_id_proof,    empId)
          : Promise.resolve(employee?.documents?.gov_id_proof    || null),
        files.employment_docs
          ? uploadFile("employee-docs",       files.employment_docs, empId)
          : Promise.resolve(employee?.documents?.employment_docs || null),
        files.photo_url
          ? uploadFile("employee-photos",     files.photo_url,       empId)
          : Promise.resolve(employee?.documents?.photo_url       || null),
        files.signature_url
          ? uploadFile("employee-signatures", files.signature_url,   empId)
          : Promise.resolve(employee?.documents?.signature_url   || null),
      ]);


      // ✅ Step 3: Save document URLs to employee_documents
      const hasAnyDoc = govUrl || empDocUrl || photoUrl || signUrl;
      if (hasAnyDoc) {
        await updateEmployeeProfile(empId, {
          documents: {
            gov_id_proof:    govUrl,
            employment_docs: empDocUrl,
            photo_url:       photoUrl,
            signature_url:   signUrl,
          },
        });
      }


      toast({
        title: isEditing ? "Employee updated!" : "Employee created!",
        status: "success", duration: 3000, isClosable: true,
      });


      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();


    } catch (err) {
      toast({ title: "Error saving record", description: err.message, status: "error", duration: 5000, isClosable: true });
    } finally {
      setIsPending(false);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.500" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="2xl" mx={4} my={6} maxH="90vh" overflow="hidden">


        <ModalHeader pb={3} pt={6} px={8}>
          <Text fontSize="xl" fontWeight="bold" color="gray.900">
            {isEditing ? `Modifying: ${employee?.name}` : "Create New Master Record"}
          </Text>
          <Text fontSize="2xs" fontWeight="bold" color="purple.500" letterSpacing="widest" textTransform="uppercase" mt={1}>
            Compliance & Financial Management
          </Text>
        </ModalHeader>
        <ModalCloseButton top={5} right={6} />
        <Divider borderColor="gray.100" />


        <ModalBody px={8} py={6} overflowY="auto">
          <VStack spacing={8} align="stretch">


            {/* ── PERSONAL IDENTITY (KYC) ── */}
            <Box>
              <SectionHeader title="Personal Identity (KYC)" />
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                <GridItem>
                  <FieldLabel>Full Name</FieldLabel>
                  <Input {...iStyle} value={form.name} onChange={setF("name")} placeholder="John Doe" />
                </GridItem>
                <GridItem>
                  <FieldLabel>DOB</FieldLabel>
                  <Input {...iStyle} type="date" value={form.birthdate} onChange={setF("birthdate")} />
                </GridItem>
                <GridItem>
                  <FieldLabel>Marital Status</FieldLabel>
                  <Select {...iStyle} value={ui.marital_status} onChange={setU("marital_status")}>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </Select>
                </GridItem>
                <GridItem>
                  <FieldLabel>Personal Number</FieldLabel>
                  <Input {...iStyle} value={ui.personal_number} onChange={setU("personal_number")} placeholder="+91 99999 00000" />
                </GridItem>
                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <FieldLabel>Present Address</FieldLabel>
                  <Input {...iStyle} value={ui.present_address} onChange={setU("present_address")} placeholder="Full present address" />
                </GridItem>
              </Grid>
            </Box>


            {/* ── CORPORATE IDENTITY ── */}
            <Box>
              <SectionHeader title="Corporate Identity" />
              <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
                <GridItem>
                  <FieldLabel>Official Email</FieldLabel>
                  <Input {...iStyle} type="email" value={form.email} onChange={setF("email")} placeholder="john@company.com" />
                </GridItem>
                <GridItem>
                  <FieldLabel>EMP Type</FieldLabel>
                  <Select {...iStyle} value={ui.emp_type} onChange={setU("emp_type")}>
                    <option>Permanent</option>
                    <option>Contract</option>
                    <option>Intern</option>
                    <option>Probation</option>
                    <option>Freelancer</option>
                  </Select>
                </GridItem>
                <GridItem>
                  <FieldLabel>Department</FieldLabel>
                  <Input {...iStyle} value={form.department} onChange={setF("department")} placeholder="e.g. Engineering" />
                </GridItem>
                <GridItem>
                  <FieldLabel>Designation</FieldLabel>
                  <Input {...iStyle} value={form.designation} onChange={setF("designation")} placeholder="e.g. Developer" />
                </GridItem>
                <GridItem>
                  <FieldLabel>Location</FieldLabel>
                  <Input {...iStyle} value={ui.location} onChange={setU("location")} placeholder="e.g. Delhi" />
                </GridItem>
                <GridItem>
                  <FieldLabel>EMP ID</FieldLabel>
                  <Input {...iStyle} value={ui.emp_id} onChange={setU("emp_id")} placeholder="e.g. CA-1005" />
                </GridItem>
                <GridItem>
                  <FieldLabel>ⓘ Monthly CTC (₹)</FieldLabel>
                  <Input {...iStyle} type="number" bg="blue.50" value={ui.monthly_ctc} onChange={setU("monthly_ctc")} placeholder="e.g. 50000" />
                </GridItem>
                <GridItem>
                  <FieldLabel>Blood Group</FieldLabel>
                  <Select {...iStyle} value={ui.blood_group} onChange={setU("blood_group")}>
                    <option value="">— Select —</option>
                    {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </Select>
                </GridItem>
                <GridItem>
                  <FieldLabel>Emergency Contact</FieldLabel>
                  <Input {...iStyle} value={ui.emergency_contact} onChange={setU("emergency_contact")} placeholder="Name · Relation · Phone" />
                </GridItem>
              </Grid>
            </Box>


            {/* ── STATUTORY & COMPLIANCE ── */}
            <Box>
              <SectionHeader title="Statutory & Compliance" />
              <Grid templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }} gap={3} mb={5}>
                {[
                  ["EPFO (UAN)", "epfo_uan",   false],
                  ["PRAN",       "pran",        false],
                  ["ESIC IP",    "esic_ip",     false],
                  ["PAN",        "pan",         false],
                  ["E-SHRAM UAN","e_shram_uan", true ],
                ].map(([label, field, highlight]) => (
                  <GridItem key={field}>
                    <FieldLabel>{label}</FieldLabel>
                    <Input {...iStyle} bg={highlight ? "blue.50" : "gray.50"} value={ui[field]} onChange={setU(field)} />
                  </GridItem>
                ))}
              </Grid>


              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
                  <Text fontSize="2xs" fontWeight="bold" color="purple.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                    Primary Salary Account
                  </Text>
                  <VStack spacing={3}>
                    <Input {...iStyle} w="full" placeholder="Bank Name" value={ui.primary_bank_name} onChange={setU("primary_bank_name")} />
                    <Grid templateColumns="1fr 1fr" gap={3} w="full">
                      <Input {...iStyle} placeholder="Account Number" value={ui.primary_account_number} onChange={setU("primary_account_number")} />
                      <Input {...iStyle} placeholder="IFSC Code" value={ui.primary_ifsc} onChange={setU("primary_ifsc")} />
                    </Grid>
                  </VStack>
                </Box>
                <Box border="1px solid" borderColor="gray.200" borderRadius="xl" p={4}>
                  <Text fontSize="2xs" fontWeight="bold" color="gray.500" textTransform="uppercase" letterSpacing="wider" mb={3}>
                    Secondary (Reimbursements)
                  </Text>
                  <VStack spacing={3}>
                    <Input {...iStyle} w="full" placeholder="Bank Name" value={ui.secondary_bank_name} onChange={setU("secondary_bank_name")} />
                    <Grid templateColumns="1fr 1fr" gap={3} w="full">
                      <Input {...iStyle} placeholder="Account Number" value={ui.secondary_account_number} onChange={setU("secondary_account_number")} />
                      <Input {...iStyle} placeholder="IFSC Code" value={ui.secondary_ifsc} onChange={setU("secondary_ifsc")} />
                    </Grid>
                  </VStack>
                </Box>
              </Grid>
            </Box>


            {/* ── VERIFICATION VAULT ── */}
            <Box bg="#182140" borderRadius="2xl" p={6}>
              <HStack spacing={3} mb={5}>
                <MdOutlineShield size={22} color="#60A5FA" />
                <Text fontWeight="bold" color="white" fontSize="lg">Verification Vault</Text>
              </HStack>


              {/* ✅ Wired upload boxes with document status display */}
              <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mb={5}>
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
                  previewUrl={files.photo_url ? URL.createObjectURL(files.photo_url) : employee?.documents?.photo_url}
                />
                <UploadBox
                  label="Signature"
                  hint="Click to upload • PNG recommended"
                  Icon={FiEdit2}
                  accept="image/png,image/jpeg"
                  onChange={setFile("signature_url")}
                  fileName={files.signature_url?.name}
                  previewUrl={files.signature_url ? URL.createObjectURL(files.signature_url) : employee?.documents?.signature_url}
                />
              </Grid>


              <Box bg="whiteAlpha.100" borderRadius="xl" p={4}>
                <Text fontSize="2xs" fontWeight="bold" color="whiteAlpha.600" textTransform="uppercase" letterSpacing="wider" mb={3}>
                  Portal Password Manager
                </Text>
                <Input
                  bg="whiteAlpha.100" border="none" borderRadius="xl" color="white" h="44px"
                  placeholder="New Access Password" type="password"
                  _placeholder={{ color: "whiteAlpha.400", fontSize: "sm" }}
                  _focus={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.3)", bg: "whiteAlpha.200" }}
                  value={ui.portal_password}
                  onChange={setU("portal_password")}
                />
              </Box>
            </Box>


          </VStack>
        </ModalBody>


        <ModalFooter px={8} py={5} borderTop="1px solid" borderColor="gray.100">
          <Flex justify="flex-end" align="center" gap={4} w="full">
            <Button variant="ghost" color="gray.400" fontWeight="medium" fontSize="sm" onClick={onClose} _hover={{ color: "gray.600" }}>
              Discard Changes
            </Button>
            <HRMSButton onClick={handleSubmit} isLoading={isPending} loadingText="Saving..." px={8} h="44px">
              Synchronize File
            </HRMSButton>
          </Flex>
        </ModalFooter>


      </ModalContent>
    </Modal>
  );
};


export default EmployeeMasterForm;