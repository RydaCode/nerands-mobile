import { useState } from 'react';
import { SERVER_URI } from '../RequestMethods';  // Adjust import if needed

const useFileUpload = (endpoint) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateImage = async (images, additionalData = {}) => {
        if (!images || !Array.isArray(images) || images.length === 0) {
            console.error('No images provided for update.');
            return;
        }

        setIsLoading(true);
        setError(null); // Reset error before starting the upload

        const formData = new FormData();

        // Process each image URI and append it to FormData
        images.forEach((imageUri) => {
            const fileType = imageUri?.endsWith('.jpg') || imageUri?.endsWith('.jpeg')
                ? 'image/jpeg'
                : imageUri?.endsWith('.png')
                ? 'image/png'
                : 'image/jpeg'; // Default fallback to JPEG if undefined

            formData.append('profile_image', {
                uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`, // Ensure URI is correct
                name: `profile_${Date.now()}.jpg`, // Change name as needed
                type: fileType,
            });
        });

        // Append additional data to the form
        Object.keys(additionalData).forEach((key) => {
            formData.append(key, additionalData[key]);
        });

        try {
            const response = await fetch(`${SERVER_URI}${endpoint}`, {
                method: 'POST',  // Or 'POST' depending on your endpoint
                headers: {
                    'Accept': 'application/json',  // Accept JSON response
                    // 'Authorization': `Bearer YOUR_TOKEN`,  // Authorization if needed
                },
                body: formData,  // Attach the FormData
            });

            const rawResponse = await response.text(); // Use text() for raw response
            let data = {};
            try {
                data = JSON.parse(rawResponse); // Parse the response as JSON
            } catch (parseError) {
                console.error("Error parsing JSON: ", parseError);
            }

            if (!response.ok) {
                const errorMessage = data.Response || 'An error occurred during the update.';
                setError(errorMessage);
                throw new Error(errorMessage);  // Throw error to be caught in the component
            }

            return data; // Return data for further use in component

        } catch (err) {
            console.error('Update Error:', err);
            setError(err.message); // Set error to be displayed in component
            throw err; // Re-throw error for component to handle
        } finally {
            setIsLoading(false);
        }
    };

    return { updateImage, isLoading, error };
};

export default useFileUpload;
