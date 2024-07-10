import { keyframes, styled } from "@mui/system";

const hueRotate = keyframes`
    100%{
        filter: hue-rotate(360deg);
    }`;

const AnimatedWrapper = styled('div')({
    '&:hover': {
        animation: `${hueRotate} 1s linear infinite`
    },
});


