"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initDB } from "@/lib/db";

type dataProfile = {
    fecha: number | null,
    image: null | Blob,
    pub: null | string,
    user_id: string,
    id?: number
}
type DBContextType = {
    ready: boolean;
    add: (store: string, data: dataProfile) => Promise<IDBValidKey>;
    update: (store: string, id: IDBValidKey, data: dataProfile) => Promise<void>;
    remove: (store: string, id: IDBValidKey) => Promise<void>;
    get: (store: string, id: IDBValidKey) => Promise<dataProfile>;
    getAll: (store: string) => Promise<dataProfile[]>;
    getByPub: (store: string, pubValue: string) => Promise<dataProfile>;
    getByUser: (store: string, user_id: string) => Promise<dataProfile>;
};

const DBContext = createContext<DBContextType | null>(null);

export const useDB = () => {
    const ctx = useContext(DBContext);
    if (!ctx) throw new Error("useDB must be used inside IndexedDBProvider");
    return ctx;
};
interface IndexedDBProviderProps {
    dbname: string;
    tablename: string;
    children: React.ReactNode;
}
export const IndexedDBProvider: React.FC<IndexedDBProviderProps> = ({ dbname, tablename, children }) => {
    const [db, setDb] = useState<IDBDatabase | null>(null);

    useEffect(() => {
        initDB({ dbname, table: tablename })
            .then((dbInstance) => {
                setDb(dbInstance as IDBDatabase);
                console.info("IndexedDB initialized:", dbname, tablename);
            })
            .catch(console.error);
    }, []);

    // Helpers para transacciones
    const transaction = (store: string, mode: IDBTransactionMode) => {
        if (!db) throw new Error("DB not initialized");
        return db.transaction(store, mode).objectStore(store);
    };

    const api: DBContextType = {
        ready: !!db,
        add: async (store, data) =>
            new Promise((resolve, reject) => {
                const req = transaction(store, "readwrite").add(data);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }),

        update: async (store, id, data) =>
            new Promise((resolve, reject) => {
                const req = transaction(store, "readwrite").put({ ...data, id });
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            }),

        remove: async (store, id) =>
            new Promise((resolve, reject) => {
                const req = transaction(store, "readwrite").delete(id);
                req.onsuccess = () => resolve();
                req.onerror = () => reject(req.error);
            }),

        get: async (store, id) =>
            new Promise((resolve, reject) => {
                const req = transaction(store, "readonly").get(id);
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }),

        getAll: async (store) =>
            new Promise((resolve, reject) => {
                const req = transaction(store, "readonly").getAll();
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => reject(req.error);
            }),
        getByPub: async (store, pubValue: string) =>
            new Promise((resolve, reject) => {
                const index = transaction(store, "readonly").index("pub");
                const req = index.getAll(pubValue); // consulta por valor exacto del índice
                req.onsuccess = () => {
                    const data = req.result[0] ?? null;
                    resolve(data);
                };
                req.onerror = () => reject(req.error);
            }),
            getByUser: async (store, user_id: string) =>
            new Promise((resolve, reject) => {
                const index = transaction(store, "readonly").index("user_id");
                const req = index.getAll(user_id); // consulta por valor exacto del índice
                req.onsuccess = () => {
                    const data = req.result[0] ?? null;
                    resolve(data);
                };
                req.onerror = () => reject(req.error);
            })

    };

    return <DBContext.Provider value={api}>{children}</DBContext.Provider>;
};