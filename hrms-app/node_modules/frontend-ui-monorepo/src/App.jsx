// src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CalendarProvider } from "@/contexts/CalendarContext";
import AppRoutes from '@/routes/AppRoutes';
import { designTokens } from '@/theme/designTokens';

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: true,
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    mono: `'JetBrains Mono', monospace`,
  },
  colors: {
    brand: {
      50: "#EEF2FF",
      100: "#E5E7EB",
      200: "#CBD5E1",
      300: "#9CA3AF",
      400: "#6B7280",
      500: "#4F46E5", // Default brand indigo
      600: "#6366F1",
      700: "#4338CA",
      800: "#3730A3",
      900: "#111827",
    }
  },
  semanticTokens: {
    colors: {
      "app-bg": {
        default: designTokens.light.background,
        _dark: designTokens.dark.background,
      },
      "app-bg-secondary": {
        default: designTokens.light.secondaryBackground,
        _dark: designTokens.dark.secondaryBackground,
      },
      "card-bg": {
        default: designTokens.light.cardBackground,
        _dark: designTokens.dark.cardBackground,
      },
      "glass-bg": {
        default: designTokens.light.glassBackground,
        _dark: designTokens.dark.glassBackground,
      },
      "text-primary": {
        default: designTokens.light.textPrimary,
        _dark: designTokens.dark.textPrimary,
      },
      "text-secondary": {
        default: designTokens.light.textSecondary,
        _dark: designTokens.dark.textSecondary,
      },
      "text-muted": {
        default: designTokens.light.textMuted,
        _dark: designTokens.dark.textMuted,
      },
      "accent": {
        default: designTokens.light.accent,
        _dark: designTokens.dark.accent,
      },
      "accent-hover": {
        default: designTokens.light.accentSecondary,
        _dark: designTokens.dark.accentSecondary,
      },
      "border-color": {
        default: designTokens.light.border,
        _dark: designTokens.dark.border,
      },
      "hover-bg": {
        default: designTokens.light.hoverBackground,
        _dark: designTokens.dark.hoverBackground,
      },
      "selected-bg": {
        default: designTokens.light.selectedBackground,
        _dark: designTokens.dark.selectedBackground,
      },
      "success-color": {
        default: designTokens.light.success,
        _dark: designTokens.dark.success,
      },
      "warning-color": {
        default: designTokens.light.warning,
        _dark: designTokens.dark.warning,
      },
      "danger-color": {
        default: designTokens.light.danger,
        _dark: designTokens.dark.danger,
      },
      "info-color": {
        default: designTokens.light.info,
        _dark: designTokens.dark.info,
      },
    }
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "12px",
        fontWeight: "600",
        transition: "all 180ms cubic-bezier(0.16, 1, 0.3, 1)",
        _active: {
          transform: "scale(0.98)",
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: "card-bg",
          backdropFilter: "blur(24px)",
          borderColor: "border-color",
          color: "text-primary",
          borderRadius: "20px",
          transition: "transform 250ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 250ms cubic-bezier(0.16, 1, 0.3, 1)",
        }
      }
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "card-bg",
          backdropFilter: "blur(24px)",
          borderColor: "border-color",
          color: "text-primary",
          borderRadius: "24px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.30)",
        }
      }
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "card-bg",
          backdropFilter: "blur(24px)",
          borderColor: "border-color",
          color: "text-primary",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
          p: 2,
        },
        item: {
          bg: "transparent",
          color: "text-primary",
          borderRadius: "10px",
          transition: "all 150ms ease",
          _hover: {
            bg: "hover-bg",
          },
          _focus: {
            bg: "hover-bg",
          }
        }
      }
    },
    Table: {
      baseStyle: {
        th: {
          color: "text-muted",
          borderColor: "border-color",
          fontWeight: "700",
          fontSize: "10px",
          letterSpacing: "wider",
        },
        td: {
          borderColor: "border-color",
          color: "text-primary",
        },
        tr: {
          transition: "background-color 150ms ease",
          _hover: {
            bg: "hover-bg",
          }
        }
      }
    },
    Select: {
      baseStyle: {
        field: {
          bg: "card-bg",
          backdropFilter: "blur(20px)",
          borderColor: "border-color",
          color: "text-primary",
          borderRadius: "12px",
          _focus: {
            borderColor: "accent",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
          }
        }
      }
    },
    Input: {
      baseStyle: {
        field: {
          bg: "card-bg",
          backdropFilter: "blur(20px)",
          borderColor: "border-color",
          color: "text-primary",
          borderRadius: "12px",
          _focus: {
            borderColor: "accent",
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
          }
        }
      }
    },
    Textarea: {
      baseStyle: {
        bg: "card-bg",
        backdropFilter: "blur(20px)",
        borderColor: "border-color",
        color: "text-primary",
        borderRadius: "12px",
        _focus: {
          borderColor: "accent",
          boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
        }
      }
    },
    Badge: {
      baseStyle: {
        borderRadius: "full",
        px: 3,
        py: 0.5,
        fontWeight: "700",
        fontSize: "10px",
        letterSpacing: "wider",
      }
    },
    Tooltip: {
      baseStyle: {
        bg: "card-bg",
        backdropFilter: "blur(20px)",
        color: "text-primary",
        borderColor: "border-color",
        border: "1px solid",
        borderRadius: "10px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        px: 3,
        py: 1.5,
      }
    },
    Alert: {
      baseStyle: {
        container: {
          borderRadius: "16px",
          backdropFilter: "blur(18px)",
        }
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          borderRadius: "6px",
          borderColor: "border-color",
          _checked: {
            bg: "accent",
            borderColor: "accent",
            color: "white",
          },
          _focus: {
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
          }
        }
      }
    },
    Radio: {
      baseStyle: {
        control: {
          borderColor: "border-color",
          _checked: {
            bg: "accent",
            borderColor: "accent",
            color: "white",
          },
          _focus: {
            boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.25)",
          }
        }
      }
    },
    Switch: {
      baseStyle: {
        track: {
          bg: "hover-bg",
          _checked: {
            bg: "accent",
          }
        }
      }
    },
    Skeleton: {
      baseStyle: (props) => ({
        startColor: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        endColor: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)",
        borderRadius: "12px",
      })
    },
    Popover: {
      baseStyle: {
        content: {
          bg: "card-bg",
          backdropFilter: "blur(24px)",
          borderColor: "border-color",
          color: "text-primary",
          borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.20)",
        }
      }
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "card-bg",
          backdropFilter: "blur(28px)",
          borderColor: "border-color",
          color: "text-primary",
        }
      }
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: "app-bg",
        color: "text-primary",
      },
      "::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        background: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.16)" : "rgba(0, 0, 0, 0.16)",
        borderRadius: "999px",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: props.colorMode === "dark" ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
      }
    })
  }
});

import { LanguageProvider } from "@/contexts/LanguageContext";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <LanguageProvider>
        <CalendarProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CalendarProvider>
      </LanguageProvider>
    </ChakraProvider>
  );
}

export default App;