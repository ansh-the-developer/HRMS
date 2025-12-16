// src/components/atomic/molecules/DepartmentListItem.jsx
import { Flex, Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

// Reusable list row for Departments/Teams.
// Parent passes callbacks so this row can trigger view/edit/delete actions.
const DepartmentListItem = ({
  name,
  membersLabel,
  onView,
  onEdit,
  onDelete,
}) => (
  <Flex
    align="center"
    justify="space-between"
    py={3}
    px={3}
    // Add a light divider between rows except the last one.
    _notLast={{ borderBottomWidth: "1px", borderColor: "gray.100" }}
  >
    {/* Left side: name + members info */}
    <Box>
      <Text fontSize="sm" fontWeight="semibold">
        {name}
      </Text>
      <Text fontSize="xs" color="gray.500">
        {membersLabel}
      </Text>
    </Box>

    {/* Right side: row actions */}
    <HStack spacing={2}>
      {/* View details for this department/team (navigates with filter state) */}
      <IconButton
        aria-label="View"
        icon={<FiEye />}
        size="xs"
        variant="ghost"
        onClick={onView}
      />
      {/* Start edit flow (e.g. inline rename) */}
      <IconButton
        aria-label="Edit"
        icon={<FiEdit2 />}
        size="xs"
        variant="ghost"
        onClick={onEdit}
      />
      {/* Remove this item from the list */}
      <IconButton
        aria-label="Delete"
        icon={<FiTrash2 />}
        size="xs"
        variant="ghost"
        color="red.500"
        _hover={{ bg: "red.50" }}
        onClick={onDelete}
      />
    </HStack>
  </Flex>
);

export default DepartmentListItem;
