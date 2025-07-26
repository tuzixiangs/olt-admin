import { themeVars } from "@/theme/theme.css";
import styled from "styled-components";

export const OltUploadImage = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: var(--spacing(2));
`;

export const ImagePreviewContainer = styled.div`
	position: relative;
	width: 100px;
	height: 100px;
	border-radius: 6px;
	overflow: hidden;
	cursor: pointer;

	&:hover .image-overlay {
		opacity: 1;
	}

	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		opacity: 0;
		transition: opacity 0.2s ease-in-out;
		z-index: 1;
	}

	.action-button {
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

export const ErrorImage = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	background: ${themeVars.colors.palette.gray[100]};
	flex-direction: column;
	align-items: center;
	justify-content: center;
	color: #ff4d4f;
	font-size: 12px;
	text-align: center;
	position: relative;
`;
