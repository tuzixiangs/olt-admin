import { setupWorker } from "msw/browser";
import { curdCreate, curdDelete, curdDetail, curdList, curdUpdate } from "./handlers/_curd";
import { mockTokenExpired } from "./handlers/_demo";
import { menuList } from "./handlers/_menu";
import { upload } from "./handlers/_upload";
import { signIn, userList } from "./handlers/_user";

const handlers = [
	signIn,
	userList,
	mockTokenExpired,
	menuList,
	curdList,
	curdDetail,
	curdCreate,
	curdUpdate,
	curdDelete,
	upload,
];
const worker = setupWorker(...handlers);

export { worker };
