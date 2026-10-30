import type { Piece } from '../types'

const DB_NAME = 'trama-sustentavel'
const DB_VERSION = 1
const STORE = 'pieces'

let dbPromise: Promise<IDBDatabase> | null = null

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE, { keyPath: 'id' })
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

async function write(run: (store: IDBObjectStore) => void): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE, 'readwrite')
    run(transaction.objectStore(STORE))
    transaction.oncomplete = () => resolve()
    transaction.onerror = () => reject(transaction.error)
    transaction.onabort = () => reject(transaction.error)
  })
}

export async function getAllPieces(): Promise<Piece[]> {
  const db = await openDb()
  const pieces = await new Promise<Piece[]>((resolve, reject) => {
    const request = db.transaction(STORE, 'readonly').objectStore(STORE).getAll()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
  return pieces.sort((a, b) => b.createdAt - a.createdAt)
}

export function savePiece(piece: Piece): Promise<void> {
  return write((store) => {
    store.put(piece)
  })
}

export function deletePiece(id: string): Promise<void> {
  return write((store) => {
    store.delete(id)
  })
}
