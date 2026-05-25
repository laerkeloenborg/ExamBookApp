import { database } from '../firebase.js'
import { collection, addDoc, deleteDoc, doc, updateDoc, getDocs, getDoc, query, where } from 'firebase/firestore'

export async function ReadBook(book, setSelectedBook, setModalVisible){
    const API_KEY = "2563cf30fc764102b3862e2cfec6e705"

    const response = await fetch(
        `https://api.bigbookapi.com/${book.id}?api-key=${API_KEY}`
    )

    const data = await response.json()

    const formattedBook = {

        id: data.id || "Unknown id",

        title: data.title || "Unknown title",

        author: data.authors
            ? data.authors.map(a => a.name).join(", ")
            : "Unknown author",

        pages: data.number_of_pages || "",
        
        image: data.image ||

            "https://cdn-icons-png.flaticon.com/512/2232/2232688.png",

        rating: data.rating?.average || "No rating",

        description:
            data.description ||
            "No description available"

    }

    setSelectedBook(formattedBook)
    setModalVisible(true)
}

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
    let dataToUpdate
    if(updatedData.isApiBook){
        dataToUpdate={
            startDate: updatedData.startDate,
            endDate: updatedData.endDate,
        }
    } else {
        dataToUpdate = {
            title: updatedData.title,
            description: updatedData.description,
            author: updatedData.author,
            pages: Number(updatedData.pages),
            startDate: updatedData.startDate,
            endDate: updatedData.endDate,
        }
    }

    await updateDoc(doc(database, "books", id), dataToUpdate);
    console.log("Book updated successfully!");
  } catch (error) {
    console.error("Error updating book:", error);
    throw error;
  }
}

