import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/Buttons/CustomButton";
import FormInputs from "../../../components/FormFields/FormInputs";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";
import LoadingIndicator from "../../LoadingIndicator";
import Redirecting from "../../Redirecting";

const index = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user_id } = useSelector((state) => state.auth);

    const { data: response, patch, isLoading: apiLoading, error } = useApi("/transporter/update");

    const [formData, setFormData] = useState({
        courier_type: params.courier_type,
        transporter_id: params.transporter_id,
        drivers_license: "",
        transporter_car_bike_name: "",
        transporter_car_model: "",
        transporter_car_year: "",
        transporter_car_bike_reg_number: "",
        transporter_car_bike_color: "",
        transporter_residential_address: "",
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChangeText = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleCompleteAccount = async () => {
        const visibleFields =
            formData.courier_type === "Foot" || formData.courier_type === "Cycler"
            ? ["courier_type", "transporter_residential_address"]
            : Object.keys(formData);

        const fieldLabels = {
            drivers_license: "Driver’s License",
            transporter_car_bike_name: "Car/Bike Name",
            transporter_car_model: "Car Model",
            transporter_car_year: "Car Year",
            transporter_car_bike_reg_number: "Registration Number",
            transporter_car_bike_color: "Car/Bike Color",
            transporter_residential_address: "Residential Address",
            courier_type: "Courier Type",
        };

        // Validate only visible fields
        for (const key of visibleFields) {
            if (!formData[key]) {
                const errorMsg = `Please Enter ${fieldLabels[key] || key}`;
                setErrorMessage(errorMsg);
                toast.error(errorMsg);
                return;
            }
        }

        setErrorMessage("");

        // Send data to backend
        await patch({ ...formData, user_id });
    };

    useEffect(() => {
        if (response) {
            // Check the success flag from your backend
            if (response.success) {
                toast.success(response.message || "Transporter data updated successfully!");
                setIsSuccess(true);

                // Redirect back after 5 seconds
                // setTimeout(() => router.back(), 5000);
            } else {
                // Display backend error message
                toast.error(response.message || "Something went wrong");
            }
        }

        if (error) {
            // Network or API error
            toast.error("Error", "An error occurred. Please try again.");
        }
    }, [response, error]);

    // Conditionally render fields
    const transporterFields =
        formData.courier_type === "Foot" || formData.courier_type === "Cycler"
        ? ["transporter_residential_address"]
        : [
            "drivers_license",
            "transporter_car_bike_name",
            "transporter_car_model",
            "transporter_car_year",
            "transporter_car_bike_reg_number",
            "transporter_car_bike_color",
            "transporter_residential_address",
        ];

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <Text className="text-2xl" style={{ fontFamily: "ubuntu-medium" }}>
                Complete Account Setup
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} className="w-full">
                <View className="mt-6 w-full px-4">

                    {/* Conditionally render transporter fields */}
                    {transporterFields.map((key) => (
                        <FormInputs
                            key={key}
                            title={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            value={formData[key]}
                            handleChangeText={(value) => handleChangeText(key, value)}
                            desc={`Enter ${key.replace(/_/g, " ")}`}
                            borderStyle="border border-lavender"
                        />
                    ))}

                    {/* Error message */}
                    <View className="w-full my-2 justify-center items-center">
                        <Text className="text-red text-base" style={{ fontFamily: "roboto" }}>
                        {errorMessage}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Upload Button */}
            <View className="w-full px-4">
                <CustomButton
                    title={apiLoading ? "Loading..." : "Complete Setup"}
                    handlePress={handleCompleteAccount}
                    disabled={apiLoading}
                    otherStyles={`bg-primary p-4 mt-4 ${apiLoading ? "opacity-50" : "opacity-100"}`}
                    textStyles="text-2xl"
                />
            </View>
            {apiLoading && <LoadingIndicator loading_text="Completing account..." />}
            {isSuccess && <Redirecting title="Success" />}
        </SafeAreaView>
    );
};

export default index;