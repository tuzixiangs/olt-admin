import { useParams } from "@/routes/hooks";
import { useUserInfo } from "@/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Separator } from "@/ui/separator";

export default function UserDetailPage() {
	const params = useParams() as { id?: string };
	const { id } = params;
	const { username, email, avatar } = useUserInfo();

	// Mock user data - in real app, fetch by ID
	const userData = {
		id: id || "1",
		username,
		email,
		avatar,
		role: "Admin",
		status: "Active",
		lastLogin: new Date().toLocaleDateString(),
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>User Details - {userData.id}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center space-x-4">
						<Avatar className="h-16 w-16">
							<AvatarImage src={userData.avatar} />
							<AvatarFallback>{(userData.username || "U").slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
						<div>
							<h3 className="text-lg font-semibold">{userData.username || "Unknown"}</h3>
							<p className="text-muted-foreground">{userData.email || "No email"}</p>
						</div>
					</div>

					<Separator />

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label htmlFor="role" className="text-sm font-medium">
								Role
							</label>
							<Badge variant="secondary">{userData.role}</Badge>
						</div>
						<div>
							<label htmlFor="status" className="text-sm font-medium">
								Status
							</label>
							<Badge variant="outline">{userData.status}</Badge>
						</div>
						<div>
							<label htmlFor="lastLogin" className="text-sm font-medium">
								Last Login
							</label>
							<p className="text-sm">{userData.lastLogin}</p>
						</div>
					</div>

					<div className="flex space-x-2">
						<Button>Edit User</Button>
						<Button variant="outline">Reset Password</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
