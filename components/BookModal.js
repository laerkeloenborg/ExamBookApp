 import {
  Modal,
  View,
  ScrollView,
  Image,
  Text,
  Pressable,
} from "react-native";

import styles from "../styles/ProfileStyling.js";
import buttons from "../styles/Buttons.js";
import EditBookForm from "./EditBookForm.js";
import { UpdateBook } from "./Books.js";

export default function BookModal({
  visible,
  selectedBook,
  setSelectedBook,
  editMode,
  setEditMode,
  onClose,
  onDelete,
  onUpdate,
  onDoneReading,
}) {
    return(
 <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <ScrollView
                style={{width: "100%"}}
              contentContainerStyle={styles.bookModalContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedBook && (
                <>
                  <Image
                    source={{
                      uri:
                        selectedBook.image || "https://via.placeholder.com/100",
                    }}
                    style={styles.modalBookImage}
                  />

                  {editMode ? (
                    <EditBookForm
                      selectedBook={selectedBook}
                      setSelectedBook={setSelectedBook}
                      onSave={async () => {
                        await onUpdate();
                        setEditMode(false);
                      }}
                      onCancel={() => setEditMode(false)}
                    />
                  ) : (
                    <>
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
                          {selectedBook.rating > 0 && (
                            <Text style={styles.reviewText}>
                              ⭐ Rating: {selectedBook.rating}/10
                            </Text>
                          )}

                          {selectedBook.favoriteCharacter && (
                            <Text style={styles.reviewText}>
                              Favorite Character:{" "}
                              {selectedBook.favoriteCharacter}
                            </Text>
                          )}

                          {selectedBook.favoriteQuote && (
                            <>
                              <Text style={styles.reviewTitle}>
                                Favorite Quote
                              </Text>

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
                          onPress={() => onDoneReading(selectedBook)}
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
                            onClose(false);
                          }}
                        >
                          <Text style={buttons.buttonText}>
                            Currently Reading
                          </Text>
                        </Pressable>
                      )}

                      {/* UPDATE BUTTON */}
                      <Pressable
                        style={buttons.buttonForm}
                        onPress={() => setEditMode(true)}
                      >
                        <Text style={buttons.buttonText}>Edit book</Text>
                      </Pressable>

                      {/* DELETE BUTTON */}

                      <Pressable
                        style={buttons.deleteButton}
                        onPress={async () => {
                          await onDelete(selectedBook.id);

                          onClose(false);
                        }}
                      >
                        <Text style={buttons.buttonText}>Delete Book</Text>
                      </Pressable>

                      {/* CLOSE */}

                      <Pressable
                        style={buttons.buttonForm}
                        onPress={() => onClose(false)}
                      >
                        <Text style={buttons.buttonText}>Close</Text>
                      </Pressable>
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </Modal>
)}