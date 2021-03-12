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
      db.find(query, (err, docs) => {
        if (err) {
          reject(err);
        }

        resolve(docs);
      });
    }),

  insert: (docs) =>
    new Promise((resolve, reject) => {
      db.insert(docs, (err, docs) => {
        if (err) {
          reject(err);
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
        (err, numberOfUpdated, _affectedDocuments, upsert) => {
          if (err) {
            reject(err);
          }

          resolve({ update_count: numberOfUpdated, upsert });
        }
      );
    }),

  remove: (query, options) =>
    new Promise((resolve, reject) => {
      db.remove(query, options, (err, number) => {
        if (err) {
          reject(err);
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
