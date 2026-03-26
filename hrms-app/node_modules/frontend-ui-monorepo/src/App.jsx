// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CalendarProvider } from "@/contexts/CalendarContext";
import AppRoutes from '@/routes/AppRoutes';

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false }
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CalendarProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CalendarProvider>
    </ChakraProvider>
  );
}

export default App;