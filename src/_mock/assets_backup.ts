import { faker } from "@faker-js/faker";
import type { Menu, Permission, Role, User } from "#/entity";
import { PermissionType } from "#/enum";

const { GROUP, MENU } = PermissionType;

export const DB_MENU: Menu[] = [
	// group
	{ id: "group_dashboard", name: "sys.nav.dashboard", code: "dashboard", parentId: "", type: GROUP },
	{ id: "group_pages", name: "sys.nav.pages", code: "pages", parentId: "", type: GROUP },
	{ id: "group_ui", name: "sys.nav.ui", code: "ui", parentId: "", type: GROUP },
	{ id: "group_others", name: "sys.nav.others", code: "others", parentId: "", type: GROUP },

	// group_dashboard
	{
		id: "workbench",
		parentId: "group_dashboard",
		name: "sys.nav.workbench",
		code: "workbench",
		icon: "local:ic-workbench",
		type: MENU,
		path: "/workbench",
		component: "/pages/dashboard/workbench",
	},
	{
		id: "analysis",
		parentId: "group_dashboard",
		name: "sys.nav.analysis",
		code: "analysis",
		icon: "local:ic-analysis",
		type: MENU,
		path: "/analysis",
		component: "/pages/dashboard/analysis",
	},
];

export const DB_USER: User[] = [
	{
		id: "user_admin_id",
		username: "admin",
		password: "demo1234",
		avatar: faker.image.avatarGitHub(),
		email: "admin@olt.com",
	},
	{
		id: "user_test_id",
		username: "test",
		password: "demo1234",
		avatar: faker.image.avatarGitHub(),
		email: "test@olt.com",
	},
	{
		id: "user_guest_id",
		username: "guest",
		password: "demo1234",
		avatar: faker.image.avatarGitHub(),
		email: "guest@olt.com",
	},
];

export const DB_ROLE: Role[] = [
	{ id: "role_admin_id", name: "admin", code: "SUPER_ADMIN" },
	{ id: "role_test_id", name: "test", code: "TEST" },
];

export const DB_PERMISSION: Permission[] = [
	{ id: "permission_create", name: "permission-create", code: "permission:create" },
	{ id: "permission_read", name: "permission-read", code: "permission:read" },
	{ id: "permission_update", name: "permission-update", code: "permission:update" },
	{ id: "permission_delete", name: "permission-delete", code: "permission:delete" },
];

export const DB_USER_ROLE = [
	{ id: "user_admin_role_admin", userId: "user_admin_id", roleId: "role_admin_id" },
	{ id: "user_test_role_test", userId: "user_test_id", roleId: "role_test_id" },
];

export const DB_ROLE_PERMISSION = [
	{ id: faker.string.uuid(), roleId: "role_admin_id", permissionId: "permission_create" },
	{ id: faker.string.uuid(), roleId: "role_admin_id", permissionId: "permission_read" },
	{ id: faker.string.uuid(), roleId: "role_admin_id", permissionId: "permission_update" },
	{ id: faker.string.uuid(), roleId: "role_admin_id", permissionId: "permission_delete" },

	{ id: faker.string.uuid(), roleId: "role_test_id", permissionId: "permission_read" },
	{ id: faker.string.uuid(), roleId: "role_test_id", permissionId: "permission_update" },
];
