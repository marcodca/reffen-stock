import styled, { keyframes } from "styled-components";

const slideInKeyframes = keyframes`
0% {
transform: translateY(1000px);
opacity: 0;
}
100% {
transform: translateY(0);
opacity: 1;
}
`;

export const SlideIn = styled.div`
  animation: ${slideInKeyframes} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`;

const slideInBlurredKeyFrames = keyframes`
      0% {
    transform: translateX(-1000px) scaleX(2.5) scaleY(0.2);
    transform-origin: 100% 50%;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: translateX(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
`;

export const SlideInBlurred = styled.div`
    animation: ${slideInBlurredKeyFrames} 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
`
