import { Button } from "@chakra-ui/react";
import PropTypes from "prop-types";

const ButtonHome = ({ onClick, label, bg, color, _hover, _focus }) => {
  return (
    <Button
      onClick={onClick}
      bg={bg} // 按钮背景颜色
      color={color} // 按钮文字颜色
      _hover={_hover} // 按钮悬停时颜色
      _focus={_focus} // 按钮聚焦时颜色
      margin="0 10px"
      padding="10px 20px"
      borderRadius="20px"
    >
      {label}
    </Button>
  );
};

ButtonHome.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  _hover: PropTypes.object.isRequired,
  _focus: PropTypes.object.isRequired,
};

export default ButtonHome;
