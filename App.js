import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Modal } from 'react-native';
import { useState } from 'react';
import { database, storage} from './firebase'
import Login from './login';

export default function App() {
 const [modalVisible, setModalVisible] = useState(false)
 const [title, setTitle] = useState('')
 const [description, setDescription] = useState('')
 const [author, setAuthor] = useState('')
 const [startDate, setStartDate] = useState('')
 const [endDate, setEndDate] = useState('')
 const [isLoggedIn, setIsLoggedIn] = useState(false)

  return isLoggedIn ?(
    <View style={styles.container}>
      <Text>Welcome to Mybooks</Text>
      <Text>A place where you can handle your books</Text>

      <Button title='Add book' onPress={() => setModalVisible(true)}/>

      <Modal visible={modalVisible}>
        <View style={styles.container}>
           <Text style={styles.header}>Add a new book</Text>

          <TextInput
            placeholder='Book title'
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <TextInput
            placeholder='Book description'
            value={description}
            onChangeText={setDescription}
            style={styles.input}
          />

          <TextInput
            placeholder='Author'
            value={author}
            onChangeText={setAuthor}
            style={styles.input}
          />

          <TextInput 
          placeholder='Start date'
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
          />

          <TextInput 
          placeholder='End date'
          value={endDate}
          onChangeText={setEndDate}
          style={styles.input}
          />

           <Button 
            title='Save book' 
            onPress={() => {
              console.log(title, description, author, startDate, endDate);

              setTitle('')
              setDescription('')
              setAuthor('')
              setStartDate('')
              setEndDate('')
            
              setModalVisible(false);
            }} 
          />

          <Button 
            title="Cancel" 
            onPress={() => setModalVisible(false)} 
            color="red"
          />
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  ): (
  <Login onLogin={() => setIsLoggedIn(true)}></Login>
);}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
