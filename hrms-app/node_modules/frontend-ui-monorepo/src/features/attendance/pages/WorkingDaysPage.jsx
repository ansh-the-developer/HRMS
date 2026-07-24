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
} from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import { FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi';

import DashboardLayout from './../../../components/atomic/templates/DashboardLayout';
import HRMSButton from './../../../components/atomic/atoms/HRMSButton';
import SectionTitle from './../../../components/atomic/atoms/SectionTitle';

const weekdays = [
  { id: 1, short: 'Su' }, { id: 2, short: 'Mo' }, { id: 3, short: 'Tu' },
  { id: 4, short: 'We' }, { id: 5, short: 'Th' }, { id: 6, short: 'Fr' },
  { id: 7, short: 'Sa' },
];

const mockWorkingDays = [
  { id: 1, name: 'Monday to Saturday', days: [2,3,4,5,6,7] },
  { id: 2, name: 'Monday to Friday', days: [2,3,4,5,6] },
  { id: 3, name: 'Saturday Only', days: [7] },
  { id: 4, name: 'Thursday, Friday, Saturday', days: [5,6,7] },
];

// PatternItem - Edit + Delete ONLY
const PatternItem = ({ pattern, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(pattern.name);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (localName.trim()) {
      console.log('Update:', pattern.id, localName.trim());
      // TODO: parent onUpdate(pattern.id, localName)
    }
    setIsEditing(false);
  };

  return (
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
        {isEditing ? (
          <Input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            size="sm"
          />
        ) : (
          <Text fontWeight="500" fontSize="md">
            {pattern.name}
          </Text>
        )}
      </Flex>
      <HStack spacing={1} ml={4}>
        <HRMSButton 
          size="xs" 
          leftIcon={<FiEdit3 size={12} />}
          fontSize="10px"
          h={6}
          onClick={handleEdit}
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
          onClick={() => onDelete(pattern.id)}
        >
          Delete
        </HRMSButton>
      </HStack>
    </Flex>
  );
};

const WorkingDaysPage = () => {
  const toast = useToast();
  const [selectedDays, setSelectedDays] = useState([]);
  const [workingPatterns, setWorkingPatterns] = useState(mockWorkingDays);
  const [patternName, setPatternName] = useState('');

  const toggleDay = (dayId) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleAddPattern = () => {
    if (!patternName.trim() || selectedDays.length === 0) {
      toast({ title: 'Enter name and select days', status: 'warning' });
      return;
    }
    const newPattern = {
      id: Date.now(),
      name: patternName.trim(),
      days: selectedDays.sort((a,b) => a - b),
    };
    setWorkingPatterns(prev => [...prev, newPattern]);
    setPatternName('');
    setSelectedDays([]);
    toast({ title: 'Working day added!', status: 'success' });
  };

  const handleDelete = (id) => {
    setWorkingPatterns(prev => prev.filter(p => p.id !== id));
    toast({ title: 'Working day deleted', status: 'success' });
  };

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch" p={{ base: 4, md: 6 }}>
        <SectionTitle>Working Days</SectionTitle>

        {/* TWO COLUMNS */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          
          {/* LEFT: Input + Weekdays + Add */}
          <Box flex={1} bg="card-bg" borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor="border-color">
            <Heading size="md" mb={4} color="text-primary">Create Working Days</Heading>
            
            <Input
              placeholder="Working days name (e.g. Monday to Friday)"
              value={patternName}
              onChange={(e) => setPatternName(e.target.value)}
              mb={6}
              size="lg"
            />
            
            <Text mb={3} fontWeight="500" color="text-secondary">Select weekdays:</Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={2} mb={6}>
              {weekdays.map(day => (
                <Checkbox
                  key={day.id}
                  isChecked={selectedDays.includes(day.id)}
                  onChange={() => toggleDay(day.id)}
                  size="lg"
                  colorScheme="blue"
                  borderRadius="md"
                >
                  {day.short}
                </Checkbox>
              ))}
            </Grid>

            <HRMSButton
              onClick={handleAddPattern}
              w="full"
              h="42px"
              borderRadius="12px"
              leftIcon={<FiPlus />}
            >
              Add
            </HRMSButton>
          </Box>

          {/* RIGHT: List (Edit + Delete only) */}
          <Box flex={1} bg="card-bg" borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor="border-color">
            <Heading size="md" mb={4} color="text-primary">Working Days List</Heading>
            <VStack spacing={0} align="stretch">
              {workingPatterns.map(pattern => (
                <PatternItem
                  key={pattern.id}
                  pattern={pattern}
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

export default WorkingDaysPage;
