import { database } from '../firebase.js'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, getDoc, query, where } from 'firebase/firestore'


export async function ReadUserBooks(uid) {
    try {
        const booksRef = collection(database, "books")
        const q = query(booksRef, where("userId", "==", uid))
        const querySnapshot = await getDocs(q)
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error("Error reading user books:", error)
        throw error
    }
}

export async function SaveBook(BookData, uid) {
    try {
        const newBook = {
            ...BookData,
            userId: uid,
            createdAt: new Date()
        }
        const docRef = await addDoc(collection(database, "books"), newBook)
        return docRef.id
    } catch (error) {
        console.error("Error saving book:", error)
        throw error
    }
}

export async function ReadBook(id) {
    try{ 
        const bookRef = doc(database, 'books', id)
        const bookSnap = await getDoc(bookRef)


        if (bookSnap.exists()) {
            return { id: bookSnap.id, ...bookSnap.data() }
        } else {
            console.log("No book found with ID:", id)
            return null;
        }
    }  catch (error) {
        console.error("Error reading book:", error)
        throw error
    }
}


export async function ReadBooks() {
  
}


export async function DeleteBook(id) {
  try {
    await deleteDoc(doc(database, "books", id));
    console.log("Book deleted successfully!");
  } catch (error) {
    console.error("Error deleting book:", error);
    throw error;
  }
}

export async function UpdateBook(id, updatedData) {
  try {
    await updateDoc(doc(database, "books", id), updatedData);
    console.log("Book updated successfully!");
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}

