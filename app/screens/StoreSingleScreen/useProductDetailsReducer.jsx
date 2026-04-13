import { useReducer } from 'react';

const initialState = {
    modalVisible: false,
    quantity: 1,
    selectedExtras: [],
    chiliOption: false,
};

export const ACTIONS = {
    TOGGLE_MODAL: 'TOGGLE_MODAL',
    SET_QUANTITY: 'SET_QUANTITY',
    TOGGLE_EXTRA: 'TOGGLE_EXTRA',
    TOGGLE_CHILI: 'TOGGLE_CHILI',
    RESET: 'RESET',
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.TOGGLE_MODAL:
            return { ...state, modalVisible: !state.modalVisible };
        case ACTIONS.SET_QUANTITY:
            return { ...state, quantity: action.payload };
        case ACTIONS.TOGGLE_EXTRA:
        return {
            ...state,
            selectedExtras: state.selectedExtras.includes(action.payload)
            ? state.selectedExtras.filter(extra => extra !== action.payload)
            : [...state.selectedExtras, action.payload],
        };
        case ACTIONS.TOGGLE_CHILI:
            return { ...state, chiliOption: action.payload };
        case ACTIONS.RESET:
            return initialState;
        default:
        return state;
    }
};

export const useProductDetailsReducer = () => useReducer(reducer, initialState);