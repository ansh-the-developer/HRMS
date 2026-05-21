// src/components/atomic/organisms/NoticeBoardCard.jsx

import React from "react";
import {
  Text, VStack, Spinner, useDisclosure, useToast,
  Flex, Box, Badge, HStack, Button,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Input, Textarea, Checkbox,
} from "@chakra-ui/react";
import HRMSCard from "@/components/atomic/molecules/HRMSCard";
import SectionTitle from "@/components/atomic/atoms/SectionTitle";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from "@/services/homeApi";
import { useRole } from "@/hooks/useRole";

const NoticeBoardCard = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingNotice, setEditingNotice] = React.useState(null);
  const { isHR, isLoading: isRoleLoading } = useRole();

  const { data: notices = [], isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: getNotices,
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const { id, ...updates } = payload;
      if (id) {
        return updateNotice(id, updates);
      } else {
        return createNotice(updates);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({ title: "Notice saved", status: "success", duration: 3000, isClosable: true });
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

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteNotice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast({ title: "Notice deleted", status: "info", duration: 3000, isClosable: true });
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
    if (!isHR) return;
    setEditingNotice(null);
    onOpen();
  };

  const openEditModal = (notice) => {
    if (!isHR) return;
    setEditingNotice(notice);
    onOpen();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isHR) return;

    const fd = new FormData(e.target);
    saveMutation.mutate({
      id: editingNotice?.id,
      title: fd.get("title"),
      body: fd.get("body"),
      pinned: fd.get("pinned") === "on",
    });
  };

  const togglePin = (notice) => {
    if (!isHR) return;
    saveMutation.mutate({
      id: notice.id,
      title: notice.title,
      body: notice.body,
      pinned: !notice.pinned,
    });
  };

  const handleDelete = (notice) => {
    if (!isHR) return;
    if (!window.confirm("Delete this notice?")) return;
    deleteMutation.mutate(notice.id);
  };

  if (isLoading || isRoleLoading) {
    return (
      <HRMSCard>
        <SectionTitle>Notice Board</SectionTitle>
        <VStack align="start" spacing={2} py={8}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500">Loading notices...</Text>
        </VStack>
      </HRMSCard>
    );
  }

  return (
    <>
      <HRMSCard>
        <Flex justify="space-between" align="center" mb={4}>
          <SectionTitle>Notice Board</SectionTitle>
          {isHR && (
            <HRMSButton
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={openCreateModal}
              withPlusIcon
            >
              Add Notice
            </HRMSButton>
          )}
        </Flex>

        {notices.length === 0 ? (
          <VStack align="start" py={8} spacing={2}>
            <Text fontSize="sm" color="gray.500">No notices yet</Text>
            {isHR && (
              <Text fontSize="xs" color="gray.400">
                Click Add Notice to create your first one
              </Text>
            )}
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
                  <Box flex={1}>
                    <HStack spacing={2} mb={1}>
                      {notice.title && (
                        <Text fontSize="sm" fontWeight="medium" color="blue.600">
                          {notice.title}
                        </Text>
                      )}
                      {notice.pinned && (
                        <Badge colorScheme="orange" fontSize="xs">📌 Pinned</Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.700" lineHeight="short">
                      {notice.body}
                    </Text>
                  </Box>

                  {isHR && (
                    <VStack spacing={1} align="flex-end" flexShrink={0}>
                      <Button
                        size="xs"
                        variant={notice.pinned ? "solid" : "ghost"}
                        colorScheme={notice.pinned ? "orange" : "gray"}
                        onClick={() => togglePin(notice)}
                        isLoading={saveMutation.isPending}
                      >
                        {notice.pinned ? "Unpin" : "Pin"}
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openEditModal(notice)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(notice)}
                        isLoading={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    </VStack>
                  )}
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </HRMSCard>

      {isHR && (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
          <form onSubmit={handleSubmit}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{editingNotice ? "Edit Notice" : "Create New Notice"}</ModalHeader>
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
                  <Checkbox name="pinned" defaultChecked={editingNotice?.pinned || false}>
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
      )}
    </>
  );
};

export default NoticeBoardCard;