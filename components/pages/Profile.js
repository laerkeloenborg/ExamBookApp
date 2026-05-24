import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  Alert,
  ScrollView,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { signOut, getAuth, deleteUser, updateProfile } from "firebase/auth";
import { takePhoto, pickImageFromGallery, uploadImage } from "../Camera.js";
import styles from "../../styles/ProfileStyling.js";
import colors from "../../styles/Colors.js";
import { LinearGradient } from "expo-linear-gradient";
import {
  ReadUserBooks,
  DeleteBook,
  UpdateBook,
  BookSection,
} from "../Books.js";
import UserBookSection from "../UserBookSection.js";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { database } from "../../firebase.js";
import buttons from "../../styles/Buttons.js";
import EditBookForm from "../EditBookForm.js";
import BookModal from "../BookModal.js";
import ProfileHeader from "../ProfileHeader.js";
import DoneReadingModal from "../DoneReadingModal.js";

export default function Profile({ onLogout }) {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState("");
  const [books, setBooks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookModalVisible, setBookModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [wantsToRead, setWantsToRead] = useState([]);
  const [doneReading, setDoneReading] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [favoriteCharacter, setFavoriteCharacter] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState("");
  const [rating, setRating] = useState(0);
  const [doneReadingModal, setDoneReadingModal] = useState(false);

  // ------------------------------------ USER STUFF --------------------------------------------

  useEffect(() => {
    const auth = getAuth();
    let unsubscribeSnapshot = null;
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (user) {
        setName(user.displayName || "User");
        setMail(user.email || "");
        setImage(user.photoURL || null);

        const q = query(
          collection(database, "books"),
          where("userId", "==", user.uid),
        );

        unsubscribeSnapshot = onSnapshot(
          q,
          (snapshot) => {
            const userBooks = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setBooks(userBooks);

            const wants = userBooks.filter(
              (book) => book.status === "wantsToRead",
            );
            const done = userBooks.filter(
              (book) => book.status === "doneReading",
            );
            const current = userBooks.filter(
              (book) => book.status === "currentlyReading",
            );

            setWantsToRead(wants);
            setDoneReading(done);
            setCurrentlyReading(current);
          },
          (error) => {
            if (error.code !== "permission-denied") {
              console.log(error);
            }
          },
        );
      } else {
        // CLEAR DATA ON LOGOUT
        setBooks([]);
        setWantsToRead([]);
        setDoneReading([]);
        setCurrentlyReading([]);
      }
    });
    return () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }

      unsubscribeAuth();
    };
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
    await signOut(getAuth());
    onLogout();
  }

  async function handleDeleteUser() {
    Alert.alert(
      "Delete account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const user = getAuth().currentUser;

              if (user) {
                await deleteUser(user);
                onLogout();
              }
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  }

  async function saveProfileImage(imageUri) {
    try {
      const user = getAuth().currentUser;

      if (!user) return;

      const downloadURL = await uploadImage(
        imageUri,
        `profile/${user.uid}.jpg`,
      );

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      await user.reload();

      setImage(downloadURL);
      console.log("Profile image saved");
    } catch (error) {
      console.log("Image save error: ", error);
    }
  }

  // --------------------------------------------------  USERS BOOKS ----------------------------------------------------

  const openBookDetails = (book) => {
    setSelectedBook(book);
    setBookModalVisible(true);
    setEditMode(false);
  };

  function openDoneReadingModal(book) {
    setSelectedBook(book);

    setFavoriteCharacter(book.favoriteCharacter || "");
    setFavoriteQuote(book.favoriteQuote || "");
    setRating(book.rating || 0);

    setBookModalVisible(false);
    setDoneReadingModal(true);
  }

  async function handleUpdateBook() {
    if (!selectedBook) return;

    try {
      await UpdateBook(selectedBook.id, {
        title: selectedBook.title,
        description: selectedBook.description,
        author: selectedBook.author,
        pages: selectedBook.pages,
        startDate: selectedBook.startDate,
        endDate: selectedBook.endDate,
        image: selectedBook.image,
      });
      /* await loadUserBooks(getAuth().currentUser.uid) */
      setBookModalVisible(false);
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  }

  async function loadUserBooks(uid) {
    try {
      const userBooks = await ReadUserBooks(uid);
      setBooks(userBooks);
      const wants = userBooks.filter((book) => book.status === "wantsToRead");

      const done = userBooks.filter((book) => book.status === "doneReading");

      setWantsToRead(wants);
      setDoneReading(done);
    } catch (error) {
      console.error("Failes to load books:", error);
    }
  }

  async function handleDeleteBook(id) {
    try {
      await DeleteBook(id);
      /*   const auth = getAuth()
              const user = auth.currentUser
              if (user) {
                  await loadUserBooks(user.uid)
              } */
    } catch (error) {
      console.error("Failed to delete book:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <LinearGradient
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* ---------------------------------------- PROFILE HEADER ----------------------------------------------- */}
        <ProfileHeader
          name={name}
          mail={mail}
          image={image}
          setImage={setImage}
          saveProfileImage={saveProfileImage}
          handleDeleteUser={handleDeleteUser}
        />
        {/* ---------------------------------------- MY BOOKS ----------------------------------------------- */}
        <BookModal
          visible={bookModalVisible}
          selectedBook={selectedBook}
          setSelectedBook={setSelectedBook}
          editMode={editMode}
          setEditMode={setEditMode}
          onClose={() => setBookModalVisible(false)}
          onDelete={handleDeleteBook}
          onUpdate={handleUpdateBook}
          onDoneReading={openDoneReadingModal}
        />
        {/* ---------------------------------------- Done reading review ----------------------------------------------- */}
        <DoneReadingModal
          visible={doneReadingModal}
          selectedBook={selectedBook}
          favoriteCharacter={favoriteCharacter}
          setFavoriteCharacter={setFavoriteCharacter}
          favoriteQuote={favoriteQuote}
          setFavoriteQuote={setFavoriteQuote}
          rating={rating}
          setRating={setRating}
          onClose={() => setDoneReadingModal(false)}
          onFinish={() => {
            setDoneReadingModal(false);
            setBookModalVisible(false);
          }}
        />
        {/* ---------------------------------------- Book sections ----------------------------------------------- */}
        <UserBookSection
          style={styles.currently}
          title="Currently Reading"
          books={currentlyReading}
          onDelete={handleDeleteBook}
          onPressBook={openBookDetails}
          onDoneReading={(book) => {
            openDoneReadingModal(book);
          }}
        />

        <UserBookSection
          title="Wants To Read"
          books={wantsToRead}
          onDelete={handleDeleteBook}
          onPressBook={openBookDetails}
          onDoneReading={(book) => {
            openDoneReadingModal(book);
          }}
        />
        <UserBookSection
          title="Done Reading"
          books={doneReading}
          onDelete={handleDeleteBook}
          onPressBook={openBookDetails}
          onDoneReading={() => {}}
        />

        {/* ---------------------------------------- LOG OUT BUTTON ----------------------------------------------- */}
        <Pressable style={buttons.buttonForm} onPress={logout}>
          <Text style={buttons.buttonText}>Logout</Text>
        </Pressable>
      </LinearGradient>
    </ScrollView>
  );
}
