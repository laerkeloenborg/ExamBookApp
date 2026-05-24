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
import buttons from "../../styles/Buttons.js"

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
    setSelectedBook(book)
    setBookModalVisible(true)
    setEditMode(false)
  };

  function openDoneReadingModal(book) {
    setSelectedBook(book)

    setFavoriteCharacter(book.favoriteCharacter || "");
    setFavoriteQuote(book.favoriteQuote || "");
    setRating(book.rating || 0);

    setBookModalVisible(false)
    setDoneReadingModal(true)
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
        endDate: selectedBook.endDate || new Date().toLocaleDateString(),
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
        <View style={styles.header}>
          <Text style={styles.title}>{name}'s bookshelf</Text>
          <Pressable onPress={() => setModalVisible(true)}>
            <Image
              source={{
                uri:
                  image ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.profileImage}
            />
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
                <Image
                  source={{
                    uri:
                      image ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  }}
                  style={styles.largeProfileImage}
                />

                <Pressable
                  style={buttons.buttonForm}
                  onPress={async () => {
                    const imageUri = await pickImageFromGallery(setImage);

                    if (imageUri) {
                      saveProfileImage(imageUri);
                    }
                  }}
                >
                  <Text style={buttons.buttonText}>Choose from gallery</Text>
                </Pressable>

                <Pressable
                  style={buttons.buttonForm}
                  onPress={async () => {
                    const imageUri = await takePhoto();

                    if (imageUri) {
                      saveProfileImage(imageUri);
                    }
                  }}
                >
                  <Text style={buttons.buttonText}>Take photo</Text>
                </Pressable>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{name}</Text>
                  <Text style={styles.userMail}>{mail}</Text>
                </View>

                <Pressable
                  style={buttons.deleteButton}
                  onPress={handleDeleteUser}
                >
                  <Text style={buttons.buttonText}>Delete user</Text>
                </Pressable>

                <Pressable
                  style={buttons.buttonForm}
                  onPress={() => {
                    setModalVisible(false);
                  }}
                >
                  <Text style={buttons.buttonText}>Close</Text>
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
            <ScrollView contentContainerStyle={styles.bookModalContent} showsVerticalScrollIndicator={false}>
              {selectedBook && (
                <>
                  <Image
                    source={{
                      uri:
                        selectedBook.image || "https://via.placeholder.com/100",
                    }}
                    style={styles.modalBookImage}
                  />

                  <Text style={styles.modalBookTitle}>
                    {selectedBook.title}
                  </Text>

                  <Text style={styles.modalBookAuthor}>
                    Author: {selectedBook.author}
                  </Text>

                  <Text style={styles.modalBookDescription}>
                    {selectedBook.description}
                  </Text>

                  <Text style={styles.modalBookDescription}>
                    Number of pages: {selectedBook.pages}
                  </Text>

                  {selectedBook.status === "doneReading" && (
                    <View style={styles.reviewContainer}>
                      {selectedBook.rating && (
                        <Text style={styles.reviewText}>
                          ⭐ Rating: {selectedBook.rating}/10
                        </Text>
                      )}

                      {selectedBook.favoriteCharacter && (
                        <Text style={styles.reviewText}>
                          Favorite Character: {selectedBook.favoriteCharacter}
                        </Text>
                      )}

                      {selectedBook.favoriteQuote && (
                        <>
                          <Text style={styles.reviewTitle}>Favorite Quote</Text>

                          <Text style={styles.quoteText}>
                            "{selectedBook.favoriteQuote}"
                          </Text>
                        </>
                      )}
                    </View>
                  )}

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
                      style={buttons.buttonForm}
                      onPress={() => openDoneReadingModal(selectedBook)}
                    >
                      <Text style={buttons.buttonText}>Done Reading</Text>
                    </Pressable>
                  )}

                  {/* currently reading BUTTON */}

                  {selectedBook.status !== "currentlyReading" && (
                    <Pressable
                      style={buttons.buttonForm}
                      onPress={async () => {
                        await UpdateBook(selectedBook.id, {
                          status: "currentlyReading",
                          startDate: new Date().toLocaleDateString(),
                        });
                        setBookModalVisible(false);
                      }}
                    >
                      <Text style={buttons.buttonText}>Currently Reading</Text>
                    </Pressable>
                  )}

                  {/* DELETE BUTTON */}

                  <Pressable
                    style={buttons.deleteButton}
                    onPress={async () => {
                      await handleDeleteBook(selectedBook.id);

                      setBookModalVisible(false);
                    }}
                  >
                    <Text style={buttons.buttonText}>Delete Book</Text>
                  </Pressable>

                  {/* CLOSE */}

                  <Pressable
                    style={buttons.buttonForm}
                    onPress={() => setBookModalVisible(false)}
                  >
                    <Text style={buttons.buttonText}>Close</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
        {/* ---------------------------------------- Done reading review ----------------------------------------------- */}
        <Modal
          visible={doneReadingModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.bookModalContent}>
              <Text style={styles.modalTitle}>Finish Book</Text>

              <TextInput
                placeholder="Favorite character"
                value={favoriteCharacter}
                onChangeText={setFavoriteCharacter}
                style={styles.reviewInput}
              />

              <TextInput
                placeholder="Favorite quote"
                value={favoriteQuote}
                onChangeText={setFavoriteQuote}
                style={[styles.reviewInput, { height: 120 }]}
                multiline
              />

              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                  <Pressable key={star} onPress={() => setRating(star)}>
                    <Text
                      style={{
                        fontSize: 30,
                        marginHorizontal: 2,
                        color:
                          star <= rating
                            ? colors.markedStar
                            : colors.defaultStar,
                      }}
                    >
                      ★
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.ratingText}>Rating: {rating}/10</Text>

              <Pressable
                style={buttons.buttonForm}
                onPress={async () => {
                  await UpdateBook(selectedBook.id, {
                    status: "doneReading",
                    endDate: new Date().toLocaleDateString(),

                    favoriteCharacter,
                    favoriteQuote,
                    rating: Number(rating),
                  });

                  setDoneReadingModal(false);
                  setBookModalVisible(false);
                }}
              >
                <Text style={buttons.buttonText}>Save Review</Text>
              </Pressable>

              <Pressable
                style={buttons.buttonForm}
                onPress={() => setDoneReadingModal(false)}
              >
                <Text style={buttons.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

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
