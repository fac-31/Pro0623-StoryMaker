import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (imageUrl: string, slideNumber: number): Promise<string> => {
	try {
		const result = await cloudinary.uploader.upload(imageUrl, {
			folder: 'storyboard-images',
			public_id: `slide-${slideNumber}-${Date.now()}`,
			resource_type: 'image',
			format: 'webp', // Convert to WebP for better compression
			quality: 'auto:good', // Automatic quality optimization
			fetch_format: 'auto', // Automatically choose best format for client
			transformation: [
				{
					width: 1792,
					height: 1024,
					crop: 'limit', // Maintain aspect ratio while limiting size
					quality: 'auto:good'
				}
			],
			tags: ['storyboard', 'generated', `slide-${slideNumber}`]
		});

		return result.secure_url;
	} catch (error) {
		console.error('Cloudinary upload failed:', error);
		throw error;
	}
};