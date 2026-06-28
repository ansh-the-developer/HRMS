import React, { useState, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Progress,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FiUpload, FiDownload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { createEmployeeProfile, updateEmployeeProfile } from "@/services/employeeApi";
import HRMSButton from "@/components/atomic/atoms/HRMSButton";

// Custom RFC 4180 compliant CSV Parser
function parseCSV(text) {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push("");
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== "") {
    lines.push(row);
  }
  return lines;
}

const parseCSVDate = (dateStr) => {
  if (!dateStr) return null;
  const parts = dateStr.split(/[-/]/);
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return dateStr;
};

const EmployeeBulkImportModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const handleTemplateDownload = () => {
    // Download public/employee_import_template.csv statically
    const link = document.createElement("a");
    link.href = "/employee_import_template.csv";
    link.setAttribute("download", "employee_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".csv")) {
        setSelectedFile(file);
        setResults(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a valid CSV file.",
          status: "error",
          duration: 3000,
        });
      }
    }
  };

  const handleUploadBoxClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
  };

  const handleSyncRecords = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProgress(0);
    setResults(null);

    try {
      const text = await selectedFile.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        throw new Error("CSV file is empty or missing headers.");
      }

      const headers = rows[0].map(h => h.trim().toLowerCase());
      const dataRows = rows.slice(1).filter(r => r.some(cell => cell.trim() !== ""));

      // 1. Fetch current employees to determine create vs. update
      const { data: existingEmployees, error: fetchErr } = await supabase
        .from("employees")
        .select("id, emp_code, auth_user_id");

      if (fetchErr) throw fetchErr;

      const existingMap = {};
      existingEmployees?.forEach(emp => {
        if (emp.emp_code) {
          existingMap[emp.emp_code.trim().toUpperCase()] = emp;
        }
      });

      let successCount = 0;
      let updateCount = 0;
      let failCount = 0;
      const rowErrors = [];

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i];
        const rowData = {};
        headers.forEach((h, idx) => {
          rowData[h] = row[idx]?.trim() || "";
        });

        const empId = rowData.emp_id;
        const fullName = rowData.full_name;
        const email = rowData.email;

        if (!empId || !fullName) {
          failCount++;
          rowErrors.push({
            rowNum: i + 2,
            identifier: fullName || `EMP_ID: ${empId || "N/A"}`,
            error: "EMP_ID and FULL_NAME are required.",
          });
          continue;
        }

        try {
          const matchedEmployee = existingMap[empId.toUpperCase()];
          let authUserId = matchedEmployee?.auth_user_id || null;

          if (email && !authUserId) {
            const defaultPassword = rowData.temp_password || `BK-${empId}@2026`;
            const role = "employee";

            const { data: authData, error: authError } = await supabase.functions.invoke(
              "create-employee-user",
              {
                body: {
                  email,
                  full_name: fullName,
                  temp_password: defaultPassword,
                  role,
                },
              }
            );

            if (authError) {
              console.warn(`Auth user creation failed for ${email}:`, authError.message);
            } else {
              authUserId = authData?.user_id;
            }
          }

          const employeePayload = {
            name: fullName,
            email: email || null,
            nickname: rowData.nickname || null,
            birthdate: parseCSVDate(rowData.dob),
            gender: rowData.gender || null,
            marital_status: rowData.marital || null,
            personal_number: rowData.personal_num || null,
            present_address: rowData.address || null,
            permanent_address: rowData.permanent_address || null,
            qualification: rowData.qualification || null,
            blood_group: rowData.blood_group || null,
            emergency_contact: rowData.emergency_contact || null,
            doj: parseCSVDate(rowData.doj),
            employee_type: rowData.emp_type || null,
            department: rowData.dept || null,
            designation: rowData.desig || null,
            work_location: rowData.location || null,
            reporting_manager: rowData.reporting_manager || null,
            monthly_ctc: rowData.monthly_ctc ? Number(rowData.monthly_ctc) : null,
            annual_quota: rowData.annual_quota ? Number(rowData.annual_quota) : 18,
            sick_quota: rowData.sick_quota ? Number(rowData.sick_quota) : 12,
            casual_quota: rowData.casual_quota ? Number(rowData.casual_quota) : 12,
            casual_monthly_quota: rowData.casual_monthly_quota ? Number(rowData.casual_monthly_quota) : 1,
            emp_code: empId,
            auth_user_id: authUserId,
          };

          const bankingPayload = {
            primary_bank: {
              bank_name: rowData.b1_name || "",
              account_number: rowData.b1_acc || "",
              ifsc_code: rowData.b1_ifsc || "",
            },
          };

          if (matchedEmployee) {
            // Update existing employee
            await updateEmployeeProfile(matchedEmployee.id, {
              employee: employeePayload,
              banking: bankingPayload,
            });
            updateCount++;
          } else {
            // Create new employee
            await createEmployeeProfile({
              employee: employeePayload,
              banking: bankingPayload,
            });
            successCount++;
          }
        } catch (err) {
          failCount++;
          rowErrors.push({
            rowNum: i + 2,
            identifier: `${fullName} (${empId})`,
            error: err.message || "Unknown error",
          });
        }

        setProgress(Math.round(((i + 1) / dataRows.length) * 100));
      }

      setResults({
        successCount,
        updateCount,
        failCount,
        errors: rowErrors,
      });

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess?.();

      if (failCount === 0) {
        toast({
          title: "Sync complete!",
          description: `Successfully synchronized ${successCount + updateCount} records.`,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Import complete with errors",
          description: `Processed ${dataRows.length} rows. Please review failed records.`,
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
      }

    } catch (err) {
      toast({
        title: "Import failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModalClose = () => {
    if (!isProcessing) {
      setSelectedFile(null);
      setProgress(0);
      setResults(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      size="md"
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="3xl" p={6} mx={4}>
        <ModalHeader pb={1} pt={4} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="xl" fontWeight="bold" color="gray.900">
            Bulk Import
          </Text>
          <ModalCloseButton position="static" borderRadius="full" size="sm" bg="gray.100" />
        </ModalHeader>

        <ModalBody py={4} px={2}>
          <VStack spacing={5} align="stretch">
            {/* CSV Format Banner */}
            <Flex
              bg="#F3F4FD"
              borderRadius="2xl"
              p={4}
              align="center"
              justify="space-between"
            >
              <Box>
                <Text fontSize="xs" fontWeight="bold" color="gray.800">
                  CSV Format
                </Text>
                <Text fontSize="2xs" color="gray.500" fontWeight="medium" mt={0.5}>
                  EMP_ID, FULL_NAME (REQUIRED), TEMP_PASSWORD
                </Text>
              </Box>
              <HRMSButton
                bg="#4F22FF"
                color="white"
                _hover={{ bg: "#3D17D9" }}
                borderRadius="xl"
                onClick={handleTemplateDownload}
                px={4}
                leftIcon={<FiDownload size={13} />}
              >
                Template
              </HRMSButton>
            </Flex>

            {/* Upload Area */}
            <Flex
              border="2px dashed"
              borderColor={selectedFile ? "#4F22FF" : "gray.200"}
              bg={selectedFile ? "purple.50" : "transparent"}
              borderRadius="2xl"
              p={8}
              direction="column"
              align="center"
              justify="center"
              cursor={isProcessing ? "not-allowed" : "pointer"}
              onClick={handleUploadBoxClick}
              _hover={{ borderColor: isProcessing ? "gray.200" : "#4F22FF" }}
              transition="all 0.2s"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileChange}
                disabled={isProcessing}
              />
              <Icon
                as={FiUpload}
                boxSize={6}
                color={selectedFile ? "#4F22FF" : "gray.400"}
                mb={3}
              />
              <Text fontSize="sm" fontWeight="bold" color="gray.700" textAlign="center">
                {selectedFile ? selectedFile.name : "Click to upload directory CSV"}
              </Text>
              <Text fontSize="xs" color="gray.400" mt={1}>
                UTF-8 encoded CSV files only
              </Text>
            </Flex>

            {/* Progress Bar */}
            {isProcessing && (
              <Box px={1}>
                <Text fontSize="xs" color="gray.500" mb={1} fontWeight="medium">
                  Synchronizing records... {progress}%
                </Text>
                <Progress
                  value={progress}
                  size="xs"
                  borderRadius="full"
                  colorScheme="purple"
                  bg="purple.100"
                />
              </Box>
            )}

            {/* Results Output */}
            {results && (
              <Box bg="gray.50" borderRadius="xl" p={4} maxH="180px" overflowY="auto">
                <Text fontSize="xs" fontWeight="bold" color="gray.700" mb={2}>
                  Import Summary:
                </Text>
                <VStack align="stretch" spacing={1.5}>
                  <HStack spacing={2} fontSize="xs" color="green.600">
                    <Icon as={FiCheckCircle} />
                    <Text>{results.successCount} profiles created</Text>
                  </HStack>
                  <HStack spacing={2} fontSize="xs" color="blue.600">
                    <Icon as={FiCheckCircle} />
                    <Text>{results.updateCount} profiles updated</Text>
                  </HStack>
                  {results.failCount > 0 && (
                    <>
                      <HStack spacing={2} fontSize="xs" color="red.600" fontWeight="semibold">
                        <Icon as={FiAlertCircle} />
                        <Text>{results.failCount} rows failed</Text>
                      </HStack>
                      <VStack align="stretch" pl={6} spacing={1} borderLeft="1px solid" borderColor="red.100">
                        {results.errors.map((err, index) => (
                          <Text key={index} fontSize="2xs" color="red.500">
                            Row {err.rowNum}: {err.identifier} - {err.error}
                          </Text>
                        ))}
                      </VStack>
                    </>
                  )}
                </VStack>
              </Box>
            )}

            {/* Synchronize Button */}
            <HRMSButton
              w="full"
              h="50px"
              bg={selectedFile ? "#4F22FF" : "#9B86FA"}
              color="white"
              borderRadius="2xl"
              _hover={selectedFile ? { bg: "#3D17D9" } : { bg: "#9B86FA" }}
              cursor={selectedFile ? "pointer" : "not-allowed"}
              onClick={handleSyncRecords}
              isLoading={isProcessing}
              loadingText="Synchronizing Records"
            >
              Synchronize Records
            </HRMSButton>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EmployeeBulkImportModal;
