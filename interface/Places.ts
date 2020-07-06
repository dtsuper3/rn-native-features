export interface ICords {
    latitude: number;
    longitude: number;
}

export interface IPlaces {
    id: number;
    title: string;
    image: string;
    address: string;
    latitude: number;
    longitude: number;
}

export interface IPlacesReducer {
    places: IPlaces[];
}

export enum PlacesTypeEnum {
    ADD_PLACE = "ADD_PLACE",
    FETCH_PLACES = "FETCH_PLACES"
}

export interface IAddPlacesAction {
    type: PlacesTypeEnum.ADD_PLACE;
    payload: IPlaces;
}

export interface IFetchPlacesAction {
    type: PlacesTypeEnum.FETCH_PLACES;
    payload: IPlaces[];
}



export type IPlacesAction = IAddPlacesAction | IFetchPlacesAction;