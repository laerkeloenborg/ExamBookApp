import { View, Text, Image, Pressable, Modal, Alert, FlatList, TextInput, TouchableOpacity } from "react-native"
import { useState, useEffect } from "react"
import { signOut, getAuth, deleteUser, updateProfile } from "firebase/auth"
import { takePhoto, pickImageFromGallery } from "../Camera.js"
import styles from "../../styles/ProfileStyling.js"
import colors from "../../styles/Colors.js"
import { LinearGradient } from "expo-linear-gradient"
import { ReadUserBooks, DeleteBook, UpdateBook, BookSection } from "../Books.js"
import UserBookSection from "../UserBookSection.js"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { database } from "../../firebase.js"


export default function Profile({ onLogout }) {
    const [name, setName] = useState("")
    const [mail, setMail] = useState("")
    const [image, setImage] = useState("")
    const [books, setBooks] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [bookModalVisible, setBookModalVisible] = useState(false)
    const [selectedBook, setSelectedBook] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [wantsToRead, setWantsToRead] = useState([])
    const [doneReading, setDoneReading] = useState([])
    const [currentlyReading, setCurrentlyReading] = useState([])


    // ------------------------------------ USER STUFF --------------------------------------------


    useEffect(() => {
        const auth = getAuth();
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                setName(user.displayName || "User")
                setMail(user.email || "")
                setImage(user.photoURL || null)

                // 👇 REALTIME LISTENER - opdaterer automatisk
                const q = query(
                    collection(database, "books"),
                    where("userId", "==", user.uid)
                );

                return onSnapshot(q, (snapshot) => {
                    const userBooks = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setBooks(userBooks);

                    // Filtrer bøgerne
                    const wants = userBooks.filter(book => book.status === "wantsToRead");
                    const done = userBooks.filter(book => book.status === "doneReading");
                    const current = userBooks.filter(book => book.status === "currentlyReading");

                    setWantsToRead(wants);
                    setDoneReading(done);
                    setCurrentlyReading(current);
                });
            }
        });
        return () => unsubscribeAuth();
    }, []);

    /* useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setName(user.displayName || "User")
                setMail(user.email || "")
                setImage(user.photoURL || null)
                await loadUserBooks(user.uid)
            }
        })
        return () => unsubscribe()
    }, []) */


    async function logout() {
        await signOut(getAuth())
        onLogout()
    }

    async function handleDeleteUser() {
        Alert.alert("Delete account", "Are you sure you want to delete your account?",
            [{
                text: "Cancel",
                style: "cancel"
            }, {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const user = getAuth().currentUser

                        if (user) {
                            await deleteUser(user)
                            onLogout()
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            }]
        )
    }

    async function saveProfileImage(imageUri) {
        try {
            const user = getAuth().currentUser

            if (user) {
                await updateProfile(user, {
                    photoURL: imageUri
                })
                setImage(imageUri)
            }
        } catch (error) {
            console.log("Image save error: ", error)
        }
    }

    // --------------------------------------------------  USERS BOOKS ----------------------------------------------------

    const openBookDetails = (book) => {
        setSelectedBook(book)
        setBookModalVisible(true)
        setEditMode(false)
    }


    async function handleUpdateBook() {
        if (!selectedBook) return

        try {
            await UpdateBook(selectedBook.id, {
                title: selectedBook.title,
                description: selectedBook.description,
                author: selectedBook.author,
                startDate: selectedBook.startDate,
                endDate: selectedBook.endDate,
                image: selectedBook.image
            })
            /* await loadUserBooks(getAuth().currentUser.uid) */
            setBookModalVisible(false)
        } catch (error) {
            console.error("Failed to update book:", error)
        }
    }


    async function loadUserBooks(uid) {

        try {
            const userBooks = await ReadUserBooks(uid)
            setBooks(userBooks)
            const wants = userBooks.filter(
                book => book.status === "wantsToRead"
            )

            const done = userBooks.filter(
                book => book.status === "doneReading"
            )

            setWantsToRead(wants)
            setDoneReading(done)


        } catch (error) {
            console.error("Failes to load books:", error)
        }
    }


    async function handleDeleteBook(id) {
        try {
            await DeleteBook(id)
            /*   const auth = getAuth()
              const user = auth.currentUser
              if (user) {
                  await loadUserBooks(user.uid)
              } */
        } catch (error) {
            console.error("Failed to delete book:", error)
        }
    }




    return (
        <LinearGradient
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >


            {/* ---------------------------------------- PROFILE HEADER ----------------------------------------------- */}
            <View style={styles.header}>
                <Text style={styles.title}>{name}'s bookshelf</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Image source={{ uri: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={styles.profileImage} />
                </Pressable>
            </View>


            <Modal visible={modalVisible}>
                <LinearGradient
                    colors={colors.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.container}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Profile settings</Text>
                            <Image source={{ uri: image || "https://cdn-icons-png.flaticon.com/512/149/149071.png" }} style={styles.largeProfileImage} />

                            <Pressable style={styles.modalButton} onPress={async () => {
                                const imageUri = await pickImageFromGallery(setImage)

                                if (imageUri) {
                                    saveProfileImage(imageUri)
                                }
                            }}>
                                <Text style={styles.buttonText}>Choose from gallery</Text>
                            </Pressable>

                            <Pressable style={styles.modalButton} onPress={async () => {
                                const imageUri = await takePhoto()

                                if (imageUri) {
                                    saveProfileImage(imageUri)
                                }
                            }}>
                                <Text style={styles.buttonText}>Take photo</Text>
                            </Pressable>

                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{name}</Text>
                                <Text style={styles.userMail}>{mail}</Text>
                            </View>

                            <Pressable style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteUser}>
                                <Text style={styles.buttonText}>Delete user</Text>
                            </Pressable>

                            <Pressable style={styles.modalButton} onPress={() => { setModalVisible(false) }}>
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </Modal>


            {/* ---------------------------------------- MY BOOKS ----------------------------------------------- */}


            <Modal
                visible={bookModalVisible}
                animationType="slide"
                transparent={true}
            >

                <View style={styles.modalContainer}>

                    <View style={styles.bookModalContent}>

                        {selectedBook && (

                            <>
                                <Image
                                    source={{
                                        uri: selectedBook.image || "https://via.placeholder.com/100"
                                    }}
                                    style={styles.modalBookImage}
                                />

                                <Text style={styles.modalBookTitle}>
                                    {selectedBook.title}
                                </Text>

                                <Text style={styles.modalBookAuthor}>
                                    {selectedBook.author}
                                </Text>

                                <Text style={styles.modalBookDescription}>
                                    {selectedBook.description}
                                </Text>

                                {selectedBook.startDate && (
                                    <Text style={styles.bookDate}>
                                        Started: {selectedBook.startDate}
                                    </Text>
                                )}

                                {selectedBook.endDate && (
                                    <Text style={styles.bookDate}>
                                        Finished: {selectedBook.endDate}
                                    </Text>
                                )}

                                {/* DONE BUTTON */}

                                {selectedBook.status !== "doneReading" && (

                                    <Pressable
                                        style={styles.statusButton}
                                        onPress={async () => {

                                            await UpdateBook(selectedBook.id, {
                                                status: "doneReading",
                                                endDate: new Date().toLocaleDateString()
                                            })

                                            const user = getAuth().currentUser

                                            if (user) {
                                                await loadUserBooks(user.uid)
                                            }

                                            setBookModalVisible(false)
                                        }}
                                    >

                                        <Text style={styles.buttonText}>
                                            Done Reading
                                        </Text>

                                    </Pressable>
                                )}

                                 {/* currently reading BUTTON */}

                                {selectedBook.status !== "currentlyReading" && (
                                    <Pressable
                                        style={styles.statusButton}
                                        onPress={async () => {
                                            await UpdateBook(selectedBook.id, {
                                                status: "currentlyReading",
                                                startDate: new Date().toLocaleDateString()
                                            })
                                            setBookModalVisible(false)
                                        }}
                                    >
                                        <Text style={styles.buttonText}>Currently Reading</Text>
                                    </Pressable>
                                )}

                                {/* DELETE BUTTON */}

                                <Pressable
                                    style={styles.deleteButton}
                                    onPress={async () => {

                                        await handleDeleteBook(selectedBook.id)

                                        setBookModalVisible(false)
                                    }}
                                >

                                    <Text style={styles.buttonText}>
                                        Delete Book
                                    </Text>

                                </Pressable>

                                {/* CLOSE */}

                                <Pressable
                                    style={styles.modalButton}
                                    onPress={() => setBookModalVisible(false)}
                                >

                                    <Text style={styles.buttonText}>
                                        Close
                                    </Text>

                                </Pressable>
                            </>
                        )}

                    </View>

                </View>

            </Modal>

            <UserBookSection style={styles.currently}
                title="Currently Reading"
                books={currentlyReading}
                onDelete={handleDeleteBook}
                onPressBook={openBookDetails}
                onDoneReading={async (book) => {
                    await UpdateBook(book.id, {
                        status: "doneReading",
                        endDate: new Date().toLocaleDateString()
                    })
                }}
            />

            <UserBookSection title="Wants To Read"
                books={wantsToRead}
                onDelete={handleDeleteBook}
                onPressBook={openBookDetails}
                onDoneReading={async (book) => {
                    await UpdateBook(book.id, {
                        status: "doneReading",
                        endDate: new Date().toLocaleDateString()
                    })

                    const user = getAuth().currentUser

                    if (user) {
                        loadUserBooks(user.uid)
                    }
                }}
            />
            <UserBookSection
                title="Done Reading"
                books={doneReading}
                onDelete={handleDeleteBook}
                onPressBook={openBookDetails}
                onDoneReading={() => { }}
            />

            {/* ---------------------------------------- LOG OUT BUTTON ----------------------------------------------- */}
            <Pressable style={styles.logoutButton} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
        </LinearGradient>
    )
} 
