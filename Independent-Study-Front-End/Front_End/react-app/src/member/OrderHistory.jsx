import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Thead,
  VStack,
  Text,
  HStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Link,
  ModalCloseButton,
  Image,
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import axios from "axios";
import Cookies from "js-cookie";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get("token");
      if (!token) {
        alert("未找到token，請重新登錄");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8080/order/orderDetails",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
        alert("無法獲取訂單歷史記錄，請稍後再試");
      }
    };

    fetchOrders();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setSelectedOrder(null);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const modalSize = useBreakpointValue({ base: "full", md: "xl" });

  const formatDate = (dateString) => {
    return dateString.replace(/-/g, "/");
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  const getPayStatusColor = (status, amount) => {
    if (amount === 0) {
      return "black";
    }
    const redStatuses = ["退款中", "退款失敗", "已退款"];
    return redStatuses.includes(status) ? "red" : "black";
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;
    const halfMaxPageButtons = Math.floor(maxPageButtons / 2);

    let startPage = currentPage - halfMaxPageButtons;
    let endPage = currentPage + halfMaxPageButtons;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxPageButtons;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxPageButtons + 1;
    }

    if (startPage < 1) {
      startPage = 1;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          isActive={i === currentPage}
        >
          {i}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <Box
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
      <VStack spacing={4} align="center" height="full">
        <Box maxHeight="full" overflowY="auto" width="100%">
          <Table variant="striped" colorScheme="white" size="sm" height="100%">
            <Thead>
              <Tr>
                <Th
                  color="white"
                  fontSize="16px"
                  textAlign="center"
                  borderTopLeftRadius="md"
                >
                  訂單號
                </Th>
                <Th
                  color="white"
                  fontSize="16px"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  日期
                </Th>
                <Th
                  color="white"
                  fontSize="16px"
                  textAlign="center"
                  whiteSpace="nowrap"
                >
                  總金額
                </Th>
                <Th
                  color="white"
                  fontSize="16px"
                  textAlign="center"
                  borderTopRightRadius="md"
                >
                  類型
                </Th>
              </Tr>
            </Thead>
            <Tbody height="full">
              {orders.length === 0 ? (
                <Tr>
                  <Td colSpan="3" height="full">
                    <Flex justify="center" align="center" height="full">
                      <Text
                        color="black"
                        fontSize="24px"
                        fontWeight="bold"
                        mt={3}
                        textAlign="center"
                      >
                        目前沒有訂單! 快去
                        <Link
                          href="/movies"
                          color="teal.500"
                          textDecoration="underline"
                        >
                          下訂
                        </Link>
                        吧!
                      </Text>
                    </Flex>
                  </Td>
                </Tr>
              ) : (
                currentOrders.map((order) => (
                  <Tr
                    key={order.paymentId}
                    onClick={() => handleShowModal(order)}
                    _hover={{ cursor: "pointer", backgroundColor: "gray.100" }}
                  >
                    <Td fontSize="16px" textAlign="center">
                      {order.orderNum}
                    </Td>
                    <Td fontSize="16px" textAlign="center" whiteSpace="nowrap">
                      {formatDate(order.orderDate.split(" ")[0])}
                    </Td>
                    <Td fontSize="16px" textAlign="center">
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                      >
                        <Text
                          style={{
                            color: getPayStatusColor(
                              order.payStatus,
                              order.totalAmount
                            ),
                          }}
                          m={0}
                        >
                          {order.totalAmount}
                        </Text>
                      </Box>
                    </Td>
                    <Td fontSize="16px" textAlign="center">
                      {order.method}
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
        <HStack spacing={2}>
          <Button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            leftIcon={<ArrowLeftIcon />}
          >
            First
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            leftIcon={<ChevronLeftIcon />}
          >
            Prev
          </Button>
          {renderPageNumbers()}
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            rightIcon={<ChevronRightIcon />}
          >
            Next
          </Button>
          <Button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            rightIcon={<ArrowRightIcon />}
          >
            Last
          </Button>
        </HStack>

        {selectedOrder && (
          <Modal
            isOpen={isOpen}
            onClose={handleCloseModal}
            isCentered
            size={modalSize}
          >
            <ModalOverlay />
            <ModalContent textAlign="center">
              <ModalHeader color="black">訂單詳細資料</ModalHeader>
              <ModalCloseButton color="black" />
              <ModalBody>
                <Text fontSize="16px" color="black" textAlign="center">
                  <strong>訂單號:</strong> {selectedOrder.orderNum}
                </Text>
                <Text color="black" textAlign="center">
                  <strong>電影標題:</strong> {selectedOrder.title}
                </Text>
                <Text fontSize="16px" color="black" textAlign="center">
                  <strong>放映時間:</strong>{" "}
                  {formatDate(selectedOrder.showTime.replace("T", " "))}
                </Text>
                <Text fontSize="16px" color="black" textAlign="center">
                  <strong>電影院名稱:</strong> {selectedOrder.theaterName}
                </Text>
                <Text fontSize="16px" color="black" textAlign="center">
                  <strong>影廳名稱:</strong> {selectedOrder.screenName}
                </Text>
                <Text fontSize="16px" color="black" textAlign="center">
                  <strong>下訂日期:</strong>{" "}
                  {formatDate(selectedOrder.orderDate.split(" ")[0])}
                </Text>
                <Text fontSize="16px" color="black" textAlign="center">
                  <strong>付款狀態:</strong>{" "}
                  <span>{selectedOrder.payStatus}</span>
                </Text>
                <Text color="black" fontSize="16px" textAlign="center">
                  <strong>總金額:</strong>{" "}
                  <span
                    style={{
                      color: getPayStatusColor(
                        selectedOrder.payStatus,
                        selectedOrder.totalAmount
                      ),
                    }}
                  >
                    {selectedOrder.totalAmount}
                  </span>
                </Text>
                <Box p={4}>
                  <Flex direction="column" align="center" justify="center">
                    <Image
                      src={selectedOrder.qrcode}
                      alt="QR Code"
                      border="2px solid"
                      borderColor="black"
                      boxSize="100px"
                    />
                    <Text color="black" fontWeight="bold" mt={2}>
                      qrcode
                    </Text>
                  </Flex>
                </Box>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </VStack>
    </Box>
  );
};

export default OrderHistory;
