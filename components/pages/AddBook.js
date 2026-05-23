import { useState } from "react";
import { View, Text, TextInput, ScrollView, Button, FlatList, TouchableOpacity, Image } from "react-native";
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../firebase.js';
import { takePhoto, pickImageFromGallery } from '../Camera.js'
import styles from '../../styles/AddBookStyling.js'
import { getAuth } from "firebase/auth";
import { SaveBook } from "../Books.js";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../../styles/Colors.js"

export default function AddBook() {

    // SEARCH STATES
    const [search, setSearch] = useState("");
    const [books, setBooks] = useState([]);

    // MANUAL MODE
    const [manualMode, setManualMode] = useState(false);

    // BOOK FORM STATES
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [author, setAuthor] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [image, setImage] = useState("");

    const API_KEY = "2563cf30fc764102b3862e2cfec6e705";



    // SEARCH BOOKS
    async function searchBooks() {
        try {
            const response = await fetch(
                `https://api.bigbookapi.com/search-books?query=${search}&api-key=${API_KEY}`
            );

            const data = await response.json();

            setBooks(data.books?.flat() || []);

        } catch (error) {
            console.log(error);
        }
    }

    // SELECT BOOK
    function selectBook(book) {

        console.log(book);

        setTitle(book.title || "");

        setAuthor(
            book.authors
                ? book.authors.map(a => a.name).join(", ")
                : ""
        );

        setDescription(
            book.description ||
            book.synopsis ||
            book.overview ||
            "No description available"
        );

        setImage(book.image || "");

        setManualMode(true);
    }

    // RESET BOOK FORM
    function resetBookForm(){
        setTitle("")
        setDescription("")
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
            startDate,
            endDate,
            image,
            status: "wantsToRead",
            createdAt: new Date()
        };

        try {

            await SaveBook(newBook, user.uid)
            setSearch("")
            setBooks([])

            alert("Book saved successfully!")
        
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

                        <Button style={styles.button}
                                title="Search" 
                                onPress={searchBooks} />

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
                                    <Button
                                    title="Add book manually"
                                    onPress={() => setManualMode(true)}
                                    />
                                </View>
                                }
                        />
                    </>

                ) : (

                    <>
                        <Text style={styles.header}>Add a new book</Text>

                        {image ? (
                            <Image
                                source={{ uri: image }}
                                style={styles.bookImage}
                            />
                        ) : null}
                        <Button style={styles.button}
                                title="Take photo" 
                                onPress={async () => {
                                    const imageUri = await takePhoto()
                                    if(imageUri) await saveBookImage(imageUri)}} 
                        />
                        <Button style={styles.button}
                                    title="Pick photo from gallery" 
                                    onPress={async () => {
                                    const imageUri = await pickImageFromGallery()
                                    if(imageUri) await saveBookImage(imageUri)}} 
                        />
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

                        <Button style={styles.button} 
                                title="Save book" onPress={saveBook} />

                        <View style={{ marginTop: 10 }}>
                            <Button style={styles.button}
                                    title="Back to search"
                                    onPress={() => {resetBookForm() 
                                        setManualMode(false)}}
                            />
                        </View>


                    </>
                )}

            </View>
        </LinearGradient>
    );
}

