// firestoreUtils.js

import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase-config";

///////////////////////////////
// Basic CRUD Operations
///////////////////////////////

// ---------------------------------
// Create Document
// ---------------------------------
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

// ---------------------------------
// Read a Single Document
// ---------------------------------
export const readDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("Document data:", data);
      return data; // Return the document data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    throw error;
  }
};

// ---------------------------------
// Read All Documents in a Collection
// ---------------------------------
export const readAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    console.log("All documents:", documents);
    return documents; // Return the list of documents
  } catch (error) {
    console.error("Error fetching documents: ", error);
    throw error;
  }
};

// ---------------------------------
// Update Document
// ---------------------------------
export const updateDocument = async (collectionName, docId, updatedData) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log("Document updated!");
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

// ---------------------------------
// Delete Document
// ---------------------------------
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log("Document deleted!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

///////////////////////////////
// Querying Documents
///////////////////////////////

// ---------------------------------
// Query Documents with Conditions
// ---------------------------------
export const queryDocuments = async (
  collectionName,
  conditions = [],
  orderByField = null,
  limitNumber = null
) => {
  try {
    let q = collection(db, collectionName);

    // Apply conditions
    if (conditions.length > 0) {
      conditions.forEach((condition) => {
        q = query(q, where(...condition));
      });
    }

    // Apply ordering
    if (orderByField) {
      q = query(q, orderBy(orderByField));
    }

    // Apply limit
    if (limitNumber) {
      q = query(q, limit(limitNumber));
    }

    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });

    console.log("Queried documents:", documents);
    return documents;
  } catch (error) {
    console.error("Error querying documents: ", error);
    throw error;
  }
};

///////////////////////////////
// Real-time Updates (Listeners)
///////////////////////////////

// ---------------------------------
// Listen to Real-time Updates
// ---------------------------------
export const listenToCollection = (
  collectionName,
  callback,
  conditions = []
) => {
  let q = collection(db, collectionName);

  // Apply conditions
  if (conditions.length > 0) {
    conditions.forEach((condition) => {
      q = query(q, where(...condition));
    });
  }

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  });

  return unsubscribe; // Call this function to stop listening
};


///////////////////////////////
// Batch Operations
///////////////////////////////

// ---------------------------------
// Write Batch
// ---------------------------------
export const performBatchWrite = async (operations) => {
  const batch = writeBatch(db);

  operations.forEach((op) => {
    const docRef = doc(db, op.collectionName, op.docId);
    switch (op.type) {
      case "set":
        batch.set(docRef, op.data);
        break;
      case "update":
        batch.update(docRef, op.data);
        break;
      case "delete":
        batch.delete(docRef);
        break;
      default:
        console.error("Unknown batch operation type:", op.type);
    }
  });

  try {
    await batch.commit();
    console.log("Batch write completed!");
  } catch (error) {
    console.error("Error performing batch write:", error);
    throw error;
  }
};

///////////////////////////////
// Transactions
///////////////////////////////

// ---------------------------------
// Run Transaction
// ---------------------------------
export const runTransactionFunction = async (transactionFunction) => {
  try {
    await runTransaction(db, transactionFunction);
    console.log("Transaction successfully committed!");
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw error;
  }
};
