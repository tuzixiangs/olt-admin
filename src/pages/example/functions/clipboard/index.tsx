import { Icon } from "@/components/icon";
import { useCopyToClipboard } from "@/hooks";
import { Card, CardContent } from "@/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/tooltip";
import { faker } from "@faker-js/faker";
import { Button } from "antd";
import { Input } from "antd";
import { type ChangeEvent, useState } from "react";

export default function ClipboardPage() {
	const { copyFn } = useCopyToClipboard();

	const [value, setValue] = useState("https://www.npmjs.com/package/");

	const textOnClick = faker.lorem.paragraphs({ min: 3, max: 5 });

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
	const CopyButton = (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button type="text" icon={<Icon icon="eva:copy-fill" size={20} />} onClick={() => copyFn(value)} />
			</TooltipTrigger>
			<TooltipContent>Copy</TooltipContent>
		</Tooltip>
	);
	return (
		<Card>
			<CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				<div>
					<h5 className="mb-2 font-medium">ON CHANGE</h5>
					<div className="flex items-center gap-2">
						<Input value={value} onChange={handleChange} />
						{CopyButton}
					</div>
				</div>
				<div>
					<h5 className="mb-2 font-medium">ON DOUBLE CLICK</h5>
					<div onDoubleClick={() => copyFn(textOnClick)}>{textOnClick}</div>
				</div>
			</CardContent>
		</Card>
	);
}
