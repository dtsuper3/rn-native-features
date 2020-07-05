import * as PlacesInterface from "../interface/Places";
import { Places } from "../models/Places";

const initialState: PlacesInterface.IPlacesReducer = {
    places: []
}

export const PlacesReducer = (state = initialState, action: PlacesInterface.IPlacesAction): PlacesInterface.IPlacesReducer => {
    switch (action.type) {
        case PlacesInterface.PlacesTypeEnum.ADD_PLACE:
            const newPlace: PlacesInterface.IPlaces = new Places(action.payload.id, action.payload.title, action.payload.image);
            return {
                places: state.places.concat(newPlace)
            }
        case PlacesInterface.PlacesTypeEnum.FETCH_PLACES:
            return {
                places: action.payload.map(item => new Places(item.id, item.title, item.image))
            }
        default:
            return state;
    }
}