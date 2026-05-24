import { Modal, View, Text, TextInput, Pressable } from "react-native";
import styles from "../styles/ProfileStyling.js";
import buttons from "../styles/Buttons.js";
import colors from "../styles/Colors.js";
import { UpdateBook } from "./Books.js";

export default function DoneReadingModal({
  visible,
  selectedBook,
  favoriteCharacter,
  setFavoriteCharacter,
  favoriteQuote,
  setFavoriteQuote,
  rating,
  setRating,
  onClose,
  onFinish,
}) {
  return (
    <>
      <Modal
        visible={visible}
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
                        star <= rating ? colors.markedStar : colors.defaultStar,
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

                onFinish();
              }}
            >
              <Text style={buttons.buttonText}>Save Review</Text>
            </Pressable>

            <Pressable
              style={buttons.buttonForm}
              onPress={() => onClose()}
            >
              <Text style={buttons.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
