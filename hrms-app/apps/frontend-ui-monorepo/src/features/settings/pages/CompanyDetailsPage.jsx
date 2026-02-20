import React, { useState } from 'react';
import { Box, Flex, Text, Grid, VStack, useToast } from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import HRMSInput from '@/components/atomic/atoms/HRMSInput';

const STORAGE_KEY = 'hrms_company_details';

const defaultDetails = {
  companyName: 'Hankuk Construction & Trading Pvt Ltd',
  email: 'hr@hankuk.com',
  phone: '+91 98765 43210',
  website: 'www.hankuk.com',
  gstin: '',
  pan: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

const load = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : defaultDetails;
  } catch { return defaultDetails; }
};

export default function CompanyDetailsPage() {
  const toast = useToast();
  const [form, setForm] = useState(load);
  const [editing, setEditing] = useState(false);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    setEditing(false);
    toast({
      title: 'Company details saved',
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const handleCancel = () => {
    setForm(load());
    setEditing(false);
  };

  const Field = ({ label, field, type = 'text' }) => (
    <Box>
      <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">
        {label}
      </Text>
      {editing ? (
        <HRMSInput
          type={type}
          value={form[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={label}
        />
      ) : (
        <Text fontSize="sm" color="gray.700" py={2} px={3} bg="gray.50" borderRadius="md" minH="38px">
          {form[field] || <Box as="span" color="gray.400">—</Box>}
        </Text>
      )}
    </Box>
  );

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6} maxW="4xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">Company Details</Text>
            <Text fontSize="sm" color="gray.500">Change / Update Company details</Text>
          </Box>
          {!editing && (
            <HRMSButton onClick={() => setEditing(true)}>Edit</HRMSButton>
          )}
        </Flex>

        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p={8}>
          <VStack spacing={8} align="stretch">

            {/* Basic Info */}
            <Box>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600" mb={4} textTransform="uppercase" letterSpacing="wide">
                Basic Information
              </Text>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <Field label="Company Name" field="companyName" />
                <Field label="Official Email" field="email" type="email" />
                <Field label="Phone Number" field="phone" />
                <Field label="Website" field="website" />
              </Grid>
            </Box>

            {/* Tax & Legal */}
            <Box>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600" mb={4} textTransform="uppercase" letterSpacing="wide">
                Tax & Legal
              </Text>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
                <Field label="GSTIN" field="gstin" />
                <Field label="PAN No." field="pan" />
              </Grid>
            </Box>

            {/* Address */}
            <Box>
              <Text fontWeight="semibold" fontSize="sm" color="gray.600" mb={4} textTransform="uppercase" letterSpacing="wide">
                Address
              </Text>
              <VStack spacing={4} align="stretch">
                <Field label="Street Address" field="address" />
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }} gap={6}>
                  <Field label="City" field="city" />
                  <Field label="State" field="state" />
                  <Field label="Pincode" field="pincode" />
                </Grid>
                <Field label="Country" field="country" />
              </VStack>
            </Box>

          </VStack>

          {/* Actions */}
          {editing && (
            <Flex justify="flex-end" gap={4} mt={8}>
              <HRMSButton variant="outline" onClick={handleCancel}>Cancel</HRMSButton>
              <HRMSButton onClick={handleSave}>Save</HRMSButton>
            </Flex>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
}
