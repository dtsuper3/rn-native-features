import { createStore, combineReducers, applyMiddleware } from "redux";
import { PlacesReducer } from "./places-reducer";
import thunk from "redux-thunk";

const RootReducer = combineReducers({
    places: PlacesReducer
})

export type RootState = ReturnType<typeof RootReducer>;

export const store = createStore(RootReducer, applyMiddleware(thunk));