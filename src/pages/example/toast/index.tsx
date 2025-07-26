import { toast } from "@/components/olt-toast";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

export default function ToastPage() {
	const promise = () => new Promise((resolve) => setTimeout(() => resolve({ name: "Sonner" }), 2000));

	const handleSubmit = () => {
		toast.promise(promise, {
			loading: "Loading...",
			success: (data: any) => {
				return `${data.name} toast has been added`;
			},
			error: "Error",
		});
	};
	return (
		<div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
			<Card title="Simple" className="flex-none text- lg:flex-1 bg-">
				<CardHeader>
					<CardTitle>Simple</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Button variant="outline" onClick={() => toast("Toast Default", {})}>
							Default
						</Button>
						<Button
							variant="ghost"
							className="bg-info!"
							onClick={() =>
								toast.info("Toast Info", {
									description: "Toast Description Info asdfdfasdfasdfasdfasdfasdfasdf",
								})
							}
						>
							Info
						</Button>
						<Button
							variant="ghost"
							className="bg-success!"
							onClick={() =>
								toast.success("Toast Success", {
									closeButton: true,
								})
							}
						>
							Success
						</Button>
						<Button variant="ghost" className="bg-warning!" onClick={() => toast.warning("Toast Warning")}>
							Warning
						</Button>
						<Button variant="ghost" className="bg-error!" onClick={() => toast.error("Toast Error")}>
							Error
						</Button>
					</div>
				</CardContent>
			</Card>
			<Card title="With Action">
				<CardHeader>
					<CardTitle>With Action</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Button
							variant="outline"
							onClick={() =>
								toast("Toast Default", {
									cancel: {
										label: "Cancel",
										onClick: () => {},
									},
									action: {
										label: "Action",
										onClick: () => {},
									},
								})
							}
						>
							Default
						</Button>
						<Button
							variant="ghost"
							className="bg-info!"
							onClick={() =>
								toast.info("Toast Info", {
									action: {
										label: "Action",
										onClick: () => {},
									},
									cancel: {
										label: "Cancel",
										onClick: () => {},
									},
								})
							}
						>
							Info
						</Button>
						<Button
							variant="ghost"
							className="bg-success!"
							onClick={() =>
								toast.success("Toast Success", {
									action: {
										label: "Action",
										onClick: () => {},
									},
									cancel: {
										label: "Cancel",
										onClick: () => {},
									},
								})
							}
						>
							Success
						</Button>
						<Button
							variant="ghost"
							className="bg-warning!"
							onClick={() =>
								toast.warning("Toast Warning", {
									action: {
										label: "Action",
										onClick: () => {},
									},
									cancel: {
										label: "Cancel",
										onClick: () => {},
									},
								})
							}
						>
							Warning
						</Button>
						<Button
							variant="ghost"
							className="bg-error!"
							onClick={() =>
								toast.error("Toast Error", {
									action: {
										label: "Action",
										onClick: () => {},
									},
									cancel: {
										label: "Cancel",
										onClick: () => {},
									},
								})
							}
						>
							Error
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card title="Position">
				<CardHeader>
					<CardTitle>Position</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Button variant="outline" onClick={() => toast.info("Toast Info", { position: "top-left" })}>
							Top Left
						</Button>
						<Button variant="outline" onClick={() => toast.info("Toast Info", { position: "top-center" })}>
							Top Center
						</Button>
						<Button variant="outline" onClick={() => toast.info("Toast Info", { position: "top-right" })}>
							Top Right
						</Button>
						<Button variant="outline" onClick={() => toast.info("Toast Info", { position: "bottom-right" })}>
							Bottom Right
						</Button>
						<Button variant="outline" onClick={() => toast.info("Toast Info", { position: "bottom-center" })}>
							Bottom Center
						</Button>
						<Button variant="outline" onClick={() => toast.info("Toast Info", { position: "bottom-left" })}>
							Bottom Left
						</Button>
					</div>
				</CardContent>
			</Card>
			<Card title="Mode">
				<CardHeader>
					<CardTitle>Mode (Toast vs Notification)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Button variant="outline" onClick={() => toast.success("Toast 模式消息", { mode: "toast" })}>
							Toast 模式
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								toast.success("Notification 模式消息", {
									mode: "notification",
									description: "这是一个 notification 模式的描述信息",
								})
							}
						>
							Notification 模式
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								toast.error("错误提示", {
									mode: "notification",
									description: "这是一个错误的详细描述",
									closeButton: true,
								})
							}
						>
							Notification 错误
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								toast.info("信息提示", {
									mode: "notification",
									description: "这是一个信息的详细描述，icon 和内容平行显示",
								})
							}
						>
							Notification 信息
						</Button>
					</div>
				</CardContent>
			</Card>
			<Card title="Persistent Toast">
				<CardHeader>
					<CardTitle>Persistent Toast (Duration = 0)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<Button
							variant="outline"
							onClick={() =>
								toast.success("持久化成功消息", {
									duration: 0,
									closeButton: true,
								})
							}
						>
							持久化成功
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								toast.error("持久化错误消息", {
									duration: 0,
									description: "这个错误消息会一直显示直到手动关闭",
									closeButton: true,
								})
							}
						>
							持久化错误
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								toast.info("持久化信息", {
									duration: 0,
									mode: "notification",
									description: "notification 模式的持久化消息",
									closeButton: true,
								})
							}
						>
							持久化通知
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								toast("普通持久化消息", {
									duration: 0,
									action: {
										label: "确认",
										onClick: () => toast.success("已确认"),
									},
									cancel: {
										label: "取消",
										onClick: () => {},
									},
								})
							}
						>
							带操作的持久化
						</Button>
					</div>
					<p className="text-sm text-muted-foreground mt-4">
						💡 提示：当 duration 设置为 0 时，toast 将不会自动销毁，需要用户手动关闭或通过代码控制。
					</p>
				</CardContent>
			</Card>
			<Card title="With Promise">
				<CardHeader>
					<CardTitle>With Promise</CardTitle>
				</CardHeader>
				<CardContent>
					<Button variant="outline" onClick={handleSubmit}>
						On Submit
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
