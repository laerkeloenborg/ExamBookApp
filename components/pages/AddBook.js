import { useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Image } from "react-native";
import { collection, addDoc } from 'firebase/firestore';
import { database } from '../../firebase.js';
import { takePhoto, pickImageFromGallery } from '../Camera.js'
import styles from '../../styles/AddBookStyling.js'

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

    const API_KEY = "0879ee4877534841873a9fe2f248c102";



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

    // SAVE BOOK
    async function saveBook() {

        const newBook = {
            title,
            description,
            author,
            startDate,
            endDate,
            image,
            createdAt: new Date()
        };

        try {

            await addDoc(collection(database, "books"), newBook);

            console.log("Book saved!");

            setTitle("");
            setDescription("");
            setAuthor("");
            setStartDate("");
            setEndDate("");
            setImage("");

            setSearch("");
            setBooks([]);
            setManualMode(false);

        } catch (error) {

            console.log("Error saving book:", error);

        }
    }

    return (

        <View style={styles.container}>

            {!manualMode ? (

                <>
                    <Text style={styles.header}>Search for a book</Text>

                    <TextInput
                        placeholder="Search book title..."
                        value={search}
                        onChangeText={setSearch}
                        style={styles.input}
                    />

                    <Button title="Search" onPress={searchBooks} />

                    <FlatList
                        data={books}
                        keyExtractor={(item, index) =>
                            item?.id?.toString() ||
                            item?.isbn13 ||
                            item?.isbn ||
                            index.toString()
                        }
                        style={styles.list}
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
                    />

                    <Button
                        title="Add book manually"
                        onPress={() => setManualMode(true)}
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
                    <Button title="Take photo" onPress={ () => takePhoto(setImage)} />
                    <Button title="Pick photo from gallery" onPress={ () => pickImageFromGallery(setImage)} />

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
                        style={styles.input}
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

                    <Button title="Save book" onPress={saveBook} />

                    <View style={{ marginTop: 10 }}>
                        <Button
                            title="Back to search"
                            onPress={() => setManualMode(false)}
                        />
                    </View>


                </>
            )}

        </View>
    );
}

