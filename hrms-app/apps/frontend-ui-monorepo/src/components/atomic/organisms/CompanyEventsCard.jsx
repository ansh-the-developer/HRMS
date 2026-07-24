import React, { useState } from "react";
import {
  Box, Flex, HStack, VStack, Text, Spinner, Button,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Input, Textarea,
  useDisclosure, useToast,
} from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import InfoRow from "@/components/atomic/molecules/InfoRow";
import LegendItem from "@/components/atomic/molecules/LegendItem";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useRole } from "@/hooks/useRole";

const getStatus = (dateStr) => {
  return new Date(dateStr) >= new Date() ? "upcoming" : "past";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "2-digit",
  });
};

const getEvents = async () => {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return data;
};

const CompanyEventsCard = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const { isHR, isLoading: isRoleLoading } = useRole();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) {
        const { error } = await supabase
          .from("events")
          .update({
            title: payload.title,
            date: payload.date,
            description: payload.description,
            location: payload.location,
          })
          .eq("id", payload.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("events")
          .insert({
            title: payload.title,
            date: payload.date,
            description: payload.description,
            location: payload.location,
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Event saved", status: "success", duration: 3000, isClosable: true });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to save",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error, data } = await supabase
        .from("events")
        .delete()
        .eq("id", id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Delete failed: row not found or permission denied.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Event deleted", status: "info", duration: 3000, isClosable: true });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const openCreateModal = () => {
    if (!isHR) return;
    resetForm();
    onOpen();
  };

  const openEditModal = (event) => {
    if (!isHR) return;
    setEditingEvent(event);
    setTitle(event.title || "");
    setDate(event.date ? event.date.slice(0, 10) : "");
    setDescription(event.description || "");
    setLocation(event.location || "");
    onOpen();
  };

  const resetForm = () => {
    setEditingEvent(null);
    setTitle("");
    setDate("");
    setDescription("");
    setLocation("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isHR) return;

    if (!title || !date) {
      toast({ title: "Please fill title and date", status: "warning", duration: 3000 });
      return;
    }

    saveMutation.mutate({
      id: editingEvent?.id,
      title,
      date: new Date(date).toISOString(),
      description,
      location,
    });
  };

  const handleDelete = (event) => {
    if (!isHR) return;
    if (!window.confirm(`Delete "${event.title}"?`)) return;
    deleteMutation.mutate(event.id);
  };

  if (isLoading || isRoleLoading) {
    return (
      <HRMSCard>
        <SectionTitle>Company Events</SectionTitle>
        <Flex align="center" gap={3} py={8} justify="center">
          <Spinner size="sm" />
          <Text fontSize="sm" color="text-muted">Loading events...</Text>
        </Flex>
      </HRMSCard>
    );
  }

  return (
    <>
      <HRMSCard>
        <Flex justify="space-between" align="center" mb={4}>
          <SectionTitle>Company Events</SectionTitle>
          {isHR && (
            <HRMSButton withPlusIcon onClick={openCreateModal}>
              Add an Event
            </HRMSButton>
          )}
        </Flex>

        <Box mb={4}>
          {events.length === 0 ? (
            <VStack align="start" py={8} spacing={2}>
              <Text fontSize="sm" color="text-muted">No events yet</Text>
              {isHR && (
                <Text fontSize="xs" color="text-muted">
                  Click Add an Event to create one
                </Text>
              )}
            </VStack>
          ) : (
            <VStack align="stretch" spacing={0}>
              {events.map((e) => (
                <Flex key={e.id} align="center" justify="space-between" gap={2}>
                  <Box flex={1}>
                    <InfoRow
                      left={formatDate(e.date)}
                      right={e.title}
                      status={getStatus(e.date)}
                    />
                  </Box>

                  {isHR && (
                    <HStack spacing={1} flexShrink={0}>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openEditModal(e)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(e)}
                        isLoading={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </HStack>
                  )}
                </Flex>
              ))}
            </VStack>
          )}
        </Box>

        <HStack spacing={4}>
          <LegendItem label="Upcoming" color="purple.500" />
          <LegendItem label="Past Events" color="text-muted" />
        </HStack>
      </HRMSCard>

      {isHR && (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <form onSubmit={handleSubmit}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{editingEvent ? "Edit Event" : "Add New Event"}</ModalHeader>
              <ModalBody>
                <VStack spacing={4}>
                  <Input
                    placeholder="Event title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="sm"
                    required
                  />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    size="sm"
                    required
                  />
                  <Input
                    placeholder="Location (optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    size="sm"
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    size="sm"
                    rows={3}
                  />
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  mr={3}
                  variant="ghost"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  colorScheme="blue"
                  isLoading={saveMutation.isPending}
                >
                  {editingEvent ? "Save changes" : "Add Event"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      )}
    </>
  );
};

export default CompanyEventsCard;