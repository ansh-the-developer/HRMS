import React, { useState } from 'react';
import {
  Flex,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  Grid,
  useToast,
  Input,
  Select,
} from '@chakra-ui/react';
import { FiEye, FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from './../../../components/atomic/templates/DashboardLayout';
import HRMSButton from './../../../components/atomic/atoms/HRMSButton';
import SectionTitle from './../../../components/atomic/atoms/SectionTitle';

const ruleTypes = [
  { value: 'OT', label: 'Overtime' },
  { value: 'HD', label: 'Half Day' },
  { value: 'NR', label: 'New Rule' },
  { value: 'LT', label: 'Late' },
  { value: 'EA', label: 'Early Away' },
];

const mockWorkingRules = [
  { id: 1, name: 'Overtime', ruleType: 'OT' },
  { id: 2, name: 'Half Day', ruleType: 'HD' },
  { id: 3, name: 'New Rule', ruleType: 'NR' },
];

// RuleItem (Edit navigates to detail page)
const RuleItem = ({ item, onEye, onEdit, onDelete }) => (
  <Flex 
    p={3} 
    bg="card-bg" 
    border="1px solid"
    borderColor="border-color"
    borderRadius="md" 
    align="center" 
    justify="space-between"
    mb={2}
    _hover={{ borderColor: 'blue.300', boxShadow: 'sm' }}
  >
    <Flex flex={1} align="center">
      <Text fontWeight="500" fontSize="md" mr={2}>
        {item.name}
      </Text>
      <Text fontSize="sm" color="text-muted" bg="app-bg-secondary" px={2} py={0.5} borderRadius="md">
        {item.ruleType}
      </Text>
    </Flex>
    <HStack spacing={1} ml={4}>
      <HRMSButton 
        size="xs" 
        leftIcon={<FiEye size={12} />}
        fontSize="10px"
        h={6}
        onClick={() => onEye(item)}
      >
        View
      </HRMSButton>
      <HRMSButton 
        size="xs" 
        leftIcon={<FiEdit3 size={12} />}
        fontSize="10px"
        h={6}
        onClick={() => onEdit(item)}
      >
        Edit
      </HRMSButton>
      <HRMSButton 
        size="xs" 
        leftIcon={<FiTrash2 size={12} />}
        variant="ghost"
        colorScheme="red"
        fontSize="10px"
        h={6}
        onClick={() => onDelete(item.id)}
      >
        Delete
      </HRMSButton>
    </HStack>
  </Flex>
);

const WorkingRulesPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [workingRules, setWorkingRules] = useState(mockWorkingRules);
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState('OT');

  const handleAddRule = () => {
    if (!ruleName.trim()) {
      toast({ title: 'Enter rule name', status: 'warning' });
      return;
    }
    const newRule = {
      id: Date.now(),
      name: ruleName.trim(),
      ruleType,
    };
    setWorkingRules(prev => [...prev, newRule]);
    setRuleName('');
    setRuleType('OT');
    toast({ title: 'Rule added!', status: 'success' });
  };

  const handleEyeClick = (item) => {
    navigate('/attendance/dashboard', {
      state: { filterType: 'workingRule', filterValue: item.name },
    });
  };

  // ← NEW: Edit navigates to detail page
// In WorkingRulesPage - FIXED handleEditClick
const handleEditClick = (item) => {
  navigate('/attendance/working-rules/edit', {  // ← YOUR ROUTE
    state: { filterValue: item.name, rule: item }
  });
};


  const handleDelete = (id) => {
    setWorkingRules(prev => prev.filter(rule => rule.id !== id));
    toast({ title: 'Rule deleted', status: 'success' });
  };

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch" p={{ base: 4, md: 6 }}>
        <SectionTitle>Manage Working Rules</SectionTitle>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          {/* LEFT: Create */}
          <Box flex={1} bg="card-bg" borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor="border-color">
            <Heading size="md" mb={4} color="text-primary">Define New Rule</Heading>
            <Input
              placeholder="Rule name (e.g. Overtime)"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              mb={4}
              size="lg"
            />
            <Text mb={2} fontWeight="500" color="text-secondary">Rule Type:</Text>
            <Select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              mb={6}
              size="lg"
            >
              {ruleTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Select>
            <HRMSButton
              onClick={handleAddRule}
              w="full"
              h="42px"
              borderRadius="12px"
              leftIcon={<FiPlus />}
            >
              Add
            </HRMSButton>
          </Box>

          {/* RIGHT: List */}
          <Box flex={1} bg="card-bg" borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor="border-color">
            <Heading size="md" mb={4} color="text-primary">Working Rules List</Heading>
            <VStack spacing={0} align="stretch">
              {workingRules.map(rule => (
                <RuleItem
                  key={rule.id}
                  item={rule}
                  onEye={handleEyeClick}
                  onEdit={handleEditClick}  // ← FIXED
                  onDelete={handleDelete}
                />
              ))}
            </VStack>
          </Box>
        </Flex>
      </VStack>
    </DashboardLayout>
  );
};

export default WorkingRulesPage;
