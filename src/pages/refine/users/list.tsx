import { useList } from "@refinedev/core";

export default function UserList() {
	const {
		data: users,
		isLoading,
		error,
	} = useList({
		resource: "users",
		dataProviderName: "refine",
	});

	console.log("[ users ] >", users);

	if (isLoading) {
		return <div>Loading users...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div>
			<h1>Refine Users Page</h1>
			<ul>
				{users?.data?.map((record) => (
					<li key={record.id}>{record.name || record.email || record.id}</li>
				))}
			</ul>
		</div>
	);
}
