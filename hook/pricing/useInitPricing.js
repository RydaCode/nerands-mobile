import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadDeliveryCharges } from "./loadDeliveryCharges";

const useInitPricing = () => {
    const dispatch = useDispatch();
    const charges = useSelector(state => state.delivery.charges);

    useEffect(() => {
        if (!charges) {
            dispatch(loadDeliveryCharges());
        }
    }, [charges]);

    return charges;
};

export default useInitPricing;