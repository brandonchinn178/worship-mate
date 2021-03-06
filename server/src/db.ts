import * as _ from 'lodash'
import { Database, sql } from 'pg-fusion'

import { env } from '~/env'

const { NODE_ENV, DATABASE_URL } = env

export const DB_NAME =
  NODE_ENV === 'test' ? 'worship_mate_test' : 'worship_mate'

export const initDatabase = async () => {
  await createTestDatabase()

  const connOptions = DATABASE_URL
    ? { connectionString: DATABASE_URL }
    : { database: DB_NAME }

  return new Database(connOptions)
}

export const withDatabase = async <T>(
  callback: (db: Database) => Promise<T>,
): Promise<T> => {
  const db = await initDatabase()
  try {
    return await callback(db)
  } finally {
    await db.close()
  }
}

/**
 * Manage the databases in the PostgreSQL server. Useful for testing.
 */
const withAdminDatabase = async <T>(
  callback: (db: Database) => Promise<T>,
): Promise<T> => {
  const db = new Database({ database: 'postgres' })
  try {
    return await callback(db)
  } finally {
    await db.close()
  }
}

/**
 * Create the test database if it doesn't already exist.
 */
export const createTestDatabase = async () => {
  if (NODE_ENV !== 'test') {
    return
  }

  await withAdminDatabase(async (admin) => {
    const databases = await admin.query(sql`SELECT datname FROM pg_database`)

    if (!_(databases).map('datname').includes(DB_NAME)) {
      await admin.query(sql`CREATE DATABASE ${sql.quote(DB_NAME)}`)
    }
  })
}

/**
 * Drop the test database if it exists.
 */
export const dropTestDatabase = async () => {
  if (NODE_ENV !== 'test') {
    return
  }

  await withAdminDatabase(async (admin) => {
    await admin.query(sql`DROP DATABASE IF EXISTS ${sql.quote(DB_NAME)}`)
  })
}
