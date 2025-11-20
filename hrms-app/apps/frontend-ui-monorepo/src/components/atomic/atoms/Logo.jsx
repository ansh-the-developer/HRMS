import React from "react";
import { Box, Image } from "@chakra-ui/react";
import companyLogo from "../../../assets/ajLogo.png";

const Logo = ({ alt = "Company logo", w = { base: "10rem", sm: "14rem", md: "18.375em" }, h = { base: "15rem", md: "17rem" } }) => (
  <Box justifySelf="center" mx="auto" display="flex" alignItems="center" justifyContent="center">
    <Image src={companyLogo} alt={alt} w={w} h={h} objectFit="contain" />
  </Box>
);

export default Logo;
