import * as PlacesInterface from "../interface/Places";
import * as FileSystem from "expo-file-system";
import { Dispatch } from "redux";
import { insertPlace, fetchPlaces } from "../helpers/db";
import { SQLResultSet } from "expo-sqlite";
import { ILocation, IReverseGeoLocation } from "../interface/Location";
import { KEYS } from "../constants/Keys";

export const addPlace = (title: string, image: string, location: ILocation) => {
    return async (dispatch: Dispatch) => {
        const res = await fetch(`https://apis.mapmyindia.com/advancedmaps/v1/${KEYS.MAPS_REST_API_KEY}/rev_geocode?lat=${location.latitude}&lng=${location.longitude}`)
        if (!res.ok) {
            throw new Error("Something went wrong!");
        }
        const resData: IReverseGeoLocation = await res.json();
        // console.log("Location:- ", resData);
        if (resData.responseCode !== 200 && !resData.results) {
            throw new Error("Something went wrong!");
        }
        try {
            const fileName = image.split("/").pop();
            const address = resData.results[0].formatted_address;
            let newPath = FileSystem.documentDirectory;
            if (newPath === null) {
                throw new Error("Path not found");
            }
            newPath += fileName;
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            });
            if (location.latitude !== undefined && location.longitude !== undefined) {
                const dbResult = await insertPlace(title, newPath, address, location.latitude, location.longitude);
                if (!(dbResult as SQLResultSet).insertId) {
                    throw new Error("Error")
                }
                // console.log("Db result", (dbResult as SQLResultSet))
                dispatch(addPlaceAction((dbResult as SQLResultSet).insertId, title, newPath, address, { latitude: location.latitude, longitude: location.longitude }));
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}


const addPlaceAction = (id: number, title: string, image: string, address: string, cords: PlacesInterface.ICords): PlacesInterface.IAddPlacesAction => {
    return {
        type: PlacesInterface.PlacesTypeEnum.ADD_PLACE,
        payload: {
            id,
            title,
            image,
            address,
            latitude: cords.latitude,
            longitude: cords.longitude
        }
    }
}

export const fetchPlacesDispatcher = () => {
    return async (dispatch: Dispatch) => {
        try {
            const dbResult = await fetchPlaces();
            console.log("Result ", (dbResult as SQLResultSet).rows)
            if (!(dbResult as SQLResultSet).rows) {
                throw new Error("Not Found")
            }
            const places = ((dbResult as SQLResultSet).rows as any)._array
            dispatch(fetchPlacesAction(places));
        } catch (err) {
            throw err;
        }
    }
}


const fetchPlacesAction = (places: PlacesInterface.IPlaces[]): PlacesInterface.IFetchPlacesAction => {
    return {
        type: PlacesInterface.PlacesTypeEnum.FETCH_PLACES,
        payload: places
    }
}