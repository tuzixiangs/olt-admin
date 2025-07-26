import { CircularLoadingStyled } from "./styles";

export interface CircularLoadingProps {
	size?: number;
	color?: string;
	className?: string;
}

export const CircularLoading = ({ size = 30, color = "#1976d2", className = "" }: CircularLoadingProps) => {
	return (
		<div className={`inline-block ${className}`}>
			<CircularLoadingStyled size={size} color={color}>
				<div className="circular-loading" />
			</CircularLoadingStyled>
		</div>
	);
};
