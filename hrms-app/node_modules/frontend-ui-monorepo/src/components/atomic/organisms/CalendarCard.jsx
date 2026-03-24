import React, { useEffect } from "react";
import {
  Box, Flex, SimpleGrid, Text, Button, Badge, Spinner,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useCalendar } from "@/contexts/CalendarContext";  // ✅ CONTEXT

const getCalendarData = async (targetYear, targetMonth) => {
  // Events (keep year filter)
  const startOfMonth = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-01`;
  const { data: events } = await supabase.from("events").select("date").gte("date", startOfMonth);

  // BIRTHDAYS: MONTH/DAY only
  const { data: allBirthdays } = await supabase
    .from("employees")
    .select("birthdate")
    .not("birthdate", "is", null);

  const targetMonthNum = targetMonth + 1;
  const birthdaysThisMonth = allBirthdays?.filter(b => 
    new Date(b.birthdate).getMonth() + 1 === targetMonthNum
  ) || [];

  return { events, birthdays: birthdaysThisMonth };
};


const CalendarCard = ({ minH }) => {
  // ✅ USE CONTEXT
  const { calendarMonth, setCalendarMonth } = useCalendar();
  const { year, month } = calendarMonth;
  
  const today = new Date().toISOString().slice(0, 10);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const { data: { events = [], birthdays = [] } = {}, isLoading, refetch } = useQuery({
    queryKey: ["calendar", year, month],
    queryFn: () => getCalendarData(year, month),
    staleTime: 500,
    refetchOnMount: "always",
  });

  const prevMonth = () => {
    const newMonth = month - 1 < 0 ? 11 : month - 1;
    const newYear = month - 1 < 0 ? year - 1 : year;
    setCalendarMonth({ year: newYear, month: newMonth });
  };

  const nextMonth = () => {
    const newMonth = month + 1 > 11 ? 0 : month + 1;
    const newYear = month + 1 > 11 ? year + 1 : year;
    setCalendarMonth({ year: newYear, month: newMonth });
  };

  const goToToday = () => {
    setCalendarMonth({
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
    });
  };

  const getDayBadges = (day) => {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventCount = events?.filter(e => e.date?.slice(0, 10) === dayStr).length || 0;
    const birthdayCount = birthdays?.filter(b => b.birthdate?.slice(0, 10) === dayStr).length || 0;

    return [
      eventCount > 0 && `📅 ${eventCount}`,
      birthdayCount > 0 && `🎂 ${birthdayCount}`,
    ].filter(Boolean);
  };

  const renderDays = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<Box key={`empty-${i}`} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dayStr === today;
      const badges = getDayBadges(day);
      
      cells.push(
        <Button
          key={day}
          size="xs"
          variant={isToday ? "solid" : "ghost"}
          colorScheme={isToday ? "purple" : "gray"}
          borderRadius="full"
          minH="32px"
          fontSize="xs"
          fontWeight="semibold"
          p={0}
          position="relative"
          overflow="hidden"
          _hover={{ bg: isToday ? "purple.500" : "gray.100" }}
        >
          <Text>{day}</Text>
          {badges.length > 0 && (
            <Box position="absolute" bottom={0} right={0} p={0.5}>
              <SimpleGrid columns={2} spacing={0}>
                {badges.map((badge, i) => (
                  <Badge
                    key={i}
                    fontSize="2xs"
                    colorScheme={i === 0 ? "purple" : "pink"}
                    variant="subtle"
                    borderRadius="full"
                  >
                    {badge}
                  </Badge>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Button>
      );
    }
    return cells;
  };

  if (isLoading) {
    return (
      <HRMSCard minH={minH}>
        <SectionTitle>Calendar</SectionTitle>
        <Flex align="center" justify="center" py={8}>
          <Spinner size="sm" />
        </Flex>
      </HRMSCard>
    );
  }

  return (
    <HRMSCard minH={minH}>
      <Flex justify="space-between" align="center" mb={4}>
        <SectionTitle>Calendar</SectionTitle>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<FiCalendar />}
          bg="#7152F31A"
          borderRadius="full"
          color="#7152F3"
          _hover={{ bg: "#7152F333" }}
          onClick={goToToday}
        >
          Today
        </Button>
      </Flex>

      <Flex justify="space-between" align="center" mb={3}>
        <Text fontWeight="semibold">{monthName}</Text>
        <Flex gap={1}>
          <Button size="xs" variant="outline" leftIcon={<FiChevronLeft />} onClick={prevMonth} />
          <Button size="xs" variant="outline" rightIcon={<FiChevronRight />} onClick={nextMonth} />
        </Flex>
      </Flex>

      <SimpleGrid columns={7} spacing={1} mb={2}>
        {days.map((d) => (
          <Text key={d} fontSize="xs" textAlign="center" color="gray.500" fontWeight="medium">
            {d}
          </Text>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={7} spacing={1}>
        {renderDays()}
      </SimpleGrid>
    </HRMSCard>
  );
};

export default CalendarCard;
