import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, SectionList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import Headers from '../../../components/Headers'
import { COLORS } from '../../../constants/constants'
import useApi from '../../../hook/useApi'
import { toast } from '../../../utils/toast'

const AddPermissions = () => {
    const params = useLocalSearchParams();
    const {
        user_id,
    } = useSelector((state) => state.auth);
    const {data, isLoading, error, get} = useApi(
        `/businesses/me/permissions`
    );

    const {data: updatePermissions, isLoading: lodaingUpdatePermissions, error: errorUpdatePermissions, post: updatpermissions} = useApi(
        `/businesses/me/permissions/update`
    );

    const {data: getPermissions, isLoading: loadingPermissions, error: permissionsError, get: permissions} = useApi(
        `/businesses/role/permissions/${params?.role_id}`
    );

    useEffect(() => {
        if (params?.role_id) {
            permissions();
        }
    }, [params?.role_id]);

    useEffect(() => {
        get();
    }, []);

    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [selected, setSelected] = useState([]);

    const handleUpdatePermissions = async () => {
        if (!selected || selected.length === 0) {
            toast.error('Please select at least one permission');
            return;
        }

        if (!params?.role_id) {
            toast.error('Role ID is missing');
            return;
        }

        if (!params?.business_id) {
            toast.error('Business ID is missing');
            return;
        }

        try {
            const res = await updatpermissions({
                business_id: params.business_id,
                role_id: params.role_id,
                user_id: user_id,
                permission_ids: selected
            });

            if (!res?.success) {
                toast.error(res?.message || 'Failed to update permissions');
                return;
            }
            toast.success(res?.message || 'Success');
            setSelected([]);
            router.back();

            console.log(res)
        } catch (error) {
            toast.error(error?.message || 'Failed to update permissions');
            return;
        }
    };


    const sections = useMemo(() => {
        const selectedIds = new Set(
            getPermissions?.data?.map(item => item.permission_id)
        );

        const availablePermissions = Object.fromEntries(
            Object.entries(data?.data || {})
                .map(([category, permissions]) => [
                    category,
                    permissions.filter(permission =>
                        !selectedIds.has(permission.id)
                    )
                ])
                .filter(([_, permissions]) => permissions.length > 0)
        );

        return Object.entries(availablePermissions).map(
            ([category, items]) => ({
                title: category,
                data: items,
            })
        );
    }, [data, getPermissions]);

    const allPermissionKeys = sections.flatMap(section =>
        section.data.map(permission => permission.id)
    );

    const toggleAllPermissions = () => {
        if (selected.length === allPermissionKeys.length) {
            setSelected([]);
        } else {
            setSelected(allPermissionKeys);
        }
    };

    const togglePermission = (key) => {
        setSelected((prev) => {
            if (prev.includes(key)) {
                return prev.filter((k) => k !== key);
            } else {
                return [...prev, key];
            }
        });
    };

    const toggleCategoryPermissions = (section) => {
        const keys = section.data.map(item => item.id);

        const allSelected = keys.every(key => selected.includes(key));

        setSelected(prev => {
            if (allSelected) {
                return prev.filter(key => !keys.includes(key));
            }

            return [...new Set([...prev, ...keys])];
        });
    };

    const isCategorySelected = (section) =>
        section.data.every(item => selected.includes(item.id));

    const allSelected =
        allPermissionKeys.length > 0 &&
        selected.length === allPermissionKeys.length;

    return (
        <SafeAreaView className='flex-1 px-3 bg-white justify-between items-center'>
            <Headers header_name={params?.name}
                fontFamily='outfit-medium'
                textStyles='text-2xl'
                icon={<AntDesign name="team" size={21} color={COLORS.primary} />}
                // handlePress={openMenu}
            />

            {(isLoading || loadingPermissions) ? (
                <View className='justify-center items-center flex-1'>
                    <ActivityIndicator size={40} color={COLORS.primary}/>
                    <Text
                        className='text-base text-slate pt-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >Loading permissions, please wait...</Text>
                </View>
            ) : sections ? (
                <>
                    {/* Start Content */}
                    <SectionList
                        sections={sections}
                        keyExtractor={(item) => item.id || item.key}
                        
                        renderSectionHeader={({ section }) => (
                            <TouchableOpacity
                                onPress={() => toggleCategoryPermissions(section)}
                                className='bg-grey_bg flex-row justify-between items-center w-full rounded mb-2 py-1'
                                style={{
                                    marginTop: 20
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: "bold", marginLeft: 8 }}>
                                    {section.title.toUpperCase()}
                                </Text>
                                <MaterialIcons
                                    name={
                                        isCategorySelected(section)
                                            ? "check-box"
                                            : "check-box-outline-blank"
                                    }
                                    color={
                                        isCategorySelected(section)
                                            ? COLORS.primary
                                            : COLORS.slate
                                    }
                                    size={28}
                                />
                            </TouchableOpacity>
                        )}

                        renderItem={({ item }) => (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <TouchableOpacity
                                    onPress={() => togglePermission(item.id)}
                                    style={{ flexDirection: "row", alignItems: "center", paddingBottom: 4 }}
                                >
                                    <MaterialIcons
                                        name="check-box"
                                        name={selected.includes(item.id) ? "check-box" : "check-box-outline-blank"}
                                        size={28}
                                        color={
                                            selected.includes(item.id)
                                                ? COLORS.primary
                                                : COLORS.slate
                                        }
                                    />
                                    <Text style={{ marginLeft: 8, fontFamily: 'roboto-medium' }}>
                                        {item.description}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        ListHeaderComponent={
                            <View className='w-full'>
                                <View
                                    className='flex-row items-center bg-grey_bg rounded px-2 py-1 mt-3'
                                >
                                    <MaterialCommunityIcons
                                        name="shield-account"
                                        size={24}
                                        color={COLORS.extra_blue}
                                    />
                                    <Text
                                        className='text-2xl ml-1'
                                        style={{fontFamily: 'roboto-medium'}}
                                    >Permissions</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={toggleAllPermissions}
                                    className='flex-row justify-end items-center'
                                    style={{ marginTop: 40, marginBottom: -5 }}
                                >
                                    <Text style={{ marginRight: 4, fontFamily: "roboto-medium" }}>
                                        Select All
                                    </Text>
                                    <MaterialIcons
                                        name={allSelected ? "check-box" : "check-box-outline-blank"}
                                        size={28}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        }

                        ListFooterComponent={
                            <View style={{marginBottom: 40}}/>
                        }
                        showsVerticalScrollIndicator={false}
                    />
                        
                    {/* End Content */}
                    <TouchableOpacity
                        className='w-full bg-primary mb-4 rounded justify-center items-center py-3 elevation-sm'
                        onPress={() => handleUpdatePermissions()}
                        disabled={lodaingUpdatePermissions}
                        style={{opacity: lodaingUpdatePermissions ? '0.5' : '0.9'}}
                    >
                        {lodaingUpdatePermissions ? (
                            <ActivityIndicator size={25} color='white'/>
                        ) : (
                            <Text
                                className='text-white text-lg ml-2'
                                style={{fontFamily: 'roboto-medium'}}
                            >Update</Text>
                        )}
                    </TouchableOpacity>
                </>
            ) : (error || permissionsError) ? (
                <View className='justify-center items-center flex-1'>
                    <Text
                        className='text-lg text-red pt-2'
                        style={{fontFamily: 'roboto-medium'}}
                    >{error?.message || 'An error occured, please try again.'}</Text>
                </View>
            ) : null}
        </SafeAreaView>
    )
}

export default AddPermissions