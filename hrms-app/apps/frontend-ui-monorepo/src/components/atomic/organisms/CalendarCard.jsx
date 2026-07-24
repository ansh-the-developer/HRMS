import React from "react";
import {
  Box,
  Flex,
  SimpleGrid,
  Text,
  Button,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import { supabase } from "@/lib/supabaseClient";
import { useCalendar } from "@/contexts/CalendarContext";

const parseSafeDate = (value) => {
  if (!value) return null;
  const dateOnly = String(value).slice(0, 10);
  const [y, m, d] = dateOnly.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const getCalendarData = async (targetYear, targetMonth) => {
  const startOfMonth = `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-01`;
  const endOfMonth = `${targetYear}-${String(targetMonth + 1).padStart(2, "0")}-${String(
    new Date(targetYear, targetMonth + 1, 0).getDate()
  ).padStart(2, "0")}`;

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("date")
    .gte("date", startOfMonth)
    .lte("date", endOfMonth);

  if (eventsError) throw eventsError;

  const { data: allBirthdays, error: birthdaysError } = await supabase
    .from("employees")
    .select("birthdate")
    .not("birthdate", "is", null);

  if (birthdaysError) throw birthdaysError;

  const birthdaysThisMonth =
    allBirthdays?.filter((b) => {
      const birthDate = parseSafeDate(b.birthdate);
      return birthDate && birthDate.getMonth() === targetMonth;
    }) || [];

  return { events: events || [], birthdays: birthdaysThisMonth };
};

const CalendarCard = ({ minH }) => {
  const { calendarMonth, setCalendarMonth } = useCalendar();
  const { year, month } = calendarMonth;

  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const monthName = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const {
    data: { events = [], birthdays = [] } = {},
    isLoading,
  } = useQuery({
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
    const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const eventCount =
      events?.filter((e) => String(e.date || "").slice(0, 10) === dayStr).length || 0;

    const birthdayCount =
      birthdays?.filter((b) => {
        const birthDate = parseSafeDate(b.birthdate);
        return birthDate && birthDate.getMonth() === month && birthDate.getDate() === day;
      }).length || 0;

    return [
      eventCount > 0 && `📅 ${eventCount}`,
      birthdayCount > 0 && `🎂 ${birthdayCount}`,
    ].filter(Boolean);
  };

  const renderDays = () => {
    const cells = [];

    for (let i = 0; i < firstDay; i += 1) {
      cells.push(<Box key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const dayStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isToday = dayStr === today;
      const badges = getDayBadges(day);

      cells.push(
        <Button
          key={day}
          size="xs"
          variant={isToday ? "solid" : "ghost"}
          colorScheme={isToday ? "purple" : undefined}
          borderRadius="full"
          minH="32px"
          fontSize="xs"
          fontWeight="semibold"
          p={0}
          position="relative"
          overflow="hidden"
          _hover={{ bg: isToday ? "purple.500" : "hover-bg" }}
        >
          <Text>{day}</Text>

          {badges.length > 0 && (
            <Box position="absolute" bottom={0} right={0} p={0.5}>
              <SimpleGrid columns={2} spacing={0}>
                {badges.map((badge, i) => (
                  <Badge
                    key={`${badge}-${i}`}
                    fontSize="2xs"
                    colorScheme={badge.includes("🎂") ? "pink" : "purple"}
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
          bg="rgba(99, 102, 241, 0.10)"
          borderRadius="full"
          color="accent"
          _hover={{ bg: "rgba(99, 102, 241, 0.20)" }}
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
          <Text key={d} fontSize="xs" textAlign="center" color="text-muted" fontWeight="medium">
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