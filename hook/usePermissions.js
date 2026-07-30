import { useSelector } from 'react-redux';

export const usePermissions = () => {
    const permissions = useSelector(
        state => state.permissions.permissions
    );

    const can = key => !!permissions[key];

    return { can };
};