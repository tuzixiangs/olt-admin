import { toast } from "@/components/olt-toast";
import { Image, Upload } from "antd";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import type React from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "../icon";
import { ErrorImage, ImagePreviewContainer, OltUploadImage } from "./styles";

interface OltImageUploadProps extends React.ComponentProps<typeof Upload> {
	maxCount?: number;
	maxSize?: number;
	onRemove?: (file: UploadFile) => void;
	// 查看模式
	preview?: boolean;
}

const OltImageUpload: React.FC<OltImageUploadProps> = ({
	maxCount = 9,
	maxSize = 5,
	preview = false,
	onRemove,
	...props
}) => {
	const { t } = useTranslation();
	const imageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	const type = props.accept?.split(",") || ["image/jpeg", "image/png", "image/webp"];

	const beforeUpload = (file: File) => {
		const isJpgOrPng = type.includes(file.type);
		if (!isJpgOrPng) {
			toast.error(`You can only upload ${type.join("/")} file!`);
		}
		const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
		if (!isLtMaxSize) {
			toast.error(`Image must smaller than ${maxSize}MB!`);
		}
		return isJpgOrPng && isLtMaxSize;
	};

	const handleChange = (info: UploadChangeParam<UploadFile>) => {
		console.log("[ info ] >", info);

		// 处理上传失败
		// if (info.file.status === "error") {
		// 	toast.error(t("common.uploadFailed"));
		// }
		if (!info.file.status) return;

		props.onChange?.(info);
	};

	const handleRemove = (file: UploadFile) => {
		// 调用父组件的删除回调
		onRemove?.(file);

		// 如果没有提供 onRemove，则手动更新 fileList
		if (!onRemove && props.fileList) {
			const newFileList = props.fileList.filter((item) => item.uid !== file.uid);
			const info: UploadChangeParam<UploadFile> = {
				file: { ...file, status: "removed" },
				fileList: newFileList,
			};
			props.onChange?.(info);
		}
	};

	const handlePreview = (file: UploadFile) => {
		// 触发对应图片的预览
		const imageContainer = imageRefs.current[file.uid];
		if (imageContainer) {
			const imageElement = imageContainer.querySelector(".ant-image img") as HTMLImageElement;
			if (imageElement) {
				imageElement.click();
			}
		}
	};

	const renderImageItem = (file: UploadFile) => {
		const imageUrl = file.url || file.response?.url || file.thumbUrl;

		return (
			<ImagePreviewContainer
				key={file.uid}
				ref={(el) => {
					imageRefs.current[file.uid] = el;
				}}
			>
				{file.status === "error" ? (
					<ErrorImage>
						<Icon icon="eva:alert-circle-fill" style={{ fontSize: 20, marginBottom: 4 }} />
						<span>{t("common.uploadFailed")}</span>
					</ErrorImage>
				) : file.status === "uploading" ? (
					<div className="w-full h-full bg-gray-100 flex items-center justify-center">
						<div className="w-full h-full flex flex-col items-center justify-center bg-[rgba(0,0,0,0.6)]">
							<Icon className="animate-spin" icon="ant-design:loading-outlined" color="#fff" />
							<div className="text-white text-[12px] mt-1">
								{t("common.uploading", { progress: file.percent || 0 })}
							</div>
						</div>
					</div>
				) : (
					<Image
						src={imageUrl}
						alt={file.name || file.response?.name}
						width={100}
						height={100}
						preview={true}
						style={{ objectFit: "cover" }}
					/>
				)}
				{file.status !== "uploading" && (
					<div className="image-overlay">
						{file.status !== "error" && imageUrl && (
							<div className="action-button" onClick={() => handlePreview(file)}>
								<Icon icon="ant-design:eye-outlined" color="#fff" />
							</div>
						)}
						{!preview && (
							<div className="action-button" onClick={() => handleRemove(file)}>
								<Icon icon="ant-design:delete-outlined" color="#fff" />
							</div>
						)}
					</div>
				)}
			</ImagePreviewContainer>
		);
	};

	return (
		<OltUploadImage>
			<Upload
				{...props}
				action={"/api/upload"}
				accept={type.join(",")}
				listType="picture-card"
				showUploadList={false}
				beforeUpload={beforeUpload}
				onChange={handleChange}
				maxCount={maxCount}
			>
				{(props.fileList?.length || 0) >= maxCount ? null : (
					<div>
						<Icon icon="eva:cloud-upload-fill" />
						<div style={{ marginTop: 8 }}>{t("common.uploadImage")}</div>
					</div>
				)}
			</Upload>

			{props.fileList?.length ? (
				<Image.PreviewGroup>
					<div className="flex flex-wrap gap-2 ml-2">{props.fileList.map(renderImageItem)}</div>
				</Image.PreviewGroup>
			) : null}
		</OltUploadImage>
	);
};

export default OltImageUpload;
