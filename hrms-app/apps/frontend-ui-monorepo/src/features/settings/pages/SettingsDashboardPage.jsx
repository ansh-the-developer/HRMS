import React from 'react';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';

const settingsItems = [
  {
    title: 'Company Details',
    description: 'Change / Update Company details',
    path: '/settings/company',
  },
  {
    title: 'User Management',
    description: 'Add/Modify users',
    path: '/settings/users/new',
  },
  {
    title: 'Permissions Manager',
    description: 'Change what users/groups can do and can not',
    path: '/settings/permissions',
  },
];

export default function SettingsDashboardPage() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6}>
        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p={2}>
          <VStack align="stretch" spacing={0}>
            {settingsItems.map((item, index) => (
              <Flex
                key={index}
                align="center"
                justify="space-between"
                px={6}
                py={5}
                borderBottom={index !== settingsItems.length - 1 ? '1px solid' : 'none'}
                borderColor="gray.100"
                _hover={{ bg: 'gray.50' }}
                transition="all 0.2s"
              >
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color="gray.800" mb={1}>
                    {item.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.description}
                  </Text>
                </Box>
                <HRMSButton
                  size="sm"
                  variant="solid"
                  onClick={() => navigate(item.path)}
                >
                  Edit
                </HRMSButton>
              </Flex>
            ))}
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
