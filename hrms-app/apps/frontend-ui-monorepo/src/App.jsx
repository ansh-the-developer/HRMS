import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { CalendarProvider } from "@/contexts/CalendarContext";  // ✅ ADD
import AppRoutes from '@/routes/AppRoutes';

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <CalendarProvider>        {/* ✅ WRAP */}
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CalendarProvider>       {/* ✅ END */}
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default App;
