import * as PlacesInterface from "../interface/Places";
import * as FileSystem from "expo-file-system";
import { Dispatch } from "redux";
import { insertPlace, fetchPlaces } from "../helpers/db";
import { SQLResultSet } from "expo-sqlite";

export const addPlace = (title: string, image: string) => {
    return async (dispatch: Dispatch) => {
        const fileName = image.split("/").pop();
        try {
            let newPath = FileSystem.documentDirectory;
            if (newPath === null) {
                throw new Error("Path not found");
            }
            newPath += fileName;
            await FileSystem.moveAsync({
                from: image,
                to: newPath
            });
            const dbResult = await insertPlace(title, newPath, "Dummy address", 15.6, 16.5);
            if (!(dbResult as SQLResultSet).insertId) {
                throw new Error("Error")
            }
            console.log("Db result", (dbResult as SQLResultSet))
            dispatch(addPlaceAction((dbResult as SQLResultSet).insertId, title, newPath));
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}


const addPlaceAction = (id: number, title: string, image: string): PlacesInterface.IAddPlacesAction => {
    return {
        type: PlacesInterface.PlacesTypeEnum.ADD_PLACE,
        payload: {
            id: id,
            title: title,
            image: image
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