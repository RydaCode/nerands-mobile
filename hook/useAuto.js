import { useState, useEffect } from 'react';
import axios from 'axios';
// import { useNavigation } from '@react-navigation/native';

// const navigation = useNavigation();
const useAuto = (endpoint) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    
    const options = {
        method: 'GET',
        url: process.evn.SERVER_URI`${endpoint}`,
        headers: {
            // 'X-Rapid-Key': 'jldlkgjlgbjidfljgdkljbdijbkldngkdsjdjgkd',
            'X-Rapid-Host': 'nerands.com'
        },
    };

    const fetchData = async () => {
        try {
            const response = await axios.request(options);
            setData(response.data);
        } catch(error) {
            setError(error);
            // navigation.navigate('');
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         fetchData();
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    const refetch = () => {
        fetchData();
    }

    return {data, error, refetch}
}

export default useAuto;