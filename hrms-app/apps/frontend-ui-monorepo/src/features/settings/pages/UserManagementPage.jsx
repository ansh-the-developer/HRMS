import React, { useState } from 'react';
import {
  Box, Flex, Text, Grid, GridItem,
  VStack, HStack, Select, useToast, Icon,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import HRMSInput from '@/components/atomic/atoms/HRMSInput';

// ── Icons ──
const UserIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </Icon>
);

const BriefcaseIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </Icon>
);

const FileIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </Icon>
);

const LockIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </Icon>
);

const UploadIcon = (props) => (
  <Icon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </Icon>
);


const TABS = [
  { id: 'personal', label: 'Personal Information', icon: UserIcon },
  { id: 'professional', label: 'Professional Information', icon: BriefcaseIcon },
  { id: 'documents', label: 'Documents', icon: FileIcon },
  { id: 'account', label: 'Account Access', icon: LockIcon },
];

export default function UserManagementPage() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('personal');

  // Shared submit handler
  const handleSave = () => {
    toast({
      title: 'Saved Successfully',
      description: `Information for ${activeTab} tab saved.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6} maxW="6xl" mx="auto">
        <Text fontSize="xl" fontWeight="bold" color="gray.800" mb={6}>
          Add New Employee/User
        </Text>

        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p={8}>
          
          {/* Tabs Navigation */}
          <Flex borderBottom="1px solid" borderColor="gray.200" mb={8} overflowX="auto" pb={2}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <HStack
                  key={tab.id}
                  spacing={2}
                  px={6}
                  py={2}
                  cursor="pointer"
                  borderBottom={isActive ? '2px solid' : '2px solid transparent'}
                  borderColor={isActive ? '#6b46c1' : 'transparent'} // Matching the purple from Figma
                  color={isActive ? '#6b46c1' : 'gray.500'}
                  fontWeight={isActive ? 'bold' : 'medium'}
                  onClick={() => setActiveTab(tab.id)}
                  transition="all 0.2s"
                  whiteSpace="nowrap"
                >
                  <TabIcon boxSize={4} />
                  <Text fontSize="sm">{tab.label}</Text>
                </HStack>
              );
            })}
          </Flex>

          {/* Tab Content Rendering */}
          <Box minH="300px">
            {activeTab === 'personal' && <PersonalTab />}
            {activeTab === 'professional' && <ProfessionalTab />}
            {activeTab === 'documents' && <DocumentsTab />}
            {activeTab === 'account' && <AccountTab />}
          </Box>

          {/* Action Buttons */}
          <Flex justify="flex-end" gap={4} mt={10}>
            <HRMSButton variant="outline" borderColor="gray.200" color="gray.600">
              Cancel
            </HRMSButton>
            <HRMSButton bg="#6b46c1" color="white" _hover={{ bg: '#553c9a' }} onClick={handleSave}>
              Save
            </HRMSButton>
          </Flex>

        </Box>
      </Box>
    </DashboardLayout>
  );
}

// ── Tab 1: Personal Information ──
function PersonalTab() {
  return (
    <VStack align="stretch" spacing={6}>
      <Box w="80px" h="80px" bg="gray.50" borderRadius="md" border="1px dashed" borderColor="gray.300" display="flex" alignItems="center" justifyContent="center" cursor="pointer" _hover={{ bg: "gray.100" }}>
         <Icon as={UserIcon} color="gray.400" />
      </Box>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
        <HRMSInput placeholder="First Name" />
        <HRMSInput placeholder="Last Name" />
        <HRMSInput placeholder="Mobile Number" />
        <HRMSInput placeholder="Personal Email" />
        <HRMSInput placeholder="Father's Name" />
        <HRMSInput placeholder="Highest Degree" />
        <HRMSInput type="date" placeholder="Date of Birth" />
        <Select placeholder="Marital Status" fontSize="sm" color="gray.600" borderColor="gray.200">
          <option>Single</option>
          <option>Married</option>
        </Select>
        <Select placeholder="Gender" fontSize="sm" color="gray.600" borderColor="gray.200">
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </Select>
        <Select placeholder="Nationality" fontSize="sm" color="gray.600" borderColor="gray.200">
          <option>Indian</option>
          <option>Other</option>
        </Select>
        <Select placeholder="Blood Group" fontSize="sm" color="gray.600" borderColor="gray.200">
          <option>A+</option><option>O+</option><option>B+</option><option>AB+</option>
        </Select>
        <HRMSInput placeholder="PAN No." />
        <HRMSInput placeholder="EPF No." />
        <HRMSInput placeholder="ESI No." />
      </Grid>
      <HRMSInput placeholder="Present Address" />
      <HRMSInput placeholder="Permanent Address" />
    </VStack>
  );
}

// ── Tab 2: Professional Information ──
function ProfessionalTab() {
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
      <HRMSInput placeholder="Employee ID" />
      <Select placeholder="Select Employment Status" fontSize="sm" color="gray.600" borderColor="gray.200">
        <option>Full-Time</option>
        <option>Part-Time</option>
        <option>Contract</option>
      </Select>
      <Select placeholder="Select Employee Type" fontSize="sm" color="gray.600" borderColor="gray.200">
        <option>Permanent</option>
        <option>Probation</option>
      </Select>
      <HRMSInput placeholder="Official Email" />
      <Select placeholder="Select Department" fontSize="sm" color="gray.600" borderColor="gray.200">
        <option>Engineering</option>
        <option>HR</option>
        <option>Design</option>
      </Select>
      <HRMSInput placeholder="Enter Designation" />
      <Select placeholder="Select Team" fontSize="sm" color="gray.600" borderColor="gray.200">
        <option>Frontend</option>
        <option>Backend</option>
      </Select>
      <Select placeholder="Select Salary structure" fontSize="sm" color="gray.600" borderColor="gray.200">
        <option>Standard Tier 1</option>
      </Select>
      <Select placeholder="Select Working Days" fontSize="sm" color="gray.600" borderColor="gray.200">
        <option>5 Days</option>
        <option>6 Days</option>
      </Select>
      <HRMSInput type="date" placeholder="Select Joining Date" />
      <Select placeholder="Select Office Location" fontSize="sm" color="gray.600" borderColor="gray.200" gridColumn={{ md: 'span 2' }}>
        <option>Headquarters</option>
        <option>Branch Office</option>
      </Select>
    </Grid>
  );
}

// ── Tab 3: Documents Upload ──
function DocumentsTab() {
  const DocumentDropzone = ({ label }) => (
    <Box>
      <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={3}>{label}</Text>
      <Flex direction="column" align="center" justify="center" p={8} border="1px dashed" borderColor="gray.300" borderRadius="xl" bg="white" _hover={{ bg: "gray.50" }} cursor="pointer" transition="all 0.2s">
        <Flex bg="#6b46c1" color="white" p={3} borderRadius="md" mb={4}>
          <UploadIcon boxSize={5} />
        </Flex>
        <Text fontSize="sm" color="gray.700" fontWeight="medium">
          Drag & Drop or <Box as="span" color="#6b46c1">choose file</Box> to upload
        </Text>
        <Text fontSize="xs" color="gray.400" mt={1}>Supported formats : Jpeg, pdf</Text>
      </Flex>
    </Box>
  );

  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
      <DocumentDropzone label="Upload Appointment Letter" />
      <DocumentDropzone label="Upload ID" />
      <DocumentDropzone label="Upload Reliving Letter" />
      <DocumentDropzone label="Upload Experience Letter" />
    </Grid>
  );
}

// ── Tab 4: Account Access ──
function AccountTab() {
  return (
    <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
      <HRMSInput type="email" placeholder="Enter Email Address" />
      <HRMSInput type="password" placeholder="Change Password" />
    </Grid>
  );
}
