import * as PlacesInterface from "../interface/Places";

export class Places implements PlacesInterface.IPlaces {
    id: number;
    title: string;
    image: string

    constructor(id: number, title: string, image: string) {
        this.id = id;
        this.title = title;
        this.image = image;
    }
}