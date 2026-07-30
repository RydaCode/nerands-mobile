// hooks/useTransporterSearch.js
import useApi from "./useApi";

export const useTransporterSearch = () => {
    const { post } = useApi("/transporter/find");

    const searchTransporter = async (payload) => {
        return await post(payload);
    };

    return { searchTransporter };
};