import { Resizable, type ResizeCallbackData } from "react-resizable";

interface ResizableTitleProps extends React.HTMLAttributes<HTMLTableCellElement> {
	onColumnResize: (e: React.SyntheticEvent, data: ResizeCallbackData) => void;
	width: number;
}

const ResizableHeader: React.FC<ResizableTitleProps> = (props) => {
	const { onColumnResize, width, ...restProps } = props;

	if (!width) {
		return <th {...restProps} />;
	}

	return (
		<Resizable
			width={width}
			height={0}
			handle={
				<span
					className="react-resizable-handle"
					onClick={(e) => {
						e.stopPropagation();
					}}
				/>
			}
			onResize={onColumnResize}
			draggableOpts={{ enableUserSelectHack: false }}
		>
			<th {...restProps} />
		</Resizable>
	);
};

export default ResizableHeader;
