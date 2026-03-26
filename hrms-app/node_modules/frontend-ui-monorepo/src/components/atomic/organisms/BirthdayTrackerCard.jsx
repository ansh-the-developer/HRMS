// BirthdayTrackerCard.jsx
import React from "react";
import {
  VStack, Flex, Spinner, Text, Badge,
} from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import BirthdayListItem from "@/components/atomic/molecules/BirthdayListItem";
import { useEmployees } from "@/hooks";  // ✅ CORRECT
import { useCalendar } from '@/contexts/CalendarContext';

const BirthdayTrackerCard = ({ minH }) => {
  const { calendarMonth } = useCalendar();
  const { year, month } = calendarMonth;

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // ✅ USE CENTRALIZED EMPLOYEES + MONTH/DAY FILTER
  const { data: allEmployees = [], isLoading } = useEmployees();

  // Filter birthdays MONTH/DAY only (client-side)
  const birthdays = React.useMemo(() => {
    const targetMonthNum = month + 1;
    return allEmployees
      ?.filter(emp => {
        if (!emp.birthdate) return false;
        const birthDate = new Date(emp.birthdate);
        return birthDate.getMonth() + 1 === targetMonthNum;
      })
      ?.map(emp => {
        const birthDate = new Date(emp.birthdate);
        return {
          name: emp.name,
          role: emp.designation || emp.department || "Employee",
          date: `${birthDate.getDate()} ${birthDate.toLocaleDateString("en-GB", { month: "short" })}`,
        };
      })
      ?.slice(0, 10) || [];
  }, [allEmployees, month]);

  if (isLoading) {
    return (
      <HRMSCard minH={minH} h="100%">
        <Flex direction="column" h="100%">
          <SectionTitle>Birthday Tracker 🎂</SectionTitle>
          <Flex align="center" justify="center" flex="1" py={8}>
            <Spinner size="sm" />
          </Flex>
        </Flex>
      </HRMSCard>
    );
  }

  return (
    <HRMSCard minH={minH} h="100%">
      <Flex direction="column" h="100%">
        <Flex justify="space-between" align="center" mb={2}>
          <SectionTitle>Birthday Tracker 🎂</SectionTitle>
          <Badge colorScheme="green" fontSize="xs">Central Cache</Badge>
        </Flex>
        
        <Text fontSize="sm" color="gray.500" mb={3} fontWeight="medium">
          {monthName}
        </Text>

        <VStack align="stretch" spacing={2} flex="1">
          {birthdays.length === 0 ? (
            <Flex direction="column" align="center" py={8} gap={2}>
              <Text fontSize="sm" color="gray.500">No birthdays</Text>
              <Text fontSize="xs" color="gray.400">in this month</Text>
            </Flex>
          ) : (
            birthdays.map((b, index) => (
              <BirthdayListItem 
                key={`${b.name}-${index}`}
                name={b.name}
                role={b.role}
                date={b.date}
              />
            ))
          )}
        </VStack>
      </Flex>
    </HRMSCard>
  );
};

export default BirthdayTrackerCard;