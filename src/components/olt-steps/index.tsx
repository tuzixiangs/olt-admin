import { Steps as AntSteps, type StepsProps as AntStepsProps } from "antd";
import type { StepProps as AntStepProps } from "antd";
import type React from "react";
import { OltStepsStyled } from "./styles";

export interface StepProps extends AntStepProps {}

export interface StepsProps extends AntStepsProps {}

const OltSteps: React.FC<StepsProps> = (props) => {
	return (
		<OltStepsStyled>
			<AntSteps {...props} />
		</OltStepsStyled>
	);
};

export default OltSteps;
