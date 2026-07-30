export const selectBusiness = state =>
    state.permissions?.business;

export const selectRole = state =>
    state.permissions?.role;

export const selectPermissions = state =>
    state.permissions?.permissions ?? {};


export const hasPermission = (state, permissionKey) => {
    return !!state.permissions?.permissions?.[permissionKey];
};