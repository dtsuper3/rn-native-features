export interface ILocation {
    latitude: undefined | number;
    longitude: undefined | number;
}

export interface IReverseGeoLocation {
    responseCode: number;
    version: string;
    results: ResultsEntity[];
}
export interface ResultsEntity {
    houseNumber: string;
    houseName: string;
    poi: string;
    poi_dist: string;
    street: string;
    street_dist: string;
    subSubLocality: string;
    subLocality: string;
    locality: string;
    village: string;
    district: string;
    subDistrict: string;
    city: string;
    state: string;
    pincode: string;
    lat: string;
    lng: string;
    area: string;
    formatted_address: string;
}
