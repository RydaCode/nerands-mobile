import { useState } from 'react';
import axios from 'axios';
import { SERVER_URI } from '../RequestMethods';

const useDelete = (endpoint, params) => {
    const [remove, setRemove] = useState(null);
    const [delLoading, setDelLoading] = useState(false);
    const [delerror, setDelError] = useState(null);

    const sendDelete = async () => {
        setDelLoading(true);
        setDelError(null); //Clear previous errors
        try {
            // Send DELETE request with params in the data object for axios
            const response = await axios.delete(`${SERVER_URI}${endpoint}`, {
                data: params,  //Correctly pass params as `data`
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setRemove(response.data); //Set successful response data
        } catch (err) {
            setDelError(err?.response?.data?.Response || err?.message || 'An unknown error occurred.');
        } finally {
            setDelLoading(false);
        }
    };

    const redel = () => {
        sendDelete();  //Call the sendDelete function again if needed
    };

    return { remove, delLoading, delerror, redel, clear: () => setDelError(null) };
};

export default useDelete;