import type { Piece } from '../types'
import type { BodyResult } from './body'
import type { ContrastResult } from './contrast'

const DB_NAME = 'trama-sustentavel'
/** Versão 2: adiciona o espaço "profile" (resultado do contraste). As peças já salvas continuam. */
const DB_VERSION = 2
const PIECES = 'pieces'
const PROFILE = 'profile'
const CONTRAST_KEY = 'contrast'
const BODY_KEY = 'body'

type StoreName = typeof PIECES | typeof PROFILE

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(PIECES)) db.createObjectStore(PIECES, { keyPath: 'id' })
        if (!db.objectStoreNames.contains(PROFILE)) db.createObjectStore(PROFILE)
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => {
        dbPromise = null
        reject(request.error)
      }
    })
  }
  return dbPromise
}

async function write(storeName: StoreName, run: (store: IDBObjectStore) => void): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    run(transaction.objectStore(storeName))
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

async function read<T>(storeName: StoreName, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const request = run(db.transaction(storeName, 'readonly').objectStore(storeName))
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllPieces(): Promise<Piece[]> {
  const pieces = await read<Piece[]>(PIECES, (store) => store.getAll())
  return pieces.sort((a, b) => b.createdAt - a.createdAt)
}

export function savePiece(piece: Piece): Promise<void> {
  return write(PIECES, (store) => {
    store.put(piece)
  })
}

export function deletePiece(id: string): Promise<void> {
  return write(PIECES, (store) => {
    store.delete(id)
  })
}

/** Salva várias peças numa transação só: ou entram todas, ou nenhuma. */
export function savePieces(pieces: Piece[]): Promise<void> {
  return write(PIECES, (store) => {
    pieces.forEach((piece) => store.put(piece))
  })
}

export function deletePieces(ids: string[]): Promise<void> {
  return write(PIECES, (store) => {
    ids.forEach((id) => store.delete(id))
  })
}

async function getProfileItem<T>(key: string): Promise<T | null> {
  const value = await read<T | undefined>(PROFILE, (store) => store.get(key))
  return value ?? null
}

function saveProfileItem<T>(key: string, value: T): Promise<void> {
  return write(PROFILE, (store) => {
    store.put(value, key)
  })
}

function deleteProfileItem(key: string): Promise<void> {
  return write(PROFILE, (store) => {
    store.delete(key)
  })
}

export const getContrastResult = () => getProfileItem<ContrastResult>(CONTRAST_KEY)
export const saveContrastResult = (result: ContrastResult) => saveProfileItem(CONTRAST_KEY, result)
export const deleteContrastResult = () => deleteProfileItem(CONTRAST_KEY)

export const getBodyResult = () => getProfileItem<BodyResult>(BODY_KEY)
export const saveBodyResult = (result: BodyResult) => saveProfileItem(BODY_KEY, result)
export const deleteBodyResult = () => deleteProfileItem(BODY_KEY)
