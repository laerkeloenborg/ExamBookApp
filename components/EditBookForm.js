import {TextInput, Pressable, Text } from "react-native";
import buttons from "../styles/Buttons.js";
import editBook from "../styles/EditBookStyling.js";

export default function EditBookForm({
  selectedBook,
  setSelectedBook,
  onSave,
  onCancel,
}) {
  console.log(selectedBook)
  return (
    <>
    <Text style={editBook.inputLabel}>Title</Text>
      <TextInput
        value={selectedBook.title}
        editable={!selectedBook.isApiBook}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            title: text,
          })
        }
        style={editBook.editInput}
        placeholder="title"
       
      />
     

<Text style={editBook.inputLabel}>Author</Text>
      <TextInput
        value={selectedBook.author}
        editable={!selectedBook.isApiBook}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            author: text,
          })
        }
        style={editBook.editInput}
        placeholder="author"
      />

<Text style={editBook.inputLabel}>Description</Text>
      <TextInput
        value={selectedBook.description}
        editable={!selectedBook.isApiBook}
        onChangeText={(text) =>
          setSelectedBook({
            ...selectedBook,
            description: text,
          })
        }
        style={editBook.editInput}
        placeholder="description"
      />

<Text style={editBook.inputLabel}>Pages</Text>
      <TextInput
        value={selectedBook.pages?.toString()}
        editable={!selectedBook.isApiBook}
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

<Text style={editBook.inputLabel}>Start date</Text>
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

<Text style={editBook.inputLabel}>End date</Text>
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
