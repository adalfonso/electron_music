import Nedb from "nedb";
import path from "path";
import { Datastore } from "./Datastore";
import { remote } from "electron";

/**
 * Async abstraction over Nedb datastore
 *
 * @param db - Nedb instance
 *
 * @return datastore
 */
const createAsyncNedb = <T>(db: Nedb): Datastore<T> => ({
  find: (query) =>
    new Promise((resolve, reject) => {
      db.find(query, (error, docs) => {
        if (error) {
          reject(error);
        }

        resolve(docs);
      });
    }),

  insert: (docs) =>
    new Promise((resolve, reject) => {
      db.insert(docs, (error, docs) => {
        if (error) {
          reject(error);
        }

        resolve(docs);
      });
    }),

  update: (query, update, options) =>
    new Promise((resolve, reject) => {
      db.update(
        query,
        update,
        options,
        (error, numberOfUpdated, _affectedDocuments, upsert) => {
          if (error) {
            reject(error);
          }

          resolve({ update_count: numberOfUpdated, upsert });
        }
      );
    }),

  remove: (query, options) =>
    new Promise((resolve, reject) => {
      db.remove(query, options, (error, number) => {
        if (error) {
          reject(error);
        }

        resolve(number);
      });
    }),
});

export const asyncDbFactory = <T>(db_name: string) =>
  createAsyncNedb<T>(
    new Nedb({
      autoload: true,
      filename: path.join(remote.app.getPath("userData"), `/${db_name}.db`),
    })
  );
