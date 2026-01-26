import React, { useState } from 'react';
import {
  Flex,
  VStack,
  HStack,
  Box,
  Heading,
  Text,
  useToast,
  Input,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react';
import { FiEye, FiEdit3, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from './../../../components/atomic/templates/DashboardLayout';
import HRMSButton from './../../../components/atomic/atoms/HRMSButton';
import SectionTitle from './../../../components/atomic/atoms/SectionTitle';

const mockWorkingHours = [
  { id: 1, name: 'Regular 09:00-17:00', start: '09:00', end: '17:00' },
  { id: 2, name: 'Noon 12:00-16:00', start: '12:00', end: '16:00' },
  { id: 3, name: 'Dual Shift 09:00-21:00', start: '09:00', end: '21:00' },
];

// HoursItem (View + Edit + Delete)
const HoursItem = ({ item, onEye, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localName, setLocalName] = useState(item.name);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    if (localName.trim()) {
      console.log('Update hours:', item.id, localName.trim());
      // TODO: parent onUpdate(item.id, localName)
    }
    setIsEditing(false);
  };

  return (
    <Flex 
      p={3} 
      bg="white" 
      border="1px solid"
      borderColor="gray.200"
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
          <>
            <Text fontWeight="500" fontSize="md" mr={2}>
              {item.name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {item.start}-{item.end}
            </Text>
          </>
        )}
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
          onClick={() => onDelete(item.id)}
        >
          Delete
        </HRMSButton>
      </HStack>
    </Flex>
  );
};

const WorkingHoursPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [workingHours, setWorkingHours] = useState(mockWorkingHours);
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');

  const handleAddShift = () => {
    if (!shiftName.trim()) {
      toast({ title: 'Enter shift name', status: 'warning' });
      return;
    }
    const newShift = {
      id: Date.now(),
      name: shiftName.trim(),
      start: startTime,
      end: endTime,
    };
    setWorkingHours(prev => [...prev, newShift]);
    setShiftName('');
    setStartTime('09:00');
    setEndTime('17:00');
    toast({ title: 'Shift added!', status: 'success' });
  };

  const handleEyeClick = (item) => {
    navigate('/attendance/dashboard', {
      state: { filterType: 'workingHours', filterValue: item.name },
    });
  };

  const handleDelete = (id) => {
    setWorkingHours(prev => prev.filter(shift => shift.id !== id));
    toast({ title: 'Shift deleted', status: 'success' });
  };

  return (
    <DashboardLayout>
      <VStack spacing={6} align="stretch" p={{ base: 4, md: 6 }}>
        <SectionTitle>Working Hours</SectionTitle>

        {/* TWO COLUMNS */}
        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          
          {/* LEFT: Shift Name + Time Inputs + Add */}
          <Box flex={1} bg="white" borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor="gray.100">
            <Heading size="md" mb={4} color="gray.800">Create Working Hours</Heading>
            
            <Input
              placeholder="Shift name (e.g. Regular 09:00-17:00)"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              mb={4}
              size="lg"
            />
            
            <Text mb={2} fontWeight="500" color="gray.700">Time Range:</Text>
            <HStack spacing={4} mb={6}>
              <InputGroup flex={1}>
                <InputLeftAddon children="Start" bg="gray.50" />
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  size="lg"
                />
              </InputGroup>
              <InputGroup flex={1}>
                <InputLeftAddon children="End" bg="gray.50" />
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  size="lg"
                />
              </InputGroup>
            </HStack>

            <HRMSButton
              onClick={handleAddShift}
              w="full"
              h={12}
              bgGradient="linear(to-r, #307DC7, #C1B9B8)"
              color="white"
              borderRadius="full"
              leftIcon={<FiPlus />}
              fontSize="lg"
            >
              Add
            </HRMSButton>
          </Box>

          {/* RIGHT: Hours List (View + Edit + Delete) */}
          <Box flex={1} bg="white" borderRadius="lg" p={6} boxShadow="md" borderWidth={1} borderColor="gray.100">
            <Heading size="md" mb={4} color="gray.800">Working Hours List</Heading>
            <VStack spacing={0} align="stretch">
              {workingHours.map(shift => (
                <HoursItem
                  key={shift.id}
                  item={shift}
                  onEye={handleEyeClick}
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

export default WorkingHoursPage;
