import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/Buttons/CustomButton";
import DeliveryOptions from "../../../components/DeliveryOptions";
import DescriptionInput from "../../../components/FormFields/DescriptionInput";
import FormInputs from "../../../components/FormFields/FormInputs";
import { COLORS, SIZES } from "../../../constants/constants";
import useApi from "../../../hook/useApi";
import { toast } from "../../../utils/toast";
import LoadingIndicator from "../../LoadingIndicator";
import Redirecting from "../../Redirecting";

const CustomOrderScreen = () => {
    const {
        user_id,
        user_type,
        email_add,
        first_name,
        last_name,
        phone_num,
        gender,
        date_of_birth,
        country,
        province,
        profile_image,
        is_transporter,
        is_runner,
    } = useSelector((state) => state.auth);

    const { width, height } = Dimensions.get("window");
    const buttonWidth = width * 0.4;

    const router = useRouter();
    const [agreement, setAgreement] = useState(true);
    const [address, setAddress] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [redirect, setRedirect] = useState(false);
    const [inputs, setInputs] = useState([
        { id: Date.now().toString(), value: "" },
    ]);
    const [delivery, setSelected] = useState(null);
    const charges = useSelector(state => state.delivery.charges);

    const [formData, setFormData] = useState({
        user_id: user_id,
        first_name: first_name,
        last_name: last_name,
        custom_stores: "",
        estimated_spend_amount: "",
        order_notes: "",
        recipients_full_names: "",
        receipients_phone_number: "",
        runner_location: 0,
        service_fee: 0,
        delivery_address_status: address,
    });

    const {
        latitude, longitude, displayCurrentLocation, locationServicesEnabled,
    } = useSelector((state) => state.location)

    // API hook
    const runnerUrl = useMemo(() => {
        return `/runner/search?latitude=${latitude}&longitude=${longitude}`;
    }, [latitude, longitude]);

    const { 
        data: searchrunner,
        error: searchRunnerError,
        isLoading: searchLoading,
        get: getRunner,
     } = useApi(runnerUrl);

     console.log(searchLoading)

     useEffect(() => {
        getRunner();
    }, []);
    
    const {
        data: send,
        isLoading: makeOrderLoading,
        error: makeOrderError,
        post: makeOrderPost,
    } = useApi(`/customorders/make_order/`);

    console.log(send)
    
    const origin = useMemo(() => {
        if (latitude == null || longitude == null) return null;

        return {
            latitude: Number(latitude),
            longitude: Number(longitude)
        };
    }, [latitude, longitude]);

    const destination = useMemo(() => {
        if (!Array.isArray(searchrunner)) return null;

        return {
            latitude: Number(searchrunner[0]?.location_latitude),
            longitude: Number(searchrunner[0]?.location_longitude)
        };
    }, [searchrunner]);

    useEffect(() => {
        if (!locationServicesEnabled) {
            Alert.alert(
                "Location Services Disabled",
                "Please enable location services to proceed.",
            );
        }
    }, [locationServicesEnabled]);

    useEffect(() => {
        if (!searchrunner || searchrunner?.length === 0) return;
        if (searchrunner?.length) {
            setFormData((prev) => ({
                ...prev,
                custom_order_latitude:
                latitude ?? prev.custom_order_latitude,
                custom_order_longitude: longitude ?? prev.custom_order_longitude,
                runner_location: searchrunner[0]?.location ?? prev.location,
                delivery_mode: delivery?.mode,
                runner_id: searchrunner[0]?.runner_id || prev.runner_id,
                delivery_fee: delivery?.fee ?? 0,
            }));
        }
    }, [
        latitude,
        longitude,
        searchrunner,
        delivery
    ]);

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            custom_products: inputs
                .map((input) => input.value.trim())
                .filter(Boolean),
        }));
    }, [inputs]);

    const addInputField = useCallback(() => {
        setInputs((prev) => [...prev, { id: Date.now().toString(), value: "" }]);
    }, []);

    const handleInputChange = (id, value) => {
        setInputs((prev) =>
            prev.map((input) => (input.id === id ? { ...input, value } : input)),
        );
    };

    const removeInputField = useCallback(
        (id) => {
            if (inputs.length > 1) {
                setInputs((prev) => prev.filter((input) => input.id !== id));
            } else {
                toast.error("You can't remove the last text box!");
            }
        }, [inputs.length],
    );

    const calculateServiceFee = (amount) => {
        let percent = charges?.charge_percent ?? 15;

        if (amount > 500) percent -= 4;
        else if (amount > 300) percent -= 3;
        else if (amount > 100) percent -= 2;

        const fee = +(amount * (percent / 100)).toFixed(2);

        // Cap the service fee at 150
        return Math.min(fee, 150);
    };

    const handleChangeText = useCallback((key, value) => {
        setFormData((prev) => {
            if (key === "estimated_spend_amount") {
                const spendAmount = parseFloat(value.toString().trim()) || 0;
                return {
                    ...prev,
                    estimated_spend_amount: Math.round(spendAmount),
                    service_fee: Math.round(calculateServiceFee(spendAmount)),
                };
            }
            return {
                ...prev,
                [key]: typeof value === "string" ? value.trimStart() : value,
            };
        });
    }, []);

    const normalizePhone = (raw) => {
        if (!raw) return "";

        // Remove all non-digit characters (spaces, +, -, etc.)
        const digits = raw.toString().replace(/\D/g, "");

        // Handle Zambian numbers with or without international prefix
        if (digits.startsWith("260")) {
            // "26097xxxxxxx" → "097xxxxxxx"
            return "0" + digits.slice(3, 12);
        }

        if (digits.startsWith("00260")) {
            // "0026097xxxxxxx" → "097xxxxxxx"
            return "0" + digits.slice(5, 14);
        }

        // Already valid local format
        if (digits.startsWith("0") && digits.length === 10) {
            return digits;
        }

        // Missing leading zero
        if (digits.length === 9) {
            return "0" + digits;
        }

        // Fallback
        return digits;
    };

    const validPrefixes = new Set([
        "0970", "0971", "0972", "0973", "0974", "0975", "0976", "0977", "0978", "0979", //Airtel
        "0770", "0771", "0772", "0773", "0774", "0775", "0776", "0777", "0778", "0779", //Airtel
        "0960", "0961", "0962", "0963", "0964", "0965", "0966", "0967", "0968", "0969", //MTN
        "0760", "0761", "0762", "0763", "0764", "0765", "0766", "0767", "0768", "0769", //MTN
        "0950", "0951", "0952", "0953", "0954", "0955", "0956", "0957", "0958", "0959", //Zamtel
        "0750", "0751", "0752", "0753", "0754", "0755", "0756", "0757", "0758", "0759", //Zamtel
        '0980', '0981', '0982', '0983', '0984', '0985', '0986', '0987', '0988', '0989' //Zedmobile
    ]);

    const grandTotal = useMemo(() => {
        const spend = Number(formData.estimated_spend_amount || 0);
        const serviceFee = Number(formData.service_fee || 0);
        const deliveryFee = Number(delivery?.fee || 0); // ✅ SAFE

        return spend + serviceFee + deliveryFee;
    }, [formData.estimated_spend_amount, formData.service_fee, delivery]);

    // Delivery Modes and Fees
    const DeliveryOptionList = useMemo(() => {
        if (searchLoading) {
            return (
                <View className='justify-center items-center bg-grey_bg rounded-md p-4'>
                    <ActivityIndicator size={30} color={COLORS.primary} />
                    <Text
                        className='text-base text-green2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Fetching delivery data, please wait...</Text>
                </View>
            );
        } else if (!searchrunner || !Array.isArray(searchrunner)) {
            return (
                <View className='justify-center items-center bg-grey_bg rounded-md p-4 elevation-sm border border-lavender'>
                    <Text
                        className='text-base text-red'
                        style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}
                    >⚠️ No runners are available at the moment. Delivery fees cannot be calculated, so orders cannot be placed. Please try again shortly or tap “Refresh” to check again.</Text>

                    <TouchableOpacity
                        className='bg-green1 flex-row justify-center items-center mt-4 rounded elevation-sm py-3 px-8'
                        onPress={getRunner}
                        disabled={searchLoading}
                    >
                        <MaterialCommunityIcons name="reload" size={22} color="white" />
                        <Text className='text-white text-base' style={{fontFamily: 'roboto-medium'}}>Refresh</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <>
                <View className='flex-row justify-center items-center mb-6'>
                    <Text className='text-base text-green1' style={{fontFamily: 'roboto-medium'}}>
                        <Text className='text-black'>Est. Order Amount:{" "}</Text>K{Number(formData.estimated_spend_amount || 0).toLocaleString()}
                    </Text>
                    <Text className='mx-3 text-slate text-xl'>|</Text>
                    <Text className='text-base text-primary' style={{fontFamily: 'roboto-medium'}}>
                        <Text className='text-black'>Delivery Fee:{" "}</Text>K{delivery?.fee ?? 0}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between mb-5">
                    <Text
                        className="text-2xl"
                        style={{ fontFamily: "maven-medium" }}
                    >
                        Est. Grand Total:
                    </Text>
                    <View className="bg-red items-center justify-center"
                        style={{
                            padding: 4,
                            borderRadius: SIZES.radius,
                            width: buttonWidth,
                            height: height * 0.06,
                        }}
                    >
                        <Text style={{ fontFamily: "ubuntu-medium" }} className="text-xl text-white">
                            K{grandTotal.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <View className="w-full my-6">
                    <Text className="text-black text-lg" style={{ fontFamily: 'roboto-bold' }}>
                        Delivery Options
                    </Text>

                    {(!delivery || searchLoading) && (
                        <Text className="text-slate text-sm my-2" style={{ fontFamily: 'roboto-medium' }}>
                            Calculating delivery options…
                        </Text>
                    )}

                    <DeliveryOptions
                        origin={origin}
                        destination={destination}
                        onSelectMode={setSelected}
                    />

                    {delivery && (
                        <Text>
                            Selected: {delivery?.mode} - K{delivery?.fee ?? 0}
                        </Text>
                    )}
                </View>
            </>
        );
    }, [searchrunner, origin, destination, delivery, grandTotal, searchLoading]);

    const handleMakeCustomOrder = async () => {
        // If sending to a different address, require recipient name
        if (address) {
            const recipient = (formData.recipients_full_names || "")
                .toString()
                .trim();
            if (!recipient) {
                toast.error("Please enter recipient's name!");
                return;
            }
        }

        // estimated_spend_amount should be numeric
        const spend = Number(formData.estimated_spend_amount || 0);
        if (!spend) {
            toast.error("Please estimate amount to be spent!");
            return;
        }

        if (spend < 50) {
            toast.error("Orders less than K50 are not taken!");
            return;
        }

        // custom_products must exist and have at least one non-empty string
        const products = Array.isArray(formData.custom_products)
            ? formData.custom_products.filter(Boolean)
            : [];
        if (products.length === 0) {
            toast.error("Please enter at least one product.");
            return;
        }

        // If address specified, validate phone
        if (address) {
            const rawPhone = formData.receipients_phone_number;

            if (rawPhone === null || rawPhone === '') {
                toast.error(
                    "Please enter recipient's phone number!",
                );
                return;
            }

            const phone = normalizePhone(rawPhone).trim();

            const prefix = phone.substring(0, 4);
            if (!validPrefixes.has(prefix)) {
                toast.error(
                    "Phone number must start with a valid prefix (e.g: 0971)!",
                );
                return;
            }

            if (!/^\d{10}$/.test(phone)) {
                toast.error("Enter a valid 10-digit phone number (e.g. 097XXXXXXXX).");
                return;
            }
        }

        // final payload ensure correct types
        const payload = {
            ...formData,
            estimated_spend_amount: spend,
            custom_products: products,
        };

        try {
            await makeOrderPost(payload);

            // Optionally you can set a local loading state if your hook doesn't expose it.
        } catch (err) {
            console.error("Order creation failed:", err);
            toast.error(
                "An error occurred while creating the order. Please try again.",
            );
        }
    };

    useEffect(() => {
        if (send?.success) {
            toast.success(send.message);
            setTimeout(() => {
                router.back();
                setRedirect(true);
            }, 4500);
        } else if (send && send.message && !send.success) {
            toast.error(send.message);
        }

        if (makeOrderError) {
            toast.error("An error occurred. Please try again.");
        }

        // ✅ reset to prevent retrigger
        return () => {
            setErrorMessage("");
        };
    }, [send, makeOrderError]);

    useEffect(() => {
        setFormData((prev) => ({ ...prev, delivery_address_status: address }));
    }, [address]);

    if (redirect) {
        return <Redirect />;
    }

    // Display shimmer effect while loading
    //   if (runnerloading) {
    //     return (
    //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //         {/* Add shimmer effect to relevant UI elements */}
    //         <ShimmerPlaceholder style={{ height: 200, width: '100%', marginBottom: 10 }} />
    //         <ShimmerPlaceholder style={{ height: 50, width: '80%', marginBottom: 10 }} />
    //         <ShimmerPlaceholder style={{ height: 50, width: '80%' }} />
    //       </View>
    //     );
    //   }

    const amount = Number(formData.estimated_spend_amount || 0);

    return (
        <View className="w-full h-full">
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" >
                <View className="px-4">
                    <View className="my-6">
                        <Text className="text-sm text-slate" style={{fontFamily: 'roboto-medium', textAlign: "justify"}}>
                            Create custom orders by sharing your specific needs with us. We’ll
                             source the items for you and deliver them straight to your doorstep.
                        </Text>
                    </View>
                    <View className="my-5">
                        <BouncyCheckbox
                            isChecked={address}
                            onPress={(text) => {
                                setAddress(text);
                            }}
                            text="Are you sending to a different address?"
                            textStyle={{
                                textDecorationLine: "none",
                                color: COLORS.black,
                                fontWeight: 'bold',
                                marginLeft: -10,
                                fontSize: 13,
                            }}
                            size={20}
                            fillColor={COLORS.primary}
                            iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                            innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                        />
                    </View>
                    {address && (
                        <>
                            <FormInputs
                                title="Recipient's names"
                                placeholder=""
                                handleChangeText={(value) => 
                                    handleChangeText("recipients_full_names", value)
                                }
                                borderStyle="border border-[#E2E8F0]"
                                lines={2}
                                desc="Please ensure that you provide the correct recipient name."
                            />
                            <FormInputs
                                title="Recipient's Number"
                                placeholder=""
                                handleChangeText={(value) => 
                                    handleChangeText("receipients_phone_number", value)
                                }
                                keyboardType='numeric'
                                borderStyle="border border-[#E2E8F0]"
                                lines={1}
                                desc="Please ensure that you provide the correct number."
                            />
                        </>
                    )}
                    <FormInputs
                        title="Preferred  Store(s) (Optional)"
                        handleChangeText={(value) => 
                            handleChangeText("custom_stores", value)
                        }
                        desc="Please let us know which stores we can source your items from (maximum of 2 stores). Example: Shoprite, Pick n Pay."
                        borderStyle="border border-[#E2E8F0]"
                        placeholder=''
                    />
                    <FormInputs
                        title="Est. order amount"
                        placeholder=""
                        handleChangeText={(value) => 
                            handleChangeText("estimated_spend_amount", value)
                        }
                        keyboardType='numeric'
                        borderStyle="border border-[#E2E8F0]"
                        lines={4}
                        desc="Please provide an estimate of how much you expect to spend on this order."
                    />

                    <View className='justify-center items-center'>
                        {amount > 0 && amount < 50 && (
                            <Text className='text-red text-sm mb-4' style={{fontFamily: 'roboto-medium', textAlign: 'justify'}}>
                                Minimum order is K50. Please add items worth K{(50 - amount).toFixed(0)} or more to ensure that this order is accepted.
                            </Text>
                        )}
                    </View>

                    <View className="w-full">
                        <Text
                            className="mb-4 text-sm text-slate"
                            style={{ fontFamily: "roboto-medium", textAlign: "justify" }}
                        >
                            Please enter all the products you would like us to source. 
                            Ensure that you provide accurate and detailed information for 
                            each product. Enter each product in a separate text box to keep everything clear.
                        </Text>
                        {inputs.map((item) => (
                            <View
                                key={item.id}
                                className="flex-row justify-between items-center mb-3"
                            >
                                <View className="mr-1 h-14 px-2 border border-[#E2E8F0] rounded-md" style={{width: '83%'}}>
                                    <TextInput
                                        style={{ fontFamily: "roboto-medium" }}
                                        className="flex-1 font-semibold text-base text-slate"
                                        editable
                                        value={item.value}
                                        placeholder="Add product"
                                        onChangeText={(value) => 
                                            handleInputChange(item.id, value)
                                        }
                                        autoCorrect={false}
                                    />
                                </View>
                                <TouchableOpacity
                                    className="bg-[#E2E8F0] rounded-md h-14 items-center justify-center"
                                    style={{width: '16%'}}
                                    onPress={() => removeInputField(item.id)}
                                >
                                    <Text className="text-sm">❌</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                        <TouchableOpacity
                            onPress={addInputField}
                            className="bg-green2 w-full justify-center items-center p-2 mb-4 rounded-md"
                        >
                        <Text
                            className="text-white text-lg"
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            ➕ Add product
                        </Text>
                        </TouchableOpacity>
                    </View>

                    <DescriptionInput
                        title="Order Notes (Optional)"
                        handleChangeText={(value) => 
                            handleChangeText("order_notes", value)
                        }
                        desc="Any special instructions? (e.g. brand preference, substitutions)"
                        otherStyles="text-base"
                        borderStyle="border border-[#E2E8F0] rounded-md"
                        lines={4}
                    />

                    <View className="w-full">


                        <View className="mb-3">
                            <View>
                                <Text className="text-primary font-bold">NOTE</Text>
                                <Text style={{ fontFamily: "roboto-medium" }} className="text-sm">
                                    A service charge of{" "}
                                <Text className="text-red" style={{textAlign: "justify"}}>{charges?.serviceCharge}%</Text> will be applied.
                                    The delivery fee will be charged separately.
                                </Text>

                                <Text style={{ fontFamily: "roboto-medium", textAlign: "justify" }} className="text-sm mt-2">
                                    The service charge shown is based on your estimated order amount. The final charge
                                    will be adjusted according to the actual amount spent.
                                </Text>

                                <Text className="text-sm mt-2" style={{ fontFamily: "roboto-medium", textAlign: "justify" }}>
                                    For more details, please refer to{" "}
                                    <Text className="text-primary underline">Terms and Conditions</Text>.
                                </Text>
                            </View>
                            <View className='w-full justify-center items-center'>
                                <Text
                                    className="text-red mt-6 text-base"
                                    style={{ fontFamily: "roboto-medium" }}
                                >
                                    <Text className='text-black'>Service Charge ({charges?.serviceCharge}%):{" "}</Text>
                                    K{formData.service_fee}
                                </Text>
                            </View>
                        </View>

                        <View className="w-full">
                            {/* Delivery Options goes here */}
                            {DeliveryOptionList}
                        </View>
                        <View className="my-3">
                            <Text className="text-sm" style={{ fontFamily: "roboto-medium", textAlign: "justify" }}>
                                Please ensure that all the information provided above is accurate to avoid
                                any delays in processing and delivering your order.
                            </Text>
                        </View>
                        <View className="mb-3">
                            <Text
                                style={{ fontFamily: "roboto-bold", textAlign: "justify" }}
                                className="text-slate"
                            >
                                Orders with incomplete or unclear information may be cancelled.
                            </Text>
                        </View>
                        
                        <Text
                            className="text-slate text-sm"
                            style={{ fontFamily: "roboto-medium", textAlign: "justify" }}
                        >
                            By pressing the order button, you agree to the terms and
                            conditions of the Nerands.
                        </Text>
                        <View className="my-5">
                            <BouncyCheckbox
                                isChecked={true}
                                onPress={(text) => { setAgreement(text) }}
                                text="I agree"
                                textStyle={{
                                    textDecorationLine: "none",
                                    color: COLORS.slate,
                                    marginLeft: -10,
                                    fontSize: 13,
                                }}
                                size={20}
                                fillColor={COLORS.primary}
                                iconStyle={{ borderColor: COLORS.primary, borderRadius: 2 }}
                                innerIconStyle={{ borderWidth: 2, borderRadius: 2 }}
                            />
                        </View>
                    </View>
                    {/* <View className='pb-20' /> */}
                    <View className="w-full justify-center items-center my-4">
                        <Text
                            className={`${errorMessage === "Success" ? "text-green2" : "text-red"} text-sm`}
                            style={{ fontFamily: "roboto-medium" }}
                        >
                            {errorMessage === "Success" ? "Please wait..." : errorMessage}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            <View className="px-2">
                <CustomButton
                    title={makeOrderLoading ? "Placing order..." : "Order Now"}
                    handlePress={handleMakeCustomOrder}
                    disabled={makeOrderLoading || !agreement || (amount > 0 && amount < 50)}
                    otherStyles={`bg-primary p-4 ${
                        makeOrderLoading || !agreement || (amount > 0 && amount < 50)
                        ? "opacity-50"
                        : "opacity-100"
                    }`}
                    textStyles="text-2xl"
                />
            </View>
            {makeOrderLoading && (
                <LoadingIndicator loading_text="Placing custom order..." />
            )}
            
            {searchLoading && (
                <LoadingIndicator loading_text="Fetching runner data..." />
            )}
            
            {errorMessage === "Success" && <Redirecting title="Success" />}
            <View className="pb-12" />
        </View>
    );
};

export default CustomOrderScreen;