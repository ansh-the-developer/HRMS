// src/features/attendance/pages/WorkingDaysPage.jsx
import { useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";

import DashboardLayout from "@/components/atomic/templates/DashboardLayout";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";

import WorkingDaysForm from "../components/organisms/WorkingDaysForm";
import WorkingDaysList from "../components/organisms/WorkingDaysList";

/* Mock data – will be replaced by API later */
const INITIAL_WORKING_DAYS = [
  {
    id: "wd-1",
    name: "Monday To Saturday",
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },
  {
    id: "wd-2",
    name: "Monday To Friday",
    days: ["Mo", "Tu", "We", "Th", "Fr"],
  },
  {
    id: "wd-3",
    name: "Monday, Tuesday, Wednesday",
    days: ["Mo", "Tu", "We"],
  },
  {
    id: "wd-4",
    name: "Saturday Only",
    days: ["Sa"],
  },
  {
    id: "wd-5",
    name: "Thursday, Friday, Saturday",
    days: ["Th", "Fr", "Sa"],
  },
];

const WorkingDaysPage = () => {
  const [workingDays, setWorkingDays] = useState(INITIAL_WORKING_DAYS);
  const [editingId, setEditingId] = useState(null);

  const editingItem = workingDays.find((w) => w.id === editingId);

  const handleAddOrUpdate = (payload) => {
    if (editingId) {
      setWorkingDays((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...payload } : item
        )
      );
      setEditingId(null);
      return;
    }

    setWorkingDays((prev) => [
      ...prev,
      {
        id: `wd-${Date.now()}`,
        ...payload,
      },
    ]);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this working day rule?"
    );
    if (!confirmed) return;

    setWorkingDays((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DashboardLayout>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {/* Left: Working Days Form */}
        <HRMSCard>
          <WorkingDaysForm
            value={editingItem}
            onSubmit={handleAddOrUpdate}
            onCancelEdit={() => setEditingId(null)}
          />
        </HRMSCard>

        {/* Right: Existing Rules */}
        <HRMSCard>
          <WorkingDaysList
            items={workingDays}
            onEdit={(id) => setEditingId(id)}
            onDelete={handleDelete}
          />
        </HRMSCard>
      </SimpleGrid>
    </DashboardLayout>
  );
};

export default WorkingDaysPage;
