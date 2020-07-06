import * as PlacesInterface from "../interface/Places";

export class Places implements PlacesInterface.IPlaces {
    id: number;
    title: string;
    image: string;
    address: string;
    latitude: number;
    longitude: number;

    constructor(id: number, title: string, image: string, address: string, latitude: number, longitude: number) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude
    }
}