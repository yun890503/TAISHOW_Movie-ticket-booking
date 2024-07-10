import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Center,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

const UserProfileEdit = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [emailInfo, setEmailInfo] = useState("");
  const [phoneInfo, setPhoneInfo] = useState("");
  const [emailVerificationCode, setEmailVerificationCode] = useState("");
  const [phoneVerificationCode, setPhoneVerificationCode] = useState("");
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [phoneSuccess, setPhoneSuccess] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPhoneOpen,
    onOpen: onPhoneOpen,
    onClose: onPhoneClose,
  } = useDisclosure();
  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setError("未找到 JWT");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/user/user-info",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        if (data.birthday) {
          const [year, month, day] = data.birthday.split("-");
          data.birthDate = { year, month: parseInt(month), day: parseInt(day) };
        }
        setUserInfo(data);
      } catch (error) {
        setError("獲取用戶資料失敗");
      }
    };

    fetchUserInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleGenderChange = (e) => {
    setUserInfo((prevState) => ({
      ...prevState,
      gender: e.target.value,
    }));
  };

  const handleBirthDateChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      birthDate: {
        ...prevState.birthDate,
        [name]: value,
      },
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo((prevState) => ({
          ...prevState,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !userInfo.birthDate.year ||
      !userInfo.birthDate.month ||
      !userInfo.birthDate.day
    ) {
      setError("請完整填寫生日信息");
      return;
    }

    const birthDate = `${userInfo.birthDate.year}-${String(
      userInfo.birthDate.month
    ).padStart(2, "0")}-${String(userInfo.birthDate.day).padStart(2, "0")}`;
    let avatarUrl = userInfo.avatar;

    if (avatarFile) {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      try {
        const response = await axios.put(
          "http://localhost:8080/upload-avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        avatarUrl = response.data.filePath;
      } catch (err) {
        setError("圖片上傳失敗，請重試");
        return;
      }
    }

    const updatedUserInfo = {
      ...userInfo,
      avatar: avatarUrl,
      birthday: birthDate,
    };

    console.log("Updated User Info: ", updatedUserInfo);

    try {
      const res = await axios.put(
        "http://localhost:8080/user/upload-info",
        updatedUserInfo,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(res.data);
      onSuccessOpen(); // 打開成功視窗
    } catch (err) {
      setError("儲存失敗，請重試");
    }
  };

  const handleEmailUpdate = () => {
    setIsEmailEditable(true);
    setEmailSuccess(false);
    onOpen();
  };

  const handlePhoneUpdate = () => {
    setIsPhoneEditable(true);
    setPhoneSuccess(false);
    onPhoneOpen();
  };

  const handleEmailInfoChange = (e) => {
    setEmailInfo(e.target.value);
  };

  const handlePhoneInfoChange = (e) => {
    setPhoneInfo(e.target.value);
  };

  const handleEmailVerificationCodeChange = (e) => {
    setEmailVerificationCode(e.target.value);
  };

  const handlePhoneVerificationCodeChange = (e) => {
    setPhoneVerificationCode(e.target.value);
  };

  const handleSendEmailCode = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.post(
        "http://localhost:8080/email/send-code",
        null,
        {
          params: {
            email: emailInfo,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Email 驗證碼已發送");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("該電子信箱已被使用，請嘗試使用其他電子信箱");
      } else {
        console.error("發送驗證碼失敗:", error);
        alert("發送驗證碼失敗");
      }
    }
  };

  const handleSendPhoneCode = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.post(
        "http://localhost:8080/phone/send-code",
        null,
        {
          params: {
            phone: phoneInfo,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("手機號碼驗證碼已發送");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("該手機號碼已被使用，請嘗試使用其他手機號碼");
      } else {
        console.error("發送驗證碼失敗:", error);
        alert("發送驗證碼失敗");
      }
    }
  };

  const handleEmailVerify = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.post(
        "http://localhost:8080/email/verify-code",
        null,
        {
          params: {
            email: emailInfo,
            code: emailVerificationCode,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setEmailSuccess(true);
        alert("驗證成功");
        setUserInfo((prevState) => ({
          ...prevState,
          email: emailInfo,
        }));
        setIsEmailEditable(false);
        onClose();
      } else {
        alert("驗證碼無效");
      }
    } catch (error) {
      console.error("驗證失敗:", error);
      alert("驗證失敗");
    }
  };

  const handlePhoneVerify = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.post(
        "http://localhost:8080/phone/verify-code",
        null,
        {
          params: {
            phone: phoneInfo,
            code: phoneVerificationCode,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        setPhoneSuccess(true);
        alert("驗證成功");
        setUserInfo((prevState) => ({
          ...prevState,
          phone: phoneInfo,
        }));
        setIsPhoneEditable(false);
        onPhoneClose();
      } else {
        alert("驗證碼無效");
      }
    } catch (error) {
      console.error("驗證失敗:", error);
      alert("驗證失敗");
    }
  };

  if (!userInfo) {
    return <Box color="black">加載中...</Box>;
  }

  return (
    <Flex
      direction="column"
      h="full"
      justifyContent="center"
      maxW="800px"
      mx="auto"
      p="6"
      boxShadow="lg"
      bg="white"
      borderRadius="md"
      color="black"
    >
      {error && <Text color="red.500">{error}</Text>}
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel htmlFor="username" color="black" fontWeight="bold">
            用戶名
          </FormLabel>
          <Input
            type="text"
            id="username"
            name="username"
            value={userInfo.userName || ""}
            onChange={handleInputChange}
            readOnly
            color="black"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel htmlFor="email" color="black">
            Email
          </FormLabel>
          <Flex>
            <Input
              type="email"
              id="email"
              name="email"
              value={userInfo.email || ""}
              readOnly={!isEmailEditable}
              flex="1"
              color="black"
            />
            <Button ml="2" colorScheme="teal" onClick={handleEmailUpdate}>
              {isEmailEditable ? "正在更新" : "更新 Email"}
            </Button>
          </Flex>
        </FormControl>

        <FormControl mb="4">
          <FormLabel htmlFor="phone" color="black" fontWeight="bold">
            手機號碼
          </FormLabel>
          <Flex>
            <Input
              type="text"
              id="phone"
              name="phone"
              value={userInfo.phone || ""}
              onChange={handleInputChange}
              readOnly={!isPhoneEditable}
              flex="1"
              color="black"
            />
            <Button ml="2" colorScheme="teal" onClick={handlePhoneUpdate}>
              {isPhoneEditable ? "正在更新" : "更新手機號碼"}
            </Button>
          </Flex>
        </FormControl>

        <FormControl mb="4">
          <FormLabel htmlFor="address" color="black" fontWeight="bold">
            地址
          </FormLabel>
          <Input
            type="text"
            id="address"
            name="address"
            value={userInfo.address || ""}
            onChange={handleInputChange}
            color="black"
          />
        </FormControl>

        <FormControl mb="4">
          <FormLabel htmlFor="gender" color="black" fontWeight="bold">
            性別
          </FormLabel>
          <Select
            id="gender"
            name="gender"
            value={userInfo.gender || ""}
            onChange={handleGenderChange}
            color="black"
          >
            <option value="">選擇性別</option>
            <option value="M">男性</option>
            <option value="F">女性</option>
            <option value="O">其他</option>
          </Select>
        </FormControl>

        <FormControl mb="4">
          <FormLabel color="black" fontWeight="bold">
            生日
          </FormLabel>
          <Flex justifyContent="space-between">
            <Select
              name="year"
              value={userInfo.birthDate?.year || ""}
              onChange={handleBirthDateChange}
              width="30%"
              color="black"
            >
              {Array.from({ length: 100 }, (_, i) => 1920 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
            <Select
              name="month"
              value={userInfo.birthDate?.month || ""}
              onChange={handleBirthDateChange}
              width="30%"
              color="black"
            >
              {[
                "1月",
                "2月",
                "3月",
                "4月",
                "5月",
                "6月",
                "7月",
                "8月",
                "9月",
                "10月",
                "11月",
                "12月",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </Select>
            <Select
              name="day"
              value={userInfo.birthDate?.day || ""}
              onChange={handleBirthDateChange}
              width="30%"
              color="black"
            >
              {[...Array(31).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Select>
          </Flex>
        </FormControl>
        <Button type="submit" colorScheme="blue" width="full">
          儲存
        </Button>
      </form>

      {/* 儲存成功 Modal */}
      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose}>
        <ModalOverlay />
        <ModalContent maxWidth="250px" maxHeight="200px" m="auto">
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Center>
                <Text color="black" mt={8}>
                  您的資料已成功儲存。
                </Text>
              </Center>
              <Icon as={CheckCircleIcon} color="green.500" boxSize={6} />
            </VStack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>

      {/* Email Verification Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">更換 Email</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {emailSuccess ? (
              <VStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" boxSize={6} />
                  <Text color="black">成功!</Text>
                </HStack>
                <Text color="black">您的 Email 已成功更換。</Text>
              </VStack>
            ) : (
              <>
                <FormControl mb="4">
                  <FormLabel htmlFor="new-email" color="black">
                    新 Email
                  </FormLabel>
                  <Input
                    type="text"
                    id="new-email"
                    name="new-email"
                    value={emailInfo}
                    onChange={handleEmailInfoChange}
                    color="black"
                  />
                </FormControl>
                <Button colorScheme="teal" onClick={handleSendEmailCode} mb="4">
                  寄送驗證碼
                </Button>
                <FormControl mb="4">
                  <FormLabel htmlFor="email-verification-code" color="black">
                    Email 驗證碼
                  </FormLabel>
                  <Input
                    type="text"
                    id="email-verification-code"
                    name="email-verification-code"
                    value={emailVerificationCode}
                    onChange={handleEmailVerificationCodeChange}
                    color="black"
                  />
                </FormControl>
                <Button colorScheme="blue" onClick={handleEmailVerify}>
                  驗證 Email
                </Button>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>關閉</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Phone Verification Modal */}
      <Modal isOpen={isPhoneOpen} onClose={onPhoneClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="black">更換手機號碼</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {phoneSuccess ? (
              <VStack>
                <HStack>
                  <Icon as={CheckCircleIcon} color="green.500" boxSize={6} />
                  <Text color="black">成功!</Text>
                </HStack>
                <Text color="black">您的手機號碼已成功更換。</Text>
              </VStack>
            ) : (
              <>
                <FormControl mb="4">
                  <FormLabel htmlFor="new-phone" color="black">
                    新手機號碼
                  </FormLabel>
                  <Input
                    type="text"
                    id="new-phone"
                    name="new-phone"
                    value={phoneInfo}
                    onChange={handlePhoneInfoChange}
                    color="black"
                  />
                </FormControl>
                <Button colorScheme="teal" onClick={handleSendPhoneCode} mb="4">
                  寄送驗證碼
                </Button>
                <FormControl mb="4">
                  <FormLabel htmlFor="phone-verification-code" color="black">
                    手機號碼驗證碼
                  </FormLabel>
                  <Input
                    type="text"
                    id="phone-verification-code"
                    name="phone-verification-code"
                    value={phoneVerificationCode}
                    onChange={handlePhoneVerificationCodeChange}
                    color="black"
                  />
                </FormControl>
                <Button colorScheme="blue" onClick={handlePhoneVerify}>
                  驗證手機號碼
                </Button>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onPhoneClose}>關閉</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default UserProfileEdit;
