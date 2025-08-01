import { useRouter } from "@/routes/hooks";
import { Tabs } from "antd";
import { useEffect, useRef } from "react";
import styled from "styled-components";
import SortableContainer from "./components/sortable-container";
import { SortableItem } from "./components/sortable-item";
import { TabItem } from "./components/tab-item";
import { useMultiTabsStyle } from "./hooks/use-tab-style";
import { useMultiTabsContext } from "./providers/multi-tabs-provider";
import type { KeepAliveTab } from "./types";

export default function MultiTabs() {
	const scrollContainer = useRef<HTMLUListElement>(null);

	const { tabs, activeTabRoutePath, setTabs } = useMultiTabsContext();
	const style = useMultiTabsStyle();
	const { push } = useRouter();

	const handleTabClick = ({ path }: KeepAliveTab) => {
		push(path || "/");
	};

	useEffect(() => {
		if (!scrollContainer.current) return;
		const tab = tabs.find((item) => item.path === activeTabRoutePath);
		const currentTabElement = scrollContainer.current.querySelector(`#tab${tab?.path?.split("/").join("-")}`);
		if (currentTabElement) {
			currentTabElement.scrollIntoView({
				block: "nearest",
				behavior: "smooth",
			});
		}
	}, [tabs, activeTabRoutePath]);

	useEffect(() => {
		const container = scrollContainer.current;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			container.scrollLeft += e.deltaY;
		};

		container.addEventListener("mouseenter", () => {
			container.addEventListener("wheel", handleWheel);
		});

		container.addEventListener("mouseleave", () => {
			container.removeEventListener("wheel", handleWheel);
		});

		return () => {
			container.removeEventListener("wheel", handleWheel);
		};
	}, []);

	const handleDragEnd = (oldIndex: number, newIndex: number) => {
		const newTabs = Array.from(tabs);
		const [movedTab] = newTabs.splice(oldIndex, 1);
		newTabs.splice(newIndex, 0, movedTab);

		setTabs([...newTabs]);
	};

	const renderOverlay = (id: string | number) => {
		const tab = tabs.find((tab) => tab.path === id);
		if (!tab) return null;
		return <TabItem tab={tab} />;
	};

	return (
		<StyledMultiTabs>
			<Tabs
				size="small"
				type="card"
				tabBarGutter={4}
				activeKey={activeTabRoutePath}
				items={tabs.map((tab) => ({
					...tab,
					label: tab.handle?.title || "",
					key: tab.path || "/",
					children: <div key={tab.handle?.timeStamp}>{tab.handle?.outlet}</div>,
				}))}
				renderTabBar={() => {
					return (
						<div style={style} className="shadow-sm">
							<SortableContainer items={tabs} onSortEnd={handleDragEnd} renderOverlay={renderOverlay}>
								<ul ref={scrollContainer} className="flex overflow-x-auto w-full px-2 h-[32px] hide-scrollbar">
									{tabs.map((tab) => (
										<SortableItem tab={tab} key={tab.path} onClick={() => handleTabClick(tab)} />
									))}
								</ul>
							</SortableContainer>
						</div>
					);
				}}
			/>
		</StyledMultiTabs>
	);
}

const StyledMultiTabs = styled.div`
  height: 100%;
  
  .anticon {
    margin: 0px !important;
  }
  
  .ant-tabs {
    height: 100%;
    .ant-tabs-content {
      height: 100%;
    }
    .ant-tabs-tabpane {
      height: 100%;
      & > div {
        height: 100%;
      }
    }
  }

  .hide-scrollbar {
    overflow: scroll;
    scrollbar-width: none;
    -ms-overflow-style: none;
    will-change: transform;
 
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
