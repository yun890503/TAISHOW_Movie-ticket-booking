import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("新密碼與確認新密碼不一致");
      return;
    }

    try {
      const token = Cookies.get("token");
      if (!token) {
        alert("未找到token，請重新登錄");
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/user/change-password",
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("密碼更改成功請重新登入");
      Cookies.remove("token");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        alert("密碼錯誤");
      } else {
        alert("密碼更改失敗");
      }
    }
  };

  return (
    <Box
      boxShadow="lg"
      borderRadius="md"
      color="black"
      direction="column"
      h="full"
      justifyContent="center"
      maxW="800px"
      mx="auto"
      p="6"
      bg="white"
    >
      <form onSubmit={handleSubmit}>
        <FormControl marginBottom="20px">
          <FormLabel htmlFor="old-password" fontWeight="bold">
            舊密碼
          </FormLabel>
          <Input
            type="password"
            id="old-password"
            name="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </FormControl>
        <FormControl marginBottom="20px">
          <FormLabel htmlFor="new-password" fontWeight="bold">
            新密碼
          </FormLabel>
          <Input
            type="password"
            id="new-password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl marginBottom="20px">
          <FormLabel htmlFor="confirm-password" fontWeight="bold">
            確認新密碼
          </FormLabel>
          <Input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          width="100%"
          padding="12px"
          backgroundColor="#007bff"
          color="white"
          borderRadius="4px"
          cursor="pointer"
          fontSize="16px"
          fontWeight="bold"
          _hover={{ backgroundColor: "#0056b3" }}
        >
          保存更改
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
