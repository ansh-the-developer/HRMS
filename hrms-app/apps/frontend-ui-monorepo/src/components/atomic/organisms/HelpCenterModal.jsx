import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Badge,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiBookOpen,
  FiGitCommit,
  FiHelpCircle,
  FiMail,
  FiCommand,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiUserCheck,
  FiDollarSign,
  FiCalendar,
  FiShield,
  FiClock,
} from "react-icons/fi";

const WORKFLOW_STEPS = [
  { step: 1, title: "Create Branch", desc: "Set up company locations, regional offices, and branch profiles." },
  { step: 2, title: "Create Department", desc: "Define organizational departments (Engineering, HR, Sales, etc.)." },
  { step: 3, title: "Create Designations", desc: "Add official job titles and career hierarchy levels." },
  { step: 4, title: "Create Employee", desc: "Register employee master records with official code, contact, and auth link." },
  { step: 5, title: "Assign Department & Branch", desc: "Map employee to primary branch and department structure." },
  { step: 6, title: "Assign Salary Structure", desc: "Configure Basic pay, HRA, PF, ESI, TDS, and gross allowances." },
  { step: 7, title: "Attendance Management", desc: "Log daily check-ins, working hours, and automated punch records." },
  { step: 8, title: "Leave Application & Approval", desc: "Apply casual/sick leaves, manage evidence, and route manager approvals." },
  { step: 9, title: "Payroll Processing", desc: "Run monthly salary calculations based on attendance and leave logs." },
  { step: 10, title: "Payslip Generation", desc: "Generate PDF payslips and dispatch employee payout summaries." },
  { step: 11, title: "Performance Review", desc: "Execute quarterly KPI reviews and employee appraisal feedback." },
  { step: 12, title: "Analytics & Reports", desc: "Export Financial Year CSV attendance, payroll, and compliance reports." },
  { step: 13, title: "Offboarding & Exit", desc: "Process safe compliance archiving (7-day retention) or permanent deletion." },
];

const FAQS = [
  {
    q: "How do I create a new employee?",
    a: "Navigate to Employee Management → Click '+ Add Employee' → Fill out personal details, department, designation, and password → Click 'Save Employee'. An auto-generated Employee ID (e.g. bk-1001) will be assigned."
  },
  {
    q: "How do I process monthly payroll?",
    a: "Go to Salary & Payroll → Select Payout Month → Click 'Process Payroll'. The system will compute gross earnings, deductions (PF/ESI/TDS), and net payable salary automatically based on attendance logs."
  },
  {
    q: "How do I approve or reject leave requests?",
    a: "Open Leave Management → Review pending leave requests → Click 'Approve' or 'Reject'. The employee will receive an instant notification in their top bar."
  },
  {
    q: "How do I mark daily attendance?",
    a: "Go to Attendance Dashboard → Click 'Check In' or 'Check Out'. Admin users can also edit attendance records or mark bulk attendance from the Attendance Table."
  },
  {
    q: "How do I generate employee payslips?",
    a: "In the Payroll module, click 'Generate Slips' or open an employee row → Click 'Download PDF Payslip' to view and export full salary breakdowns."
  },
  {
    q: "How do I export reports for compliance?",
    a: "Navigate to Payroll/Attendance → Click 'Export CSV'. Attendance CSV exports are pre-sorted chronologically starting April 1st for Financial Year compliance."
  },
  {
    q: "How do I switch to Employee Mode?",
    a: "Click the perspective switch button at the bottom of the sidebar ('Switch to Employee UI'). HR and Manager accounts automatically load their own linked profile."
  },
  {
    q: "How do I change my password or enable MFA?",
    a: "Go to System Settings → Security → Enter your current password and set a new password, or click 'Enroll TOTP' to pair an authenticator app."
  },
];

