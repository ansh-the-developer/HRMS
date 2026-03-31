import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // ✅ replaces useAuth0

export const LogoutButton = ({
  variant = "solid",
  colorScheme = "red",
  size = "md",
  ...props
}) => {
  const { signOut } = useAuth();   // ✅ replaces logout()
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true }); // ✅ redirect after logout
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
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