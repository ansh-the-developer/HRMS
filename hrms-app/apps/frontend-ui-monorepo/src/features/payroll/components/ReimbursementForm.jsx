// src/features/payroll/components/ReimbursementForm.jsx
import { VStack, HStack, Input, Button, Textarea } from '@chakra-ui/react';
import  HRMSButton from '@/components/atomic/atoms/HRMSButton';
import  HRMSInput  from '@/components/atomic/atoms/HRMSButton';

export default function ReimbursementForm({ onCancel }) {
  return (
    <VStack spacing="6" align="stretch">
      <HRMSInput placeholder="Reimbursement Type (DDMMYYYY)" />
      <HRMSInput type="date" placeholder="For Date" />
      <Textarea placeholder="Subject (Documents)" rows={3} />
      
      <HStack justify="flex-end" spacing="4">
        <HRMSButton 
          variant="outline" 
          colorScheme="gray"
          onClick={onCancel}
        >
          Cancel
        </HRMSButton>
        <HRMSButton colorScheme="green">
          Upload
        </HRMSButton>
        <HRMSButton colorScheme="blue" type="submit">
          Submit
        </HRMSButton>
      </HStack>
    </VStack>
  );
}
