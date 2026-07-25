import React, { useState } from "react";
import {
  Box,
  Flex,
  HStack,
  Text,
  Spinner,
  useDisclosure,
  useToast,
  VStack,
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
} from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiDownload } from "react-icons/fi";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import InfoRow from "@/components/atomic/molecules/InfoRow";
import LegendItem from "@/components/atomic/molecules/LegendItem";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "@/services/homeApi";
import { useRole } from "@/hooks/useRole";

const HolidaysCard = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("Public");
  const { isHR, isLoading: isRoleLoading } = useRole();

  const { data: holidays = [], isLoading } = useQuery({
    queryKey: ["holidays"],
    queryFn: getHolidays,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) {
        return updateHoliday(payload.id, {
          name: payload.name,
          date: payload.date,
          type: payload.type,
        });
      }
      return createHoliday({
        name: payload.name,
        date: payload.date,
        type: payload.type,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast({
        title: "Holiday saved!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to save holiday",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteHoliday(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holidays"] });
      toast({
        title: "Holiday deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete holiday",
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
    setEditingHoliday(null);
    onOpen();
  };

  const openEditModal = (holiday) => {
    if (!isHR) return;
    setEditingHoliday(holiday);
    setName(holiday.name || "");
    setDate(holiday.date || "");
    setType(holiday.type || "Public");
    onOpen();
  };

  const resetForm = () => {
    setName("");
    setDate("");
    setType("Public");
    setEditingHoliday(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isHR) return;

    if (!name || !date) {
      toast({
        title: "Please fill name and date",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    saveMutation.mutate({
      id: editingHoliday?.id,
      name,
      date,
      type,
    });
  };

  const handleDelete = (holiday) => {
    if (!isHR) return;
    if (!window.confirm(`Delete holiday "${holiday.name}"?`)) return;
    deleteMutation.mutate(holiday.id);
  };

  if (isLoading || isRoleLoading) {
    return (
      <HRMSCard>
        <SectionTitle>Holidays</SectionTitle>
        <Box py={8}>
          <Flex align="center" justify="center" gap={3}>
            <Spinner size="sm" />
            <Text fontSize="sm" color="text-muted">
              Loading holidays...
            </Text>
          </Flex>
        </Box>
      </HRMSCard>
    );
  }

  return (
    <>
      <HRMSCard>
        <Flex justify="space-between" align="center" mb={4}>
          <SectionTitle>Holidays</SectionTitle>
          {isHR && (
            <HRMSButton withPlusIcon onClick={openCreateModal}>
              Add New Holiday
            </HRMSButton>
          )}
        </Flex>

        <Box mb={4}>
          {holidays.length === 0 ? (
            <Box py={8} textAlign="center">
              <Text fontSize="sm" color="text-muted">
                No holidays yet
              </Text>
              {isHR && (
                <Text fontSize="xs" color="text-muted" mt={1}>
                  Add your first holiday above
                </Text>
              )}
            </Box>
          ) : (
            <VStack align="stretch" spacing={2}>
              {holidays.map((holiday) => (
                <Flex
                  key={holiday.id}
                  justify="space-between"
                  align="center"
                  w="full"
                  gap={3}
                >
                  <InfoRow
                    left={holiday.date}
                    right={holiday.name}
                    status={holiday.type?.toLowerCase() || "upcoming"}
                  />

                  {isHR && (
                    <HStack spacing={1} flexShrink={0}>
                      <IconButton
                        aria-label="Edit Holiday"
                        icon={<FiEdit2 />}
                        size="xs"
                        variant="ghost"
                        color="text-secondary"
                        _hover={{ bg: "hover-bg", color: "accent" }}
                        onClick={() => openEditModal(holiday)}
                      />
                      <IconButton
                        aria-label="Delete Holiday"
                        icon={<FiTrash2 />}
                        size="xs"
                        variant="ghost"
                        color="red.400"
                        _hover={{ bg: "rgba(239, 68, 68, 0.15)" }}
                        onClick={() => handleDelete(holiday)}
                        isLoading={deleteMutation.isPending}
                      />
                    </HStack>
                  )}
                </Flex>
              ))}
            </VStack>
          )}
        </Box>

        <Flex justify="space-between" align="center" pt={2} borderTop="1px solid" borderColor="border-color">
          <HStack spacing={4}>
            <LegendItem label="Public" color="red.400" />
            <LegendItem label="Company" color="purple.400" />
            <LegendItem label="Optional" color="amber.400" />
          </HStack>

          <HStack spacing={2}>
            <Button
              size="xs"
              variant="outline"
              leftIcon={<FiDownload />}
              borderRadius="lg"
              borderColor="border-color"
              _hover={{ bg: "hover-bg" }}
              onClick={() => {
                const csvHeader = "Date,Name,Type\n";
                const csvRows = holidays.map((h) => `"${h.date}","${h.name}","${h.type}"`).join("\n");
                const blob = new Blob([csvHeader + csvRows], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "holidays.csv";
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </Button>
          </HStack>
        </Flex>
      </HRMSCard>

      {isHR && (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <form onSubmit={handleSubmit}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                {editingHoliday ? "Edit Holiday" : "Add New Holiday"}
              </ModalHeader>
              <ModalBody>
                <VStack spacing={4}>
                  <Input
                    placeholder="Holiday name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="sm"
                    required
                  />
                  <Input
                    type="date"
                    placeholder="Select date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    size="sm"
                    required
                  />
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    size="sm"
                  >
                    <option value="Public">Public Holiday</option>
                    <option value="Company">Company Holiday</option>
                    <option value="Optional">Optional Holiday</option>
                  </Select>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  mr={3}
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  colorScheme="blue"
                  isLoading={saveMutation.isPending}
                >
                  {editingHoliday ? "Save changes" : "Add Holiday"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      )}
    </>
  );
};

export default HolidaysCard;