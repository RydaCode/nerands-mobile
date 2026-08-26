import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setNotifications } from '../redux/store/slices/notificationSlice';

const useNotifications = (api) => {
    const dispatch = useDispatch();

    const loadNotifications = useCallback(
        async (limit = 10, offset = 0) => {
            try {
                console.log('Fetching notifications...');

                const res = await api.get(
                    `/notifications/all?limit=${limit}&offset=${offset}`
                );

                console.log(
                    'Notifications response:',
                    res.data.result
                );

                dispatch(
                    setNotifications(res.data.result)
                );

                return res.data.result;

            } catch (error) {
                console.log(
                    'Loading notifications failed:',
                    error?.message
                );

                return null;
            }
        },
        [api, dispatch]
    );

    return {
        loadNotifications,
    };
};

export default useNotifications;