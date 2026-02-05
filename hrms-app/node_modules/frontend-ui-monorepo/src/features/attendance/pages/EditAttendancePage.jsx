import React, { useState } from 'react';
import {
  Flex,
  VStack,
  HStack,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Avatar,
  Badge,
  useToast,
} from '@chakra-ui/react';
import { FiCalendar } from 'react-icons/fi';

import DashboardLayout from './../../../components/atomic/templates/DashboardLayout';
import HRMSButton from './../../../components/atomic/atoms/HRMSButton';
import SectionTitle from './../../../components/atomic/atoms/SectionTitle';

const mockAttendanceData = [
  {
    id: 1,
    date: '2025-08-20',
    employee: { name: 'Jaydeep', designation: 'Medical Assistant', avatar: 'J' },
    location: 'Remote',
    checkIn: '09:24 AM',
    checkOut: '05:32 PM',
  },
  {
    id: 2,
    date: '2025-08-20',
    employee: { name: 'Suyash', designation: 'Data Analyst', avatar: 'S' },
    location: 'Gurgaon',
    checkIn: '09:15 AM',
    checkOut: '05:42 PM',
  },
  {
    id: 3,
    date: '2025-08-20',
    employee: { name: 'Animesh', designation: 'UI/UX Designer', avatar: 'A' },
    location: 'Remote',
    checkIn: '10:29 AM',
    checkOut: '06:14 PM',
  },
  {
    id: 4,
    date: '2025-08-20',
    employee: { name: 'Rohit', designation: 'Sales Manager', avatar: 'R' },
    location: 'Remote',
    checkIn: '10:24 AM',
    checkOut: '06:04 PM',
  },
];

const EditAttendancePage = () => {
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState('2025-08-20');
  const [filteredData, setFilteredData] = useState(mockAttendanceData);
  const [editingId, setEditingId] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');

  const filterByDate = (dateStr) => {
    setSelectedDate(dateStr);
    // Filter mock data by date
    const filtered = mockAttendanceData.filter(item => item.date === dateStr);
    setFilteredData(filtered.length > 0 ? filtered : mockAttendanceData);
  };

  const handleEditTime = (id, field, time) => {
    setEditingId(`${id}-${field}`);
    if (field === 'checkIn') setEditCheckIn(time);
    else setEditCheckOut(time);
  };

  const handleSaveTime = () => {
    toast({ title: 'Time updated!', status: 'success', duration: 1500 });
    setEditingId(null);
    setEditCheckIn('');
    setEditCheckOut('');
  };

  const handleDeleteAttendance = (id) => {
    setFilteredData(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Attendance deleted', status: 'success' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <VStack spacing={6} p={{ base: 4, md: 6 }} align="stretch">
        <SectionTitle>Edit Attendance</SectionTitle>

        {/* Date Filter Row */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
          <HStack>
            <FiCalendar />
            <Text fontWeight="500" fontSize="lg">
              Choose Date: {formatDate(selectedDate)}
            </Text>
          </HStack>
          
          <InputGroup w={{ base: 'full', md: '200px' }}>
            <InputRightElement children={<FiCalendar />} />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => filterByDate(e.target.value)}
              size="lg"
            />
          </InputGroup>
        </Flex>

        {/* Attendance Table */}
        <Box bg="white" borderRadius="lg" overflow="hidden" boxShadow="md">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Employee Name</Th>
                <Th>Designation</Th>
                <Th>Location</Th>
                <Th>Check In Time</Th>
                <Th>Check Out Time</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((record) => (
                <Tr key={record.id} _hover={{ bg: 'gray.50' }}>
                  <Td>
                    <HStack spacing={3}>
                      <Avatar size="sm" name={record.employee.avatar} bg="blue.400" color="white" fontSize="xs" />
                      <Text fontWeight="500">{record.employee.name}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      {record.employee.designation}
                    </Badge>
                  </Td>
                  <Td fontWeight="500">{record.location}</Td>
                  
                  <Td>
                    {editingId === `checkIn-${record.id}` ? (
                      <Input
                        size="sm"
                        value={editCheckIn || record.checkIn}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                        onBlur={handleSaveTime}
                        autoFocus
                      />
                    ) : (
                      <Text fontWeight="500" color="green.600">
                        {record.checkIn}
                      </Text>
                    )}
                  </Td>
                  
                  <Td>
                    {editingId === `checkOut-${record.id}` ? (
                      <Input
                        size="sm"
                        value={editCheckOut || record.checkOut}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                        onBlur={handleSaveTime}
                        autoFocus
                      />
                    ) : (
                      <Text fontWeight="500" color="purple.600">
                        {record.checkOut}
                      </Text>
                    )}
                  </Td>
                  
                  <Td>
                    <HStack spacing={2}>
                      <HRMSButton
                        size="xs"
                        onClick={() => handleEditTime(record.id, 'checkIn', record.checkIn)}
                        fontSize="xs"
                      >
                        Edit In
                      </HRMSButton>
                      <HRMSButton
                        size="xs"
                        onClick={() => handleEditTime(record.id, 'checkOut', record.checkOut)}
                        fontSize="xs"
                      >
                        Edit Out
                      </HRMSButton>
                      <HRMSButton
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDeleteAttendance(record.id)}
                        fontSize="xs"
                      >
                        Delete
                      </HRMSButton>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Save All */}
        <HRMSButton
          onClick={() => toast({ title: 'All changes saved!', status: 'success' })}
          size="lg"
          w="200px"
          mx="auto"
        >
          Save All Changes
        </HRMSButton>
      </VStack>
    </DashboardLayout>
  );
};

export default EditAttendancePage;
