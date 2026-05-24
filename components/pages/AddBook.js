import { useState } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, FlatList, TouchableOpacity, Image, Pressable } from "react-native";
import { doc, updateDoc} from 'firebase/firestore';
import { database } from "../../firebase.js";
import { takePhoto, pickImageFromGallery, uploadImage } from '../Camera.js'
import styles from '../../styles/AddBookStyling.js'
import { getAuth } from "firebase/auth";
import { SaveBook } from "../Books.js";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../styles/Colors.js"

export default function AddBook() {

    // SEARCH STATES
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);
    const [noResults, setNoResults] = useState(false)

    // MANUAL MODE
    const [manualMode, setManualMode] = useState(false);

    // BOOK FORM STATES
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [pages, setPages] = useState("")
    const [author, setAuthor] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");

    const API_KEY = "2563cf30fc764102b3862e2cfec6e705";



    // SEARCH BOOKS
    async function searchBooks() {
        try {
            setNoResults(false)
            const response = await fetch(
                `https://api.bigbookapi.com/search-books?query=${search}&api-key=${API_KEY}`
            );

            const data = await response.json();

            const results = data.books?.flat() || []
            const matchingBooks = results.filter(book => 
                book.title?.toLowerCase().includes(search.toLowerCase())
            )
            setBooks(matchingBooks);

            if (matchingBooks.length === 0){
                setNoResults(true)
            } else {
                setNoResults(false)
            }

        } catch (error) {
            console.log(error);
        }
    }

    // SELECT BOOK
    async function selectBook(book) {

        try {
            const response = await fetch (
                 `https://api.bigbookapi.com/${book.id}?api-key=${API_KEY}`
            )

            const data = await response.json()

            setTitle(data.title || "")
            setAuthor(data.authors ?
                book.authors.map(a => a.name).join(", ")
                : ""
            )
            setDescription(data.description || "no description")
            setPages(data.number_of_pages || "")
            setImage(data.image || "")
            setManualMode(true)
        } catch(error){
            console.log(error)
        }
    }

    // RESET BOOK FORM
    function resetBookForm(){
        setTitle("")
        setDescription("")
        setPages("")
        setAuthor("")
        setStartDate("")
        setEndDate("")
        setImage("")
    }

    // SAVE BOOK
    async function saveBook() {
    
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            alert("You have to be logged in to save a book")
            return
        }

        const newBook = {
            title,
            description,
            author,
            pages: Number(pages),
            startDate,
            endDate,
            image: image,
            status: "wantsToRead",
            createdAt: new Date()
        };

        try {

            const savedBookId = await SaveBook(newBook, user.uid)

            if (
                image &&
                (image.startsWith("file://") || image.startsWith("content://"))
                ) {

                    const downloadURL = await uploadImage(image,  `books/${savedBookId}.jpg`)
                    await updateDoc(
                        doc(database, "books", savedBookId),
                        {image: downloadURL}
                    )
                }
            
            setSearch("")
            setBooks([])
        
            resetBookForm()
            setManualMode(false)

        } catch (error) {

            console.log("Error saving book:", error);

        }
    }

      async function saveBookImage(imageUri) {
            try {
                setImage(imageUri)
            } catch (error) {
                console.error("Error saving book image:", error)
            }
        }
    

    return (

         <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}>

            <View>

                {!manualMode ? (

                    <>
                        <Text style={styles.header}>Search for a book</Text>

                        <TextInput
                            placeholder="Search book title..."
                            value={search}
                            onChangeText={setSearch}
                            style={styles.input}
                        />

                        <Pressable style={styles.button} onPress={searchBooks}>
                            <Text style={styles.buttonText}>Search</Text>
                        </Pressable>
                    


                        {noResults && (
                            <View style={{marginTop: 30, alignItems: "center"}}>
                                <Text style={styles.resultInfo}>We couldn't find what you were looking for.{"\n"}Add it manually instead.</Text>
                            </View>
                        )}
                        
                        <FlatList
                            data={books}
                            keyExtractor={(item, index) =>
                                item?.id?.toString() ||
                                item?.isbn13 ||
                                item?.isbn ||
                                index.toString()
                            }
                            style={styles.list}

                            contentContainerStyle={{paddingBottom:200}}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    style={styles.bookItem}
                                    onPress={() => selectBook(item)}
                                >

                                    {item.image ? (
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.searchBookImage}
                                        />
                                    ) : null}

                                    <Text style={styles.bookTitle}>
                                        {item.title}
                                    </Text>

                                    <Text>
                                        {item.authors
                                            ? item.authors.map(a => a.name).join(", ")
                                            : "Unknown author"}
                                    </Text>

                                </TouchableOpacity>
                            )}

                              ListFooterComponent={
                                <View style={{ marginTop: 20, marginBottom: 100 }}>
                                    <Pressable style={styles.button} onPress={() => setManualMode(true)}>
                                        <Text style={styles.buttonText}>Add book manually</Text>
                                    </Pressable>
                                </View>
                                }
                        />
                    </>

                ) : (

                    <ScrollView contentContainerStyle={{paddingBottom: 120}} showsVerticalScrollIndicator={false}>
                        <Text style={styles.header}>Add a new book</Text>

                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.bookImage}
                            />
                        ) : null}
                        <Pressable style={styles.button} onPress={async () => {
                            const imageUri = await takePhoto()
                            if(imageUri) await saveBookImage(imageUri)
                        }}>
                            <Text style={styles.buttonText}>Take photo</Text>
                        </Pressable>
                       
                       <Pressable style={styles.button} onPress={async () => {
                        const imageUri = await pickImageFromGallery()
                        if(imageUri) await saveBookImage(imageUri)
                       }}>
                        <Text style={styles.buttonText}>Pick photo from gallery</Text>
                       </Pressable>
                        
                        <TextInput
                            placeholder="Book title"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Book description"
                            value={description}
                            onChangeText={setDescription}
                            style={[styles.input, styles.descriptionInput]}
                            multiline={true}
                        />

                        <TextInput
                            placeholder="Author"
                            value={author}
                            onChangeText={setAuthor}
                            style={styles.input}
                        />

                        <TextInput 
                            placeholder="Number of pages"
                            value={pages}
                            onChangeText={setPages}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Start date"
                            value={startDate}
                            onChangeText={setStartDate}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="End date"
                            value={endDate}
                            onChangeText={setEndDate}
                            style={styles.input}
                        />

                       <Pressable style={styles.button} onPress={saveBook}>
                            <Text style={styles.buttonText}>Save book</Text>
                       </Pressable>
                       
                       <Pressable style={styles.button} onPress={() => {resetBookForm()
                            setManualMode(false)
                       }}>
                            <Text style={styles.buttonText}>Back to search</Text>
                       </Pressable>
                       
                    </ScrollView>
                )}

            </View>
        </LinearGradient>
        </KeyboardAvoidingView>
    );
}

