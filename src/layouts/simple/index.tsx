import type { ReactNode } from "react";

interface SimpleLayoutProps {
	children?: ReactNode;
}

export default function SimpleLayout({ children }: SimpleLayoutProps) {
	return <div className="w-full min-h-screen bg-background">{children}</div>;
}
