import React, { useState } from 'react';
import {
  Box, Flex, Grid, GridItem, Input,
  Text, IconButton, useToast,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import { salaryStructureMockData } from '../constants/payrollMockData';

// ─── Storage helpers ──────────────────────────────────────────────────────────
const KEYS = {
  earnings: 'hrms_sal_earnings',
  deductions: 'hrms_sal_deductions',
};

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// ─── Inline SVG Icons ───────────────────────────────────
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

// ─── Reusable Panel ───────────────────────────────────────────────────────────
function StructurePanel({ title, placeholder, storageKey, initialItems }) {
  const toast = useToast();
  const [items, setItems] = useState(() => load(storageKey, initialItems));
  const [inputVal, setInputVal] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const persist = (updated) => {
    setItems(updated);
    save(storageKey, updated);
  };

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (!trimmed) {
      toast({ title: 'Please enter a name', status: 'warning', duration: 2000, isClosable: true, position: 'top-right' });
      return;
    }
    if (items.some((i) => i.name.toLowerCase() === trimmed.toLowerCase())) {
      toast({ title: 'Already exists', status: 'error', duration: 2000, isClosable: true, position: 'top-right' });
      return;
    }
    persist([...items, { id: Date.now(), name: trimmed }]);
    setInputVal('');
    toast({ title: `"${trimmed}" added`, status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
  };

  const handleDelete = (id, name) => {
    persist(items.filter((i) => i.id !== id));
    toast({ title: `"${name}" deleted`, status: 'info', duration: 2000, isClosable: true, position: 'top-right' });
  };

  const startEdit = (item) => { setEditingId(item.id); setEditVal(item.name); };

  const saveEdit = (id) => {
    const trimmed = editVal.trim();
    if (!trimmed) return;
    persist(items.map((i) => (i.id === id ? { ...i, name: trimmed } : i)));
    setEditingId(null);
    setEditVal('');
    toast({ title: 'Updated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
  };

  const cancelEdit = () => { setEditingId(null); setEditVal(''); };

  return (
    <Flex direction="column" gap={5}>
      {/* Title */}
      <Text fontWeight="semibold" fontSize="md" color="gray.700">{title}</Text>

      {/* Input + Add */}
      <Flex direction="column" gap={3}>
        <Input
          placeholder={placeholder}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          bg="white"
          borderColor="gray.300"
          fontSize="sm"
          _placeholder={{ color: 'gray.400' }}
        />
        <HRMSButton w="full" onClick={handleAdd}>
          Add
        </HRMSButton>
      </Flex>

      {/* List */}
      <Box border="1px solid" borderColor="gray.200" borderRadius="md" overflow="hidden">
        {items.length === 0 && (
          <Flex justify="center" py={6}>
            <Text fontSize="sm" color="gray.400">No items yet</Text>
          </Flex>
        )}
        {items.map((item, idx) => (
          <Flex
            key={item.id}
            align="center"
            justify="space-between"
            px={4} py={3}
            borderBottom={idx < items.length - 1 ? '1px solid' : 'none'}
            borderColor="gray.100"
            _hover={{ bg: 'gray.50' }}
            gap={3}
          >
            {/* Name or Edit Input */}
            {editingId === item.id ? (
              <Input
                value={editVal}
                onChange={(e) => setEditVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit(item.id);
                  if (e.key === 'Escape') cancelEdit();
                }}
                size="sm"
                autoFocus
                flex="1"
              />
            ) : (
              <Text fontSize="sm" fontWeight="medium" color="gray.700" flex="1">
                {item.name}
              </Text>
            )}

            {/* Actions */}
            <Flex gap={1} align="center">
              {editingId === item.id ? (
                <>
                  <HRMSButton size="xs" onClick={() => saveEdit(item.id)}>
                    Save
                  </HRMSButton>
                  <HRMSButton size="xs" variant="outline" onClick={cancelEdit}>
                    Cancel
                  </HRMSButton>
                </>
              ) : (
                <>
                  <IconButton
                    icon={<EditIcon />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'blue.500' }}
                    aria-label="Edit"
                    onClick={() => startEdit(item)}
                  />
                  <IconButton
                    icon={<TrashIcon />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: 'red.500' }}
                    aria-label="Delete"
                    onClick={() => handleDelete(item.id, item.name)}
                  />
                </>
              )}
            </Flex>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SalaryStructurePage() {
  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 6 }} py={6}>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10}>
          <GridItem>
            <StructurePanel
              title="Add Earning Types"
              placeholder="Earning"
              storageKey={KEYS.earnings}
              initialItems={salaryStructureMockData.earnings}
            />
          </GridItem>
          <GridItem>
            <StructurePanel
              title="Add Deduction Type"
              placeholder="Deduction"
              storageKey={KEYS.deductions}
              initialItems={salaryStructureMockData.deductions}
            />
          </GridItem>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
