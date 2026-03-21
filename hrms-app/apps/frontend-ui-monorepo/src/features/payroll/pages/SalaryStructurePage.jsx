import React, { useState } from 'react';
import {
  Box, Flex, Grid, GridItem, Input,
  Text, useToast,
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

  const startEdit = (item) => { 
    setEditingId(item.id); 
    setEditVal(item.name); 
  };

  const saveEdit = (id) => {
    const trimmed = editVal.trim();
    if (!trimmed) return;
    persist(items.map((i) => (i.id === id ? { ...i, name: trimmed } : i)));
    setEditingId(null);
    setEditVal('');
    toast({ title: 'Updated', status: 'success', duration: 2000, isClosable: true, position: 'top-right' });
  };

  const cancelEdit = () => { 
    setEditingId(null); 
    setEditVal(''); 
  };

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
          ➕ Add
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

            {/* Actions - ✅ Text + Emoji buttons */}
            <Flex gap={1} align="center">
              {editingId === item.id ? (
                <>
                  <HRMSButton size="xs" onClick={() => saveEdit(item.id)}>
                    ✅ Save
                  </HRMSButton>
                  <HRMSButton size="xs" variant="outline" onClick={cancelEdit}>
                    ❌ Cancel
                  </HRMSButton>
                </>
              ) : (
                <>
                  <HRMSButton 
                    size="xs" 
                    variant="ghost" 
                    colorScheme="blue"
                    leftIcon="✏️"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </HRMSButton>
                  <HRMSButton 
                    size="xs" 
                    variant="ghost" 
                    colorScheme="red"
                    leftIcon="🗑️"
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    Delete
                  </HRMSButton>
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
