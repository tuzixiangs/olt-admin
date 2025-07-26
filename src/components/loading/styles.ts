import styled from "styled-components";

interface CircularLoadingStyledProps {
	size: number;
	color: string;
}

export const CircularLoadingStyled = styled.div<CircularLoadingStyledProps>`
  @keyframes spinLoading {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .circular-loading {
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
    border-radius: 50%;
    border: 3px solid transparent;
    border-top: 3px solid ${({ color }) => color};
    animation: spinLoading 1s linear infinite;
  }
`;
