import Nedb from "nedb";
import path from "path";
import { Datastore } from "./Datastore";
import { remote } from "electron";
import { StandardLogger } from "@/Logger";

/**
 * Async abstraction over Nedb datastore
 *
 * @param db - Nedb instance
 *
 * @return datastore
 */
const createAsyncNedb = <T>(db: Nedb) => (db_name: string) => (
  logger: StandardLogger
): Datastore<T> => ({
  find: query =>
    new Promise((resolve, reject) => {
      logger.info(`Finding documents in: ${db_name}`, { query });

      db.find(query, (error, docs) => {
        if (error) {
          logger.error(`Failed while finding documents in: ${db_name}`, {
            error,
            query,
          });

          reject(error);
        }

        logger.info(`Successfully found documents in: ${db_name}`, {
          docs,
          query,
        });

        resolve(docs);
      });
    }),

  insert: docs =>
    new Promise((resolve, reject) => {
      logger.info(`Inserting documents into: ${db_name}`, { docs });

      db.insert(docs, (error, insert_docs) => {
        if (error) {
          logger.error(`Failed while inserting documents into: ${db_name}`, {
            error,
            docs,
          });

          reject(error);
        }

        logger.info(`Successfully inserted documents into: ${db_name}`, {
          docs,
          insert_docs,
        });

        resolve(insert_docs);
      });
    }),

  update: (query, update, options) =>
    new Promise((resolve, reject) => {
      const context = { query, update, options };

      logger.info(`Updating documents in: ${db_name}`, context);

      db.update(
        query,
        update,
        options,
        (error, number, _affectedDocuments, upsert) => {
          if (error) {
            logger.error(`Failed to update documents in: ${db_name}`, {
              error,
              ...context,
            });

            reject(error);
          }

          logger.info(`Successfully updated documents in: ${db_name}`, {
            number,
            upsert,
            ...context,
          });

          resolve({ update_count: number, upsert });
        }
      );
    }),

  remove: (query, options) =>
    new Promise((resolve, reject) => {
      logger.info(`Removing documents from: ${db_name}`, { query, options });

      db.remove(query, options, (error, number) => {
        if (error) {
          logger.error(`Failed to remove documents from: ${db_name}`, {
            error,
            query,
            options,
          });

          reject(error);
        }

        logger.info(`Successfully removed documents from: ${db_name}`, {
          number,
          query,
          options,
        });

        resolve(number);
      });
    }),
});

export const asyncDbFactory = <T>(db_name: string) => (
  logger: StandardLogger
) =>
  createAsyncNedb<T>(
    new Nedb({
      autoload: true,
      filename: path.join(remote.app.getPath("userData"), `/${db_name}.db`),
    })
  )(db_name)(logger);
