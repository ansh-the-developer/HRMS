import { Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = ({ variant = "solid", colorScheme = "red", size = "md", ...props }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,  // Changed from /login
      },
    });
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      {...props}
    >
      Logout
    </Button>
  );
};
