import { useReducer } from 'react';

const initialState = {
    modalVisible: false,
    quantity: 1,
    selectedExtras: [],
};

export const ACTIONS = {
    TOGGLE_MODAL: 'TOGGLE_MODAL',
    SET_QUANTITY: 'SET_QUANTITY',
    TOGGLE_EXTRA: 'TOGGLE_EXTRA',
    RESET: 'RESET',
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.TOGGLE_MODAL:
            return { ...state, modalVisible: !state.modalVisible };
        case ACTIONS.SET_QUANTITY:
            return { ...state, quantity: action.payload };
        case ACTIONS.TOGGLE_EXTRA: {
            const id = action.payload;

            const exists = state.selectedExtras.includes(id);

            return {
                ...state,
                selectedExtras: exists
                ? state.selectedExtras.filter(i => i !== id)
                : [...state.selectedExtras, id],
            };
        }
        case ACTIONS.RESET:
            return initialState;
        default:
        return state;
    }
};

export const useProductDetailsReducer = () => useReducer(reducer, initialState);