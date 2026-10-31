import type { Piece } from '../types'
import type { ContrastResult } from './contrast'

const DB_NAME = 'trama-sustentavel'
/** Versão 2: adiciona o espaço "profile" (resultado do contraste). As peças já salvas continuam. */
const DB_VERSION = 2
const PIECES = 'pieces'
const PROFILE = 'profile'
const CONTRAST_KEY = 'contrast'

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

export async function getContrastResult(): Promise<ContrastResult | null> {
  const result = await read<ContrastResult | undefined>(PROFILE, (store) => store.get(CONTRAST_KEY))
  return result ?? null
}

export function saveContrastResult(result: ContrastResult): Promise<void> {
  return write(PROFILE, (store) => {
    store.put(result, CONTRAST_KEY)
  })
}

export function deleteContrastResult(): Promise<void> {
  return write(PROFILE, (store) => {
    store.delete(CONTRAST_KEY)
  })
}
