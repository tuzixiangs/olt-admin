import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import type React from "react";

import styles from "./index.module.css";

function HomepageHeader() {
	const { siteConfig } = useDocusaurusContext();
	return (
		<header className={clsx("hero hero--primary", styles.heroBanner)}>
			<div className="container">
				<Heading as="h1" className="hero__title">
					{siteConfig.title}
				</Heading>
				<p className="hero__subtitle">{siteConfig.tagline}</p>
				<div className={styles.buttons}>
					<Link className="button button--secondary button--lg" to="/docs/intro">
						快速开始 - 5分钟 ⏱️
					</Link>
				</div>
			</div>
		</header>
	);
}

function HomepageFeatures() {
	return (
		<section className={styles.features}>
			<div className="container">
				<div className="row">
					<div className={clsx("col col--4")}>
						<div className="text--center">
							<h3>🚀 现代化技术栈</h3>
							<p>基于 React 19、TypeScript、Vite 构建， 提供最新的开发体验和最佳性能。</p>
						</div>
					</div>
					<div className={clsx("col col--4")}>
						<div className="text--center">
							<h3>🎨 精美 UI 组件</h3>
							<p>集成 Ant Design 和 Tailwind CSS， 提供丰富的组件库和灵活的样式系统。</p>
						</div>
					</div>
					<div className={clsx("col col--4")}>
						<div className="text--center">
							<h3>⚡ 开箱即用</h3>
							<p>完整的管理后台解决方案， 包含权限管理、国际化、主题切换等功能。</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function Home(): React.JSX.Element {
	const { siteConfig } = useDocusaurusContext();
	return (
		<Layout title={`欢迎使用 ${siteConfig.title}`} description="OLT Admin - 现代化 React 管理后台解决方案">
			<HomepageHeader />
			<main>
				<HomepageFeatures />
			</main>
		</Layout>
	);
}
