import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
  onSnapshot
} from "firebase/firestore";
import jsonConfig from "../../firebase-applet-config.json";
import { UserProfile, QuizAttempt } from "../types";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || jsonConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || jsonConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || jsonConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || jsonConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || jsonConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || jsonConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || jsonConfig.measurementId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || jsonConfig.firestoreDatabaseId
};

// 1. Initialize Firebase App and Services
export const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider options for seamless SSO
googleProvider.setCustomParameters({
  prompt: "select_account"
});

// 2. Standardized Error Handling Pattern
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | null;
    email: string | null;
    emailVerified: boolean | null;
    isAnonymous: boolean | null;
    tenantId: string | null;
    providerData: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      phoneNumber: string | null;
      photoURL: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const currentUser = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: currentUser?.uid || null,
      email: currentUser?.email || null,
      emailVerified: currentUser?.emailVerified || null,
      isAnonymous: currentUser?.isAnonymous || null,
      tenantId: currentUser?.tenantId || null,
      providerData: (currentUser?.providerData || []).map((provider) => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        phoneNumber: provider.phoneNumber,
        photoURL: provider.photoURL,
      })),
    },
  };
  console.error("[Firestore Error Diagnostic]", errorInfo);
  throw new Error(JSON.stringify(errorInfo));
}

// 3. Database Connection Testing
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("permission-denied") ||
        error.message.includes("insufficient permissions"))
    ) {
      // Expected if rules restrict access; backend connection is proven live
      return true;
    } else {
      console.warn("Firestore connection check notice:", error);
      // Even if network glitches initially, return false without crashing
      return false;
    }
  }
}

// 4. Firestore Document Operations
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  const path = `users/${profile.id}`;
  try {
    const userRef = doc(db, "users", profile.id);
    const sanitizedData = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(userRef, sanitizedData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, "users", userId);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function saveQuizAttemptToFirestore(attempt: QuizAttempt): Promise<void> {
  const path = `quizAttempts/${attempt.id}`;
  try {
    const attemptRef = doc(db, "quizAttempts", attempt.id);
    await setDoc(attemptRef, {
      ...attempt,
      completedAt: attempt.completedAt || new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function fetchUserQuizAttemptsFromFirestore(userId: string): Promise<QuizAttempt[]> {
  const path = `quizAttempts`;
  try {
    const q = query(collection(db, "quizAttempts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const results: QuizAttempt[] = [];
    querySnapshot.forEach((docSnap) => {
      results.push(docSnap.data() as QuizAttempt);
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function saveCourseEnrollmentToFirestore(enrollment: {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  status: "enrolled" | "in-progress" | "completed";
  progress: number;
}): Promise<void> {
  const path = `courseEnrollments/${enrollment.id}`;
  try {
    const ref = doc(db, "courseEnrollments", enrollment.id);
    await setDoc(ref, {
      ...enrollment,
      updatedAt: new Date().toISOString(),
      enrolledAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchUserCourseEnrollmentsFromFirestore(userId: string) {
  const path = `courseEnrollments`;
  try {
    const q = query(collection(db, "courseEnrollments"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const items: any[] = [];
    querySnapshot.forEach((docSnap) => items.push(docSnap.data()));
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export async function createPeerCircleInFirestore(circle: {
  id: string;
  title: string;
  domain: string;
  description: string;
  creatorId: string;
  membersCount?: number;
}): Promise<void> {
  const path = `peerCircles/${circle.id}`;
  try {
    const ref = doc(db, "peerCircles", circle.id);
    await setDoc(ref, {
      ...circle,
      membersCount: circle.membersCount || 1,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function fetchPeerCirclesFromFirestore() {
  const path = `peerCircles`;
  try {
    const querySnapshot = await getDocs(collection(db, "peerCircles"));
    const items: any[] = [];
    querySnapshot.forEach((docSnap) => items.push(docSnap.data()));
    return items;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot
};
export type { FirebaseUser };
