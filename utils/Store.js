import { createContext, useReducer } from "react";

import Cookies from "js-cookie"

export const Store = createContext();



const initialState = {
    
    // cart: localStorage.getItem("cart")
    //     ? JSON.parse(localStorage.getItem("cart"))
    //     : { cartItems: [] },
    cart: Cookies.get("cart")
        ? JSON.parse(Cookies.get("cart"))
        : { cartItems: [], shippingAddress:{} },
    
};

function reducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM_TO_CART': {
            const newItem = action.payload;

            const existItem = state.cart.cartItems.find(item => item.slug === newItem.slug);

            const cartItems = existItem ? state.cart.cartItems.map(item => item.name === existItem.name ? newItem : item) : [...state.cart.cartItems, newItem];

            // localStorage.setItem(
            //     "cart",
            //     JSON.stringify({ ...state.cart, cartItems })
            // );

            Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

            return { ...state, cart: { ...state.cart, cartItems } };
        }
            
        case 'REMOVE_ITEM_FROM_CART': {
            const cartItems = state.cart.cartItems.filter(item => item.slug !== action.payload.slug);

            // localStorage.setItem(
            //     "cart",
            //     JSON.stringify({ ...state.cart, cartItems })
            // );

            Cookies.set("cart", JSON.stringify({ ...state.cart, cartItems }));

            return { ...state, cart: { ...state.cart, cartItems } };
            }
    
        case 'RESET_CART': {
            Cookies.remove("cart");
            return {
                ...state,
                cartItems: [],
                shippingAddress: { location: {} },
                paymentMethod:""
            }
        }
        case 'SAVE_SHIPPING_ADDRESS': {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress:{
                    ...state.cart.shippingAddress,
                    ...action.payload}
                }
            }
            }
        default:
            return state;
    }
}

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = { state, dispatch };

    return (<Store.Provider value={value}>
        {children}
    </Store.Provider>)
}