export default function HelpCenterModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState(null);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered scrollBehavior="inside" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(16px)" />
      <ModalContent
        bg="card-bg"
        borderRadius="2xl"
        border="1px solid"
        borderColor="border-color"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.4)"
        maxH="88vh"
        mx={4}
      >
        <ModalHeader borderBottom="1px solid" borderColor="border-color" px={6} py={4}>
          <HStack justify="space-between" align="center" pr={8}>
            <HStack spacing={3}>
              <Flex w="40px" h="40px" borderRadius="xl" bg="rgba(99, 102, 241, 0.15)" color="accent" align="center" justify="center">
                <FiHelpCircle size={22} />
              </Flex>
              <VStack align="start" spacing={0}>
                <Heading size="md" color="text-primary">
                  HappyHRMS Help & Knowledge Base
                </Heading>
                <Text fontSize="xs" color="text-muted">
                  Interactive operational guide, FAQs, and enterprise workflows
                </Text>
              </VStack>
            </HStack>
            <Badge colorScheme="purple" borderRadius="full" px={3} py={1} fontSize="10px">
              Enterprise v2.4
            </Badge>
          </HStack>
        </ModalHeader>

        <ModalCloseButton top={4} right={6} />

        <ModalBody p={6}>
          <Tabs variant="soft-rounded" colorScheme="indigo">
            <TabList mb={6} overflowX="auto" pb={1} gap={2}>
              <Tab fontSize="xs" fontWeight="bold" borderRadius="xl">
                <HStack spacing={2}>
                  <FiBookOpen size={14} />
                  <Text>Getting Started</Text>
                </HStack>
              </Tab>
              <Tab fontSize="xs" fontWeight="bold" borderRadius="xl">
                <HStack spacing={2}>
                  <FiGitCommit size={14} />
                  <Text>HRMS Workflow</Text>
                </HStack>
              </Tab>
              <Tab fontSize="xs" fontWeight="bold" borderRadius="xl">
                <HStack spacing={2}>
                  <FiHelpCircle size={14} />
                  <Text>Frequently Asked Questions</Text>
                </HStack>
              </Tab>
              <Tab fontSize="xs" fontWeight="bold" borderRadius="xl">
                <HStack spacing={2}>
                  <FiMail size={14} />
                  <Text>Contact & System Info</Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              {/* Tab 1: Getting Started */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Box p={4} borderRadius="xl" bg="rgba(99, 102, 241, 0.08)" border="1px solid" borderColor="rgba(99, 102, 241, 0.2)">
                    <Heading size="xs" color="accent" mb={1}>
                      Welcome to HappyHRMS! 🌸
                    </Heading>
                    <Text fontSize="xs" color="text-secondary">
                      HappyHRMS is a full-suite Human Resource Management System engineered with Japanese Atmospheric Glass design aesthetics. Use the overview below to navigate modules.
                    </Text>
                  </Box>

                  <VStack spacing={3} align="stretch">
                    {[
                      { icon: FiUserCheck, title: "1. First Login & Authentication", desc: "Sign in with your email or username. Passkeys and 5-minute inactivity session autolock keep your workspace secure." },
                      { icon: FiLayers, title: "2. Dashboard Overview", desc: "Monitor real-time employee metrics, attendance logs, leave balances, birthdays, and company announcements." },
                      { icon: FiUserCheck, title: "3. Employee Management", desc: "Manage employee master records, assign departments, toggle nicknames/aliases, and perform safe 7-day compliance archives." },
                      { icon: FiClock, title: "4. Attendance Tracking", desc: "Record daily punch logs, filter by financial year date ranges, and view 'Not Yet Joined' pre-joining badges." },
                      { icon: FiCalendar, title: "5. Leave Applications", desc: "Submit leave requests, attach medical evidence, and track manager approval notifications." },
                      { icon: FiDollarSign, title: "6. Salary & Payroll", desc: "Configure salary structures (Basic/HRA/PF/ESI/TDS), process monthly payouts, and generate PDF payslips." },
                      { icon: FiShield, title: "7. Performance & Complaints", desc: "Conduct quarterly employee performance reviews and manage confidential complaint center cases." },
                    ].map((item, i) => (
                      <Flex key={i} p={3.5} borderRadius="xl" bg="app-bg-secondary" border="1px solid" borderColor="border-color" align="start" gap={3}>
                        <Flex p={2} borderRadius="lg" bg="card-bg" color="accent" flexShrink={0}>
                          <item.icon size={18} />
                        </Flex>
                        <VStack align="start" spacing={0.5}>
                          <Text fontSize="sm" fontWeight="bold" color="text-primary">
                            {item.title}
                          </Text>
                          <Text fontSize="xs" color="text-muted">
                            {item.desc}
                          </Text>
                        </VStack>
                      </Flex>
                    ))}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Tab 2: HRMS Workflow Diagram */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="xs" color="text-muted">
                    Complete end-to-end operational workflow of HappyHRMS. Click any step to inspect step details:
                  </Text>

                  <VStack spacing={2} align="stretch" maxH="400px" overflowY="auto" pr={1}>
                    {WORKFLOW_STEPS.map((step) => {
                      const isSelected = selectedWorkflowStep === step.step;
                      return (
                        <Box
                          key={step.step}
                          p={3}
                          borderRadius="xl"
                          bg={isSelected ? "rgba(99, 102, 241, 0.12)" : "app-bg-secondary"}
                          border="1px solid"
                          borderColor={isSelected ? "accent" : "border-color"}
                          cursor="pointer"
                          onClick={() => setSelectedWorkflowStep(step.step)}
                          _hover={{ bg: "hover-bg" }}
                          transition="all 0.15s ease"
                        >
                          <HStack justify="space-between" align="center">
                            <HStack spacing={3}>
                              <Flex w="28px" h="28px" borderRadius="full" bg="accent" color="white" align="center" justify="center" fontSize="xs" fontWeight="bold">
                                {step.step}
                              </Flex>
                              <Text fontSize="sm" fontWeight="bold" color="text-primary">
                                {step.title}
                              </Text>
                            </HStack>
                            <FiArrowRight size={14} color="gray" />
                          </HStack>
                          <Text fontSize="xs" color="text-muted" mt={1.5} pl={10}>
                            {step.desc}
                          </Text>
                        </Box>
                      );
                    })}
                  </VStack>
                </VStack>
              </TabPanel>

              {/* Tab 3: Frequently Asked Questions */}
              <TabPanel p={0}>
                <VStack spacing={4} align="stretch">
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none" color="text-muted">
                      <FiSearch size={16} />
                    </InputLeftElement>
                    <Input
                      placeholder="Search FAQs (e.g. payroll, leave, attendance, employee)..."
                      borderRadius="xl"
                      bg="app-bg-secondary"
                      borderColor="border-color"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>

                  <Accordion allowMultiple defaultIndex={[0]}>
                    {filteredFaqs.length === 0 ? (
                      <VStack py={8} spacing={2} textAlign="center">
                        <FiHelpCircle size={24} color="gray" />
                        <Text fontSize="sm" color="text-muted">
                          No FAQs matched "{searchQuery}".
                        </Text>
                      </VStack>
                    ) : (
                      filteredFaqs.map((faq, i) => (
                        <AccordionItem key={i} border="1px solid" borderColor="border-color" borderRadius="xl" mb={2.5} overflow="hidden">
                          <AccordionButton py={3.5} px={4} bg="app-bg-secondary" _hover={{ bg: "hover-bg" }}>
                            <Box flex="1" textAlign="left" fontWeight="bold" fontSize="sm" color="text-primary">
                              {faq.q}
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel p={4} bg="card-bg" fontSize="xs" color="text-secondary" lineHeight="relaxed">
                            {faq.a}
                          </AccordionPanel>
                        </AccordionItem>
                      ))
                    )}
                  </Accordion>
                </VStack>
              </TabPanel>

              {/* Tab 4: Contact & System Info */}
              <TabPanel p={0}>
                <VStack spacing={5} align="stretch">
                  <Flex p={4} borderRadius="xl" bg="app-bg-secondary" border="1px solid" borderColor="border-color" justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Flex p={2.5} borderRadius="xl" bg="rgba(99, 102, 241, 0.15)" color="accent">
                        <FiMail size={20} />
                      </Flex>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="bold" color="text-primary">
                          Enterprise Support Desk
                        </Text>
                        <Text fontSize="xs" color="text-muted">
                          Email support@happyhrms.com for technical inquiries
                        </Text>
                      </VStack>
                    </HStack>
                    <Button size="sm" bg="accent" color="white" borderRadius="xl" _hover={{ bg: "accent-hover" }}>
                      Send Email
                    </Button>
                  </Flex>

                  <Box p={4} borderRadius="xl" bg="app-bg-secondary" border="1px solid" borderColor="border-color">
                    <Heading size="xs" color="text-primary" mb={3}>
                      Keyboard Shortcuts Reference
                    </Heading>
                    <VStack spacing={2} align="stretch">
                      {[
                        { keys: "⌘ K / Ctrl + K", desc: "Open Global Search modal" },
                        { keys: "ESC", desc: "Close modals and search overlays" },
                        { keys: "↑ / ↓", desc: "Navigate live search results" },
                        { keys: "ENTER", desc: "Select search item or submit modal form" },
                      ].map((sc, i) => (
                        <Flex key={i} justify="space-between" align="center" fontSize="xs">
                          <Text color="text-secondary">{sc.desc}</Text>
                          <Badge bg="card-bg" border="1px solid" borderColor="border-color" px={2} py={0.5} borderRadius="md" color="accent">
                            {sc.keys}
                          </Badge>
                        </Flex>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
