/** Options sent for a removal operation */
interface RemoveOptions {
  multi?: boolean;
}

/** Resulting data from an update operation */
interface UpdateResult {
  update_count: number;
  upsert: boolean;
}

/** Nosql data store */
export interface Datastore<T> {
  /** Find documents in the store */
  find(query: unknown): Promise<T[]>;

  /** Insert new documents into the store */
  insert(docs: T[]): Promise<T[]>;

  /** Update documents in the store */
  update(
    query: unknown,
    update: unknown,
    options: unknown
  ): Promise<UpdateResult>;

  /** Remove documents from the store */
  remove(query: unknown, options?: RemoveOptions);
}
