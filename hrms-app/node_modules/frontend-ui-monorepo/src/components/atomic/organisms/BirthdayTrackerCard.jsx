import React from "react";
import {
  VStack, Flex, Spinner, Text, Badge,  // ✅ BADGE ADDED
} from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import BirthdayListItem from "@/components/atomic/molecules/BirthdayListItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useCalendar } from "@/contexts/CalendarContext";

const getBirthdaysForMonth = async (targetYear, targetMonth) => {
  // Get ALL birthdays (ignore year)
  const { data: employees } = await supabase
    .from("employees")
    .select("id, name, designation, department, birthdate")
    .not("birthdate", "is", null);

  // ✅ MONTH/DAY ONLY FILTER
  const targetMonthNum = targetMonth + 1;
  return employees
    ?.filter(emp => {
      const birthDate = new Date(emp.birthdate);
      return birthDate.getMonth() + 1 === targetMonthNum;
    })
    ?.map(emp => {
      const birthDate = new Date(emp.birthdate);
      return {
        name: emp.name,
        role: emp.designation || emp.department || "Employee",
        date: birthDate.getDate() + " " + birthDate.toLocaleDateString("en-GB", { month: "short" }),
      };
    })
    ?.slice(0, 10) || [];
};

const BirthdayTrackerCard = ({ minH }) => {
  const { calendarMonth } = useCalendar();
  const { year, month } = calendarMonth;

  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const { data: birthdays = [], isLoading } = useQuery({
    queryKey: ["birthdays-month-day", year, month],
    queryFn: () => getBirthdaysForMonth(year, month),
    staleTime: 1000,
  });

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
          <Badge colorScheme="green" fontSize="xs">Month/Day Sync</Badge>
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
