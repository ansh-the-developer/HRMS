import React from "react";
import {
  Text,
  VStack,
  Spinner,
  IconButton,
  useDisclosure,
  useToast,
  Flex,
  Box,
  Badge,
  HStack,
  Button,
} from "@chakra-ui/react";
import { AddIcon, EditIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotices } from "@/services/homeApi";
import { supabase } from "@/lib/supabaseClient";

const NoticeBoardCard = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  // Modal state (used for both create + edit)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingNotice, setEditingNotice] = React.useState(null);

  // Fetch notices
  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: getNotices,
  });

  // Create / update notice
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (payload.id) {
        // update
        const { data, error } = await supabase
          .from("notices")
          .update({
            title: payload.title,
            body: payload.body,
            pinned: payload.pinned,
          })
          .eq("id", payload.id)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        // create
        const { data, error } = await supabase
          .from("notices")
          .insert({
            title: payload.title,
            body: payload.body,
            pinned: payload.pinned,
          })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({
        title: "Notice saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEditingNotice(null);
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Failed to save notice",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // Delete notice
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("notices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({
        title: "Notice deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete notice",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const openCreateModal = () => {
    setEditingNotice(null);
    onOpen();
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      id: editingNotice?.id,
      title: formData.get("title"),
      body: formData.get("body"),
      pinned: formData.get("pinned") === "on",
    };
    saveMutation.mutate(payload);
  };

  const togglePin = async (notice) => {
    saveMutation.mutate({
      id: notice.id,
      title: notice.title,
      body: notice.body,
      pinned: !notice.pinned,
    });
  };

  const handleDelete = (notice) => {
    if (!window.confirm("Delete this notice?")) return;
    deleteMutation.mutate(notice.id);
  };

  if (isLoading) {
    return (
      <HRMSCard>
        <SectionTitle>Notice Board</SectionTitle>
        <VStack align="start" spacing={2} py={8}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500">
            Loading notices...
          </Text>
        </VStack>
      </HRMSCard>
    );
  }

  return (
    <>
      <HRMSCard>
        <Flex justify="space-between" align="center" mb={4}>
          <SectionTitle>Notice Board</SectionTitle>
          <IconButton
            icon={<AddIcon />}
            size="sm"
            colorScheme="blue"
            variant="outline"
            aria-label="Add notice"
            onClick={openCreateModal}
          />
        </Flex>

        {notices.length === 0 ? (
          <VStack align="start" py={8} spacing={2}>
            <Text fontSize="sm" color="gray.500">
              No notices yet
            </Text>
            <Text fontSize="xs" color="gray.400">
              Click + to add your first notice
            </Text>
          </VStack>
        ) : (
          <VStack align="stretch" spacing={4}>
            {notices.map((notice) => (
              <Box
                key={notice.id}
                w="full"
                p={3}
                borderRadius="md"
                bg={notice.pinned ? "orange.50" : "gray.50"}
              >
                <Flex justify="space-between" align="flex-start" gap={3}>
                  <Box>
                    <HStack spacing={2} mb={1}>
                      {notice.title && (
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="blue.600"
                        >
                          {notice.title}
                        </Text>
                      )}
                      {notice.pinned && (
                        <Badge colorScheme="orange" fontSize="xs">
                          📌 Pinned
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="short">
                      {notice.body}
                    </Text>
                  </Box>

                  <HStack spacing={1}>
                    {/* Pin toggle */}
                    <IconButton
                      aria-label="Pin to top"
                      icon={<StarIcon />}
                      size="xs"
                      variant={notice.pinned ? "solid" : "ghost"}
                      colorScheme={notice.pinned ? "orange" : "gray"}
                      onClick={() => togglePin(notice)}
                    />

                    {/* Edit */}
                    <IconButton
                      aria-label="Edit notice"
                      icon={<EditIcon />}
                      size="xs"
                      variant="ghost"
                      onClick={() => openEditModal(notice)}
                    />
                    {/* Delete */}
                    <IconButton
                      aria-label="Delete notice"
                      icon={<DeleteIcon />}
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(notice)}
                    />
                  </HStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </HRMSCard>

      {/* Add / Edit Notice Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <form onSubmit={handleSubmit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {editingNotice ? "Edit Notice" : "Create New Notice"}
            </ModalHeader>
            <ModalBody>
              <VStack spacing={4}>
                <Input
                  name="title"
                  placeholder="Notice title (optional)"
                  size="sm"
                  maxLength={100}
                  defaultValue={editingNotice?.title || ""}
                />
                <Textarea
                  name="body"
                  placeholder="Write your notice..."
                  rows={4}
                  size="sm"
                  required
                  defaultValue={editingNotice?.body || ""}
                />
                <Checkbox
                  name="pinned"
                  defaultChecked={editingNotice?.pinned || false}
                >
                  📌 Pin to top
                </Checkbox>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button size="sm" mr={3} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                colorScheme="blue"
                isLoading={saveMutation.isPending}
              >
                {editingNotice ? "Save changes" : "Publish"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default NoticeBoardCard;
