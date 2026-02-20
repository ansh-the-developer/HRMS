import React, { useState } from 'react';
import {
  Box, Flex, Text, Grid, VStack, HStack,
  Switch, Badge, useToast, Divider,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';

const STORAGE_KEY = 'hrms_permissions';

const ROLES = ['HR Executive', 'Manager', 'Employee'];

const MODULES = [
  { id: 'employee',    label: 'Employee',    actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'attendance',  label: 'Attendance',  actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'leaves',      label: 'Leaves',      actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'performance', label: 'Performance', actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'payroll',     label: 'Payroll',     actions: ['view', 'create', 'edit', 'delete'] },
  { id: 'settings',    label: 'Settings',    actions: ['view', 'create', 'edit', 'delete'] },
];

const defaultPermissions = {
  'HR Executive': {
    employee:    { view: true,  create: true,  edit: true,  delete: true  },
    attendance:  { view: true,  create: true,  edit: true,  delete: true  },
    leaves:      { view: true,  create: true,  edit: true,  delete: true  },
    performance: { view: true,  create: true,  edit: true,  delete: true  },
    payroll:     { view: true,  create: true,  edit: true,  delete: true  },
    settings:    { view: true,  create: true,  edit: true,  delete: true  },
  },
  'Manager': {
    employee:    { view: true,  create: false, edit: true,  delete: false },
    attendance:  { view: true,  create: true,  edit: true,  delete: false },
    leaves:      { view: true,  create: true,  edit: true,  delete: false },
    performance: { view: true,  create: true,  edit: true,  delete: false },
    payroll:     { view: true,  create: false, edit: false, delete: false },
    settings:    { view: false, create: false, edit: false, delete: false },
  },
  'Employee': {
    employee:    { view: true,  create: false, edit: false, delete: false },
    attendance:  { view: true,  create: true,  edit: false, delete: false },
    leaves:      { view: true,  create: true,  edit: false, delete: false },
    performance: { view: true,  create: false, edit: false, delete: false },
    payroll:     { view: true,  create: false, edit: false, delete: false },
    settings:    { view: false, create: false, edit: false, delete: false },
  },
};

const load = () => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : defaultPermissions;
  } catch { return defaultPermissions; }
};

const roleColors = {
  'HR Executive': 'purple',
  'Manager':      'blue',
  'Employee':     'green',
};

export default function PermissionsManagerPage() {
  const toast = useToast();
  const [permissions, setPermissions] = useState(load);
  const [activeRole, setActiveRole] = useState('HR Executive');

  const toggle = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [activeRole]: {
        ...prev[activeRole],
        [module]: {
          ...prev[activeRole][module],
          [action]: !prev[activeRole][module][action],
        },
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(permissions));
    toast({
      title: 'Permissions saved',
      description: `Permissions for ${activeRole} updated.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const handleReset = () => {
    setPermissions(defaultPermissions);
    toast({
      title: 'Permissions reset',
      status: 'info',
      duration: 2000,
      isClosable: true,
      position: 'top-right',
    });
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 8 }} py={6} maxW="5xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="gray.800">Permissions Manager</Text>
            <Text fontSize="sm" color="gray.500">Change what users/groups can do and can not</Text>
          </Box>
          <HStack spacing={3}>
            <HRMSButton variant="outline" onClick={handleReset}>Reset</HRMSButton>
            <HRMSButton onClick={handleSave}>Save Changes</HRMSButton>
          </HStack>
        </Flex>

        {/* Role Tabs */}
        <HStack spacing={3} mb={6}>
          {ROLES.map((role) => (
            <Box
              key={role}
              as="button"
              onClick={() => setActiveRole(role)}
              px={5} py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="medium"
              transition="all 0.2s"
              bg={activeRole === role ? '#6b46c1' : 'white'}
              color={activeRole === role ? 'white' : 'gray.600'}
              border="1px solid"
              borderColor={activeRole === role ? '#6b46c1' : 'gray.200'}
              _hover={{ borderColor: '#6b46c1', color: activeRole === role ? 'white' : '#6b46c1' }}
            >
              {role}
            </Box>
          ))}
        </HStack>

        {/* Active Role Badge */}
        <Flex align="center" gap={2} mb={4}>
          <Text fontSize="sm" color="gray.500">Editing permissions for:</Text>
          <Badge colorScheme={roleColors[activeRole]} px={3} py={1} borderRadius="full" fontSize="xs">
            {activeRole}
          </Badge>
        </Flex>

        {/* Permissions Table */}
        <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.100" overflow="hidden">

          {/* Table Header */}
          <Grid templateColumns="2fr 1fr 1fr 1fr 1fr" px={6} py={3} bg="gray.50" borderBottom="1px solid" borderColor="gray.100">
            <Text fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wide">Module</Text>
            {['View', 'Create', 'Edit', 'Delete'].map((a) => (
              <Text key={a} fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wide" textAlign="center">
                {a}
              </Text>
            ))}
          </Grid>

          {/* Table Rows */}
          <VStack spacing={0} align="stretch">
            {MODULES.map((mod, idx) => {
              const perms = permissions[activeRole][mod.id];
              return (
                <Box key={mod.id}>
                  <Grid
                    templateColumns="2fr 1fr 1fr 1fr 1fr"
                    px={6} py={4}
                    _hover={{ bg: 'gray.50' }}
                    transition="all 0.2s"
                    align="center"
                  >
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">{mod.label}</Text>
                    {mod.actions.map((action) => (
                      <Flex key={action} justify="center">
                        <Switch
                          isChecked={perms[action]}
                          onChange={() => toggle(mod.id, action)}
                          colorScheme="purple"
                          size="sm"
                        />
                      </Flex>
                    ))}
                  </Grid>
                  {idx < MODULES.length - 1 && <Divider borderColor="gray.100" />}
                </Box>
              );
            })}
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
}
