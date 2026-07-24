import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Flex, Grid, GridItem, Input,
  Text, useToast, Tabs, TabList, TabPanels, Tab, TabPanel,
  Select, FormControl, FormLabel, Heading, SimpleGrid, Spinner,
  Divider, Button,
} from '@chakra-ui/react';
import DashboardLayout from '@/components/atomic/templates/DashboardLayout';
import HRMSButton from '@/components/atomic/atoms/HRMSButton';
import HRMSInput from '@/components/atomic/atoms/HRMSInput';
import { salaryStructureMockData } from '../constants/payrollMockData';
import { useEmployees } from '@/hooks/useEmployees';
import { useSalaryStructure, useSaveSalaryStructure } from '@/hooks/usePayroll';

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
function StructurePanel({ title, placeholder, storageKey, initialItems, onChange }) {
  const toast = useToast();
  const [items, setItems] = useState(() => load(storageKey, initialItems));
  const [inputVal, setInputVal] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const persist = (updated) => {
    setItems(updated);
    save(storageKey, updated);
    if (onChange) onChange();
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
      <Text fontWeight="semibold" fontSize="md" color="text-secondary">{title}</Text>

      {/* Input + Add */}
      <Flex gap={3}>
        <HRMSInput
          placeholder={placeholder}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          fontSize="sm"
        />
        <HRMSButton onClick={handleAdd} px={6}>
          Add
        </HRMSButton>
      </Flex>

      {/* List */}
      <Box border="1px solid" borderColor="border-color" borderRadius="md" overflow="hidden" bg="card-bg">
        {items.length === 0 && (
          <Flex justify="center" py={6}>
            <Text fontSize="sm" color="text-muted">No items yet</Text>
          </Flex>
        )}
        {items.map((item, idx) => (
          <Flex
            key={item.id}
            align="center"
            justify="space-between"
            px={4} py={3}
            borderBottom={idx < items.length - 1 ? '1px solid' : 'none'}
            borderColor="border-color"
            _hover={{ bg: "hover-bg" }}
            gap={3}
          >
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
              <Text fontSize="sm" fontWeight="medium" color="text-secondary" flex="1">
                {item.name}
              </Text>
            )}

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
                  <HRMSButton 
                    size="xs" 
                    variant="ghost" 
                    colorScheme="blue"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </HRMSButton>
                  <HRMSButton 
                    size="xs" 
                    variant="ghost" 
                    colorScheme="red"
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
  const navigate = useNavigate();
  const toast = useToast();
  
  // Custom earning/deduction types from LocalStorage
  const [globalEarnings, setGlobalEarnings] = useState(() => load(KEYS.earnings, salaryStructureMockData.earnings));
  const [globalDeductions, setGlobalDeductions] = useState(() => load(KEYS.deductions, salaryStructureMockData.deductions));
  
  const refreshGlobalTypes = () => {
    setGlobalEarnings(load(KEYS.earnings, salaryStructureMockData.earnings));
    setGlobalDeductions(load(KEYS.deductions, salaryStructureMockData.deductions));
  };

  // Employees data
  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const [selectedEmpId, setSelectedEmpId] = useState('');
  
  const selectedEmp = employees?.find(e => e.id === selectedEmpId) || null;
  const monthlyCtc = selectedEmp?.monthly_ctc || 0;

  // DB Salary Structure for selected employee
  const { data: dbStructure, isLoading: loadingStructure, refetch: refetchStructure } = useSalaryStructure(selectedEmpId);
  const saveStructureMutation = useSaveSalaryStructure();

  // Structure Form Fields State
  const [basic, setBasic] = useState(0);
  const [hra, setHra] = useState(0);
  const [da, setDa] = useState(0);
  const [allowances, setAllowances] = useState(0);
  const [pfPercent, setPfPercent] = useState(12);
  const [esiPercent, setEsiPercent] = useState(0.75);
  const [tdsPercent, setTdsPercent] = useState(0);
  const [customEarnings, setCustomEarnings] = useState({});
  const [customDeductions, setCustomDeductions] = useState({});

  // Sync state when DB structure or selected employee changes
  useEffect(() => {
    if (selectedEmp) {
      if (dbStructure) {
        setBasic(dbStructure.basic);
        setHra(dbStructure.hra);
        setDa(dbStructure.da);
        setAllowances(dbStructure.other_allowances);
        setPfPercent(dbStructure.pf_percent);
        setEsiPercent(dbStructure.esi_percent);
        setTdsPercent(dbStructure.tds_percent);
        setCustomEarnings(dbStructure.custom_earnings || {});
        setCustomDeductions(dbStructure.custom_deductions || {});
      } else {
        // Fallback default calculation: Basic 50%, HRA 25% of CTC (50% of basic), DA 10% of basic, other allowances = remainder
        const defBasic = Math.round(monthlyCtc * 0.5);
        const defHra = Math.round(defBasic * 0.5);
        const defDa = Math.round(defBasic * 0.1);
        const defAllowances = Math.round(monthlyCtc - defBasic - defHra - defDa);
        
        setBasic(defBasic);
        setHra(defHra);
        setDa(defDa);
        setAllowances(defAllowances);
        setPfPercent(12);
        setEsiPercent(0.75);
        setTdsPercent(0);
        setCustomEarnings({});
        setCustomDeductions({});
      }
    }
  }, [selectedEmp, dbStructure, monthlyCtc]);

  const handleCustomEarningChange = (name, val) => {
    setCustomEarnings(prev => ({ ...prev, [name]: Number(val) || 0 }));
  };

  const handleCustomDeductionChange = (name, val) => {
    setCustomDeductions(prev => ({ ...prev, [name]: Number(val) || 0 }));
  };

  const handleSaveStructure = async () => {
    if (!selectedEmpId) return;

    try {
      const payload = {
        basic: Number(basic) || 0,
        hra: Number(hra) || 0,
        da: Number(da) || 0,
        other_allowances: Number(allowances) || 0,
        pf_percent: Number(pfPercent) || 0,
        esi_percent: Number(esiPercent) || 0,
        tds_percent: Number(tdsPercent) || 0,
        custom_earnings: customEarnings,
        custom_deductions: customDeductions,
      };

      await saveStructureMutation.mutateAsync({ employee_id: selectedEmpId, payload });
      
      toast({
        title: 'Salary Structure Saved',
        description: `Structure for ${selectedEmp.name} has been updated.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      refetchStructure();
    } catch (err) {
      toast({
        title: 'Save Failed',
        description: err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <DashboardLayout>
      <Box px={{ base: 4, md: 6 }} py={6}>
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<span>←</span>}
          onClick={() => navigate('/payroll')}
          mb={4}
          alignSelf="flex-start"
          _hover={{ bg: "hover-bg" }}
        >
          Back to Payroll Dashboard
        </Button>
        <Heading size="lg" mb={6} color="text-primary">Salary Structure Management</Heading>
        
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList>
            <Tab fontWeight="semibold">📁 Employee Salary Breakdown</Tab>
            <Tab fontWeight="semibold">⚙️ Global Components</Tab>
          </TabList>

          <TabPanels>
            {/* TAB 1: Employee specific breakdown */}
            <TabPanel px={0} py={6}>
              <Box bg="card-bg" borderRadius="lg" border="1px solid" borderColor="border-color" p={6} mb={6}>
                <Heading size="sm" mb={4} color="text-secondary">Select Employee</Heading>
                {loadingEmployees ? (
                  <Spinner size="md" />
                ) : (
                  <Select
                    placeholder="Choose an employee..."
                    value={selectedEmpId}
                    onChange={(e) => setSelectedEmpId(e.target.value)}
                    maxW="400px"
                    bg="card-bg"
                    borderColor="border-color"
                  >
                    {employees?.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department} - {emp.designation})</option>
                    ))}
                  </Select>
                )}
              </Box>

              {selectedEmp && (
                <Box bg="card-bg" borderRadius="lg" border="1px solid" borderColor="border-color" p={6}>
                  <Flex justify="space-between" align="center" mb={6}>
                    <Box>
                      <Heading size="md" color="text-primary">{selectedEmp.name}</Heading>
                      <Text fontSize="sm" color="text-muted">CTC: Rs. {monthlyCtc.toLocaleString('en-IN')} / month</Text>
                    </Box>
                    <HRMSButton onClick={handleSaveStructure} isLoading={saveStructureMutation.isPending}>
                      💾 Save Structure
                    </HRMSButton>
                  </Flex>

                  <Divider mb={6} />

                  {loadingStructure ? (
                    <Flex justify="center" py={10}><Spinner size="lg" /></Flex>
                  ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={8}>
                      {/* Left: Earnings */}
                      <Box>
                        <Heading size="xs" textTransform="uppercase" letterSpacing="wider" mb={4} color="blue.600">Earnings Components</Heading>
                        <SimpleGrid columns={1} spacing={4}>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">Basic Salary (Rs.)</FormLabel>
                            <HRMSInput type="number" value={basic} onChange={(e) => setBasic(e.target.value)} />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">House Rent Allowance - HRA (Rs.)</FormLabel>
                            <HRMSInput type="number" value={hra} onChange={(e) => setHra(e.target.value)} />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">Dearness Allowance - DA (Rs.)</FormLabel>
                            <HRMSInput type="number" value={da} onChange={(e) => setDa(e.target.value)} />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">Other Allowances (Rs.)</FormLabel>
                            <HRMSInput type="number" value={allowances} onChange={(e) => setAllowances(e.target.value)} />
                          </FormControl>

                          {/* Dynamic Custom Earnings */}
                          {globalEarnings.filter(e => !['basic salary', 'house rent allowance', 'conveyance allowance', 'medical allowance', 'special allowance', 'da'].includes(e.name.toLowerCase())).map(item => (
                            <FormControl key={item.id}>
                              <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">{item.name} (Rs.)</FormLabel>
                              <HRMSInput 
                                type="number" 
                                value={customEarnings[item.name] || ''} 
                                onChange={(e) => handleCustomEarningChange(item.name, e.target.value)} 
                              />
                            </FormControl>
                          ))}
                        </SimpleGrid>
                      </Box>

                      {/* Right: Deductions */}
                      <Box>
                        <Heading size="xs" textTransform="uppercase" letterSpacing="wider" mb={4} color="red.600">Deduction Percentages</Heading>
                        <SimpleGrid columns={1} spacing={4}>
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">Provident Fund (PF) %</FormLabel>
                            <HRMSInput type="number" step="0.1" value={pfPercent} onChange={(e) => setPfPercent(e.target.value)} />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">ESI %</FormLabel>
                            <HRMSInput type="number" step="0.01" value={esiPercent} onChange={(e) => setEsiPercent(e.target.value)} />
                          </FormControl>

                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">Tax Deducted at Source (TDS) %</FormLabel>
                            <HRMSInput type="number" step="0.1" value={tdsPercent} onChange={(e) => setTdsPercent(e.target.value)} />
                          </FormControl>

                          {/* Dynamic Custom Deductions */}
                          {globalDeductions.filter(d => !['employee provident fund', 'esi / health insurance', 'professional tax'].includes(d.name.toLowerCase())).map(item => (
                            <FormControl key={item.id}>
                              <FormLabel fontSize="sm" fontWeight="medium" color="text-secondary">{item.name} (Rs.)</FormLabel>
                              <HRMSInput 
                                type="number" 
                                value={customDeductions[item.name] || ''} 
                                onChange={(e) => handleCustomDeductionChange(item.name, e.target.value)} 
                              />
                            </FormControl>
                          ))}
                        </SimpleGrid>
                      </Box>
                    </SimpleGrid>
                  )}
                </Box>
              )}
            </TabPanel>

            {/* TAB 2: Global Earning/Deduction custom types list */}
            <TabPanel px={0} py={6}>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={10}>
                <GridItem>
                  <StructurePanel
                    title="Global Earning Types"
                    placeholder="Earning Type Name"
                    storageKey={KEYS.earnings}
                    initialItems={salaryStructureMockData.earnings}
                    onChange={refreshGlobalTypes}
                  />
                </GridItem>
                <GridItem>
                  <StructurePanel
                    title="Global Deduction Types"
                    placeholder="Deduction Type Name"
                    storageKey={KEYS.deductions}
                    initialItems={salaryStructureMockData.deductions}
                    onChange={refreshGlobalTypes}
                  />
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </DashboardLayout>
  );
}
