import {TextInput, Pressable, Text } from "react-native";
import buttons from "../styles/Buttons.js";
import editBook from "../styles/EditBookStyling.js";

export default function EditBookForm({
  selectedBook,
  setSelectedBook,
  onSave,
  onCancel,
}) {
  return (
    <>
      <TextInput
        value={selectedBook.title}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            title: text,
          })
        }
        style={editBook.editInput}
        placeholder="title"
      />

      <TextInput
        value={selectedBook.author}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            author: text,
          })
        }
        style={editBook.editInput}
        placeholder="author"
      />

      <TextInput
        value={selectedBook.description}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            description: text,
          })
        }
        style={editBook.editInput}
        placeholder="description"
      />

      <TextInput
        value={selectedBook.pages?.toString()}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            pages: text,
          })
        }
        style={editBook.editInput}
        keyboardType="numeric"
        placeholder="number of pages"
      />

      <TextInput
        value={selectedBook.startDate}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            startDate: text,
          })
        }
        style={editBook.editInput}
        placeholder="start date"
      />

      <TextInput
        value={selectedBook.endDate}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            endDate: text,
          })
        }
        style={editBook.editInput}
        placeholder="end date"
      />

      <Pressable style={buttons.buttonForm} onPress={onSave}>
        <Text style={buttons.buttonText}>Save</Text>
      </Pressable>

      <Pressable style={buttons.buttonForm} onPress={onCancel}>
        <Text style={buttons.buttonText}>Cancel</Text>
      </Pressable>
    </>
  );
}
