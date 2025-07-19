import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface RouterLinkProps {
	href: string;
	children: ReactNode;
	className?: string;
	[key: string]: any;
}

export const RouterLink: React.FC<RouterLinkProps> = ({ href, children, className, ...props }) => (
	<Link
		to={href as any} // 使用类型断言绕过严格的类型检查
		className={className}
		{...props}
	>
		{children}
	</Link>
);
