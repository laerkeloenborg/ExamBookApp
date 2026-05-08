import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Modal } from 'react-native';
import { useState } from 'react';
import { database, storage } from './firebase'
import Login from './components/login';
import Books from './components/Books';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return isLoggedIn ? (
    <View style={styles.container}>
      <Text>Welcome to Mybooks</Text>
      <Text>A place where you can handle your books</Text>

      <Button title='Add book' onPress={() => setModalVisible(true)} />

      <Books
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />

      <StatusBar style="auto" />
    </View>
  ) : (
    <Login onLogin={() => setIsLoggedIn(true)}></Login>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
