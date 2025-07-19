import { cn } from "@/utils";
import { Link } from "@tanstack/react-router";
import { Icon } from "../icon";

interface Props {
	size?: number | string;
	className?: string;
}
function Logo({ size = 50, className }: Props) {
	return (
		<Link to="/" className={cn(className)}>
			<Icon icon="local:ic-logo" size={size} />
		</Link>
	);
}

export default Logo;
