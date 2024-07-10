'use client'

import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  VStack,
  Button,
  Text,
  useColorModeValue,
  Center,
  Image,
  Heading,
  Stack,
  Input
} from '@chakra-ui/react';
import {
  FaUser,
  FaHistory,
  FaGift,
  FaHeart,
  FaLock,
  FaSignOutAlt,
} from 'react-icons/fa';
import Cookies from 'js-cookie';
import axios from 'axios';

const Sidebar = () => {
  const defaultUser = {

  };

  const [nickname, setNickname] = useState("");
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [avatar, setAvatar] = useState('');
  const [userInfo, setUserInfo] = useState({
    photo: '' // 確保有這個字段
  });
  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if (!token) {
        alert('未找到token，請重新登錄');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/user/user-info', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setNickname(response.data.nickName);
        setCurrentUser(response.data);
        if (response.data.photo) {
          setAvatar(`${response.data.photo}`);
        }
        console.log(avatar);
        console.log('Fetched avatar URL:', response.data.photo);
        console.log("aaa");
      } catch (error) {
        console.error('Error fetching user data:', error);
        alert('無法獲取用戶資料，請稍後再試');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setAvatar(`${base64String}`);
      const updatedUserInfo = { ...userInfo, photo: base64String };
      setUserInfo(updatedUserInfo);
      handleSave(updatedUserInfo); // 自動保存
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (updatedUserInfo) => {
    console.log("Updated User Info: ", updatedUserInfo);

    try {
      const res = await axios.put('http://localhost:8080/user/upload-photo', updatedUserInfo.photo, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'text/plain'
        }
      });
      console.log("User photo updated successfully: ", res.data);
    } catch (error) {
      console.error('Error updating user photo:', error);
    }
  };

  return (
    <Center py={6}>
      <Box
        maxW={'270px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'md'}
        overflow={'hidden'}>
        <Image
          h={'120px'}
          w={'full'}
          src={
            'https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80'
          }
          objectFit="cover"
          alt="#"
        />
        <Flex justify={'center'} mt={-12} position="relative">
          <Avatar
            size={'xl'}
            src={avatar}
            css={{
              border: '2px solid white',
              cursor: 'pointer'
            }}

            onClick={() => document.getElementById('avatarInput').click()}
          />
          <Input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </Flex>

        <Box p={6}>
          <Stack spacing={0} align={'center'} mb={5}>
            <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'} color="black">
              {nickname}
            </Heading>

          </Stack>
          <VStack spacing="4" align="start" w="full">
            <Button as="a" href="http://localhost:5173/member" leftIcon={<FaUser />} variant="ghost" justifyContent="flex-start" w="full">我的帳戶</Button>
            <Button as="a" href="http://localhost:5173/password" leftIcon={<FaLock />} variant="ghost" justifyContent="flex-start" w="full">更改密碼</Button>
            <Button as="a" href="http://localhost:5173/orderlist" leftIcon={<FaHistory />} variant="ghost" justifyContent="flex-start" w="full">歷史訂單</Button>
            <Button as="a" href="http://localhost:5173/point" leftIcon={<FaGift />} variant="ghost" justifyContent="flex-start" w="full">紅利點數</Button>
            <Button as="a" href="http://localhost:5173/favorite" leftIcon={<FaHeart />} variant="ghost" justifyContent="flex-start" w="full">我的電影評論</Button>
            <Button onClick={handleLogout} leftIcon={<FaSignOutAlt />} variant="ghost" justifyContent="flex-start" w="full">登出</Button>
          </VStack>
        </Box>
      </Box>
    </Center>
  );
};

export default Sidebar;
