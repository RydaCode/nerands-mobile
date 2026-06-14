import useApi from "../../../hook/useApi";

// Update user data
export const useUpdateUserData = () => {
    const { data, isLoading, error, patch } = useApi('/users/update');

    const updateUserData = async (payload) => {
        if (!payload) return null;

        try {
            const res = await patch(payload);
            return res;
        } catch (err) {
            throw err;
        }
    };

    return {
        data,
        isLoading,
        error,
        updateUserData,
    };
};

// Get user data by phone number or email address
// export const useGetUserDataByPhoneEmail = () => {
//     const { data, isLoading, error, get } = useApi('/users/update');

//     const getUserDataPhoneEmail = async (payload) => {
//         if (!payload) return null;

//         try {
//             const res = await get(payload);
//             return res;
//         } catch (err) {
//             throw err;
//         }
//     };

//     return {
//         data,
//         isLoading,
//         error,
//         getUserDataPhoneEmail,
//     };
// }