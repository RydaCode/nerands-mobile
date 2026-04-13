import { useState } from 'react';
import axios from 'axios';
import { SERVER_URI } from '../RequestMethods';

const useUpdate = (endpoint, params) => {
    const [update, setUpdate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendUpdate = async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            const response = await axios.patch(`${SERVER_URI}${endpoint}`, params, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setUpdate(response.data); // Set successful response data
        } catch (err) {
            setError(err.response?.data?.Response || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const resend = () => {
        sendUpdate();
    };

    return { update, isLoading, error, resend, clear: () => setError(null) };
};

export default useUpdate;