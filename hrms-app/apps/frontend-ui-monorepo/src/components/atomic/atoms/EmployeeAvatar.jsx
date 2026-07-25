import React from "react";
import { Box, Avatar } from "@chakra-ui/react";

export function getAvatarUrl(emp) {
  if (!emp) return undefined;
  const url = emp.avatar_url || emp.profile_picture || emp.user_metadata?.avatar_url;
  if (url) return url;
  const seed = encodeURIComponent(emp.name || emp.nickname || emp.email || "User");
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=6366f1,8b5cf6,ec4899,10b981&textColor=ffffff`;
}

export function isBirthdayToday(birthdate) {
  if (!birthdate) return false;
  const today = new Date();
  const d = new Date(birthdate);
  return today.getMonth() === d.getMonth() && today.getDate() === d.getDate();
}

export default function EmployeeAvatar({ employee, name, src, birthdate, size = "md", ...props }) {
  const avatarName = name || employee?.name || "User";
  const avatarSrc = src || getAvatarUrl(employee);
  const isBirthday = isBirthdayToday(birthdate || employee?.birthdate);

  return (
    <Box position="relative" display="inline-block">
      <Avatar size={size} name={avatarName} src={avatarSrc} {...props} />
      {isBirthday && (
        <Box
          position="absolute"
          top="-8px"
          right="-6px"
          fontSize={size === "xs" ? "10px" : size === "sm" ? "12px" : "16px"}
          pointerEvents="none"
          zIndex={2}
          filter="drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
          title="It's their Birthday today! 🥳"
        >
          🥳
        </Box>
      )}
    </Box>
  );
}
