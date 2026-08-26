import * as ImagePicker from 'expo-image-picker';

export interface PresignedImage {
    fileName: string;
    contentType: string;
    key: string;
    uploadUrl: string;
}

interface UploadProductImagesParams {
    images: ImagePicker.ImagePickerAsset[];
    business_id: string;
    presignImages: (data: any) => Promise<any>;
}

export const uploadImages = async ({
    images,
    business_id,
    presignImages
}: UploadProductImagesParams) => {

    if (images.length === 0) {
        return [];
    }

    // 1. Prepare image metadata
    const imageMetadata = images.map((asset) => ({
        fileName: asset.fileName ?? `image-${Date.now()}.jpg`,
        contentType: asset.mimeType ?? 'image/jpeg',
        fileSize: asset.fileSize ?? 0
    }));

    // 2. Get presigned URLs
    const response = await presignImages({
        business_id,
        images: imageMetadata
    });

    console.log('FAILED', response)

    if (!response?.data?.success) {
        throw new Error(
            response?.message ||
            'Failed to prepare image uploads'
        );
    }

    const presignedImages: PresignedImage[] =
        response.data.data;

    // 3. Upload directly to R2
    const uploadedImages = await Promise.all(
        presignedImages.map(async (presignedImage, index) => {

            const asset = images[index];

            const imageResponse = await fetch(asset.uri);

            if (!imageResponse.ok) {
                throw new Error(
                    `Failed to read image: ${asset.fileName}`
                );
            }

            const blob = await imageResponse.blob();

            const uploadResponse = await fetch(
                presignedImage.uploadUrl,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': presignedImage.contentType
                    }, body: blob
                }
            );

            if (!uploadResponse.ok) {
                throw new Error(
                    `Failed to upload image: ${asset.fileName}`
                );
            }

            return {
                key: presignedImage.key,
                fileName: presignedImage.fileName
            };
        })
    );

    return uploadedImages;
};