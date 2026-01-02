export async function initDB({ dbname, table }: { dbname: string, table: string }) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbname, 1);

        request.onerror = () => {
            reject(request.error);
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(table)) {
                const objectStore = db.createObjectStore(table, {
                    keyPath: 'id',
                    autoIncrement: true
                });
                objectStore.createIndex("fecha", "fecha", { unique: false });
                objectStore.createIndex("image", "image", { unique: false });
                objectStore.createIndex("pub", "pub", { unique: false });
                objectStore.createIndex("user_id", "user_id", { unique: false });
            }
        };
    });
}