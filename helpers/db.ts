import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("places.db");

export const init = (): Promise<SQLite.SQLResultSet | SQLite.SQLError> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, image TEXT NOT NULL, address TEXT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL);",
                [],
                () => {
                    resolve();
                },
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
        });
    })
};

export const insertPlace = (title: string, image: string, address: string, latitude: number, longitude: number): Promise<SQLite.SQLResultSet | SQLite.SQLError> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO places (title, image,address,latitude,longitude) VALUES (?,?,?,?,?)",
                [title, image, address, latitude, longitude],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
        });
    })
}

export const fetchPlaces = (): Promise<SQLite.SQLResultSet | SQLite.SQLError> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM places",
                [],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
        });
    })
}

export const deletePlaceById = (id: number): Promise<SQLite.SQLResultSet | SQLite.SQLError> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM places WHERE id = ?",
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
        });
    })
}

export const updatePlace = (title: string, image: string, address: string, latitude: number, longitude: number, id: number): Promise<SQLite.SQLResultSet | SQLite.SQLError> => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `UPDATE places SET title = ? , image = ?, address = ?, latitude = ?, longitude = ? WHERE id = ?`,
                [title, image, address, latitude, longitude, id],
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
        });
    })
}