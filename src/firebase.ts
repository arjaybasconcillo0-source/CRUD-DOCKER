import { initializeApp, getApps, getApp } from 'firebase/app';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type Firestore,
  type Unsubscribe,
} from 'firebase/firestore';

// Replace these example values with your Firebase Web App config.
const firebaseConfig = {
  apiKey: "AIzaSyCpvcegS-UY4uLBRdnLN0qRCa0HLREGgQo",
  authDomain: "crud-5fea8.firebaseapp.com",
  projectId: "crud-5fea8",
  storageBucket: "crud-5fea8.firebasestorage.app",
  messagingSenderId: "1024786913244",
  appId: "1:1024786913244:web:a8e9c655712b0b24a22119",
  measurementId: "G-BJXNQ3CQF7"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db: Firestore = getFirestore(app);
export const isFirebaseConfigured =
  Boolean(firebaseConfig.apiKey) &&
  !firebaseConfig.apiKey.startsWith('YOUR_') &&
  Boolean(firebaseConfig.projectId) &&
  !firebaseConfig.projectId.startsWith('YOUR_');

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: string;
  notes: string;
  createdAt?: unknown;
}

const carsCollection = collection(db, 'cars');

export async function createCar(
  car: Omit<Car, 'id' | 'createdAt'>,
): Promise<void> {
  await addDoc(carsCollection, {
    ...car,
    createdAt: serverTimestamp(),
  });
}

export function subscribeToCars(
  callback: (cars: Car[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const carsQuery = query(carsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    carsQuery,
    (snapshot) => {
      const cars = snapshot.docs.map((item) => {
        const data = item.data() as DocumentData;

        return {
          id: item.id,
          brand: data.brand ?? '',
          model: data.model ?? '',
          year: Number(data.year ?? 0),
          color: data.color ?? '',
          type: data.type ?? 'Other',
          notes: data.notes ?? '',
          createdAt: data.createdAt,
        };
      });

      callback(cars);
    },
    (error) => {
      console.error('Firebase subscription error:', error);
      onError?.(error);
    },
  );
}

export async function updateCar(
  id: string,
  changes: Partial<Omit<Car, 'id' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(doc(db, 'cars', id), changes);
}

export async function removeCar(id: string): Promise<void> {
  await deleteDoc(doc(db, 'cars', id));
}