import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Flex,
  VStack,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Text,  // ← Explicit import
} from '@chakra-ui/react';

import DashboardLayout from './../../../components/atomic/templates/DashboardLayout';
import HRMSButton from './../../../components/atomic/atoms/HRMSButton';
import SectionTitle from './../../../components/atomic/atoms/SectionTitle';

const EditWorkingRulePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [ruleName, setRuleName] = useState('Overtime');
  const [hoursAbove, setHoursAbove] = useState(2);

  useEffect(() => {
    if (location.state?.filterValue) {
      setRuleName(location.state.filterValue);
    }
  }, [location.state]);

  const handleSave = () => {
    const ruleData = { name: ruleName, hoursAbove };
    console.log('Save rule:', ruleData);
    toast({ title: 'Rule saved!', status: 'success' });
    navigate('/attendance/working-rules/edit');
  };

  return (
    <DashboardLayout>
      <VStack spacing={6} p={{ base: 4, md: 6 }} align="stretch">
        <SectionTitle>Edit Working Rule</SectionTitle>
        
        <VStack spacing={8} w="full" maxW="400px" mx="auto">
          
          {/* Rule Name */}
          <VStack spacing={2} align="start" w="full">
            <Text fontWeight="500" color="gray.700" fontSize="md">
              Rule Name
            </Text>
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              size="lg"
              fontSize="lg"
              borderRadius="md"
              placeholder="Enter rule name"
            />
          </VStack>

          {/* Hours Above */}
          <VStack spacing={2} align="start" w="full">
            <Text fontWeight="500" color="gray.700" fontSize="md">
              Hours Above
            </Text>
            <NumberInput 
              value={hoursAbove} 
              onChange={(_, value) => setHoursAbove(value)}
              min={0}
              max={24}
              size="lg"
            >
              <NumberInputField 
                fontSize="lg" 
                h={14}
                borderRadius="md"
                textAlign="center"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </VStack>

          {/* Save Button */}
          <HRMSButton
            onClick={handleSave}
            w="full"
            h={14}
            bgGradient="linear(to-r, #307DC7, #C1B9B8)"
            color="white"
            borderRadius="full"
            fontSize="lg"
            fontWeight="500"
            size="lg"
          >
            Save
          </HRMSButton>
          
        </VStack>
      </VStack>
    </DashboardLayout>
  );
};

export default EditWorkingRulePage;
