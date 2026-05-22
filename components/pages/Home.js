import { LinearGradient } from "expo-linear-gradient"
import { Text, FlatList, View, Image, Pressable, Modal, ScrollView } from "react-native"
import colors from '../../styles/Colors.js'
import styles from '../../styles/HomeStyling.js'
import { useEffect, useState } from "react"
import { ReadBook } from "../Books.js"

export default function Home() {
    const [fantasyBooks, setFantasyBooks] = useState([])
    const [romanceBooks, setRomanceBooks] = useState([])
    const [selectedBook, setSelectedBook] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const API_KEY = "2563cf30fc764102b3862e2cfec6e705"

    useEffect(() => {
        fetchBooks("fantasy", setFantasyBooks)
        fetchBooks("romance", setRomanceBooks)
    }, [])


    async function fetchBooks(genre, setFunction){
        try {
            const response = await fetch (
                `https://api.bigbookapi.com/search-books?query=${genre}&api-key=${API_KEY}`
            )

            const data = await response.json()
            const filteredBooks = (data.books || [])
                .flat()
                .filter(book => book.title && book.image)

            setFunction(filteredBooks.slice(0,10))
        } catch (error) {
            console.log(error)
        }
    }

    function BookSection({title, books}){
        return (
            <View style={{marginBottom: 30}}>
                <Text style={{fontSize: 24, fontWeight: "bold", marginBottom:10}}> {title}</Text>
                
                <FlatList 
                data = {books}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id.toString() || index.toString()}
                renderItem={({item}) => (
                    <Pressable style={{marginRight: 15}} onPress={() => ReadBook(item,setSelectedBook,setModalVisible)}>
                        {item.image ? (
                            <Image 
                                source={{uri: item.image}}
                                style={{
                                    width: 100,
                                    height: 150,
                                    borderRadius: 10
                                }}
                                />
                        ) : null}

                    </Pressable>
                )}
                />
            </View>
        )
    }

    

    return (
        <LinearGradient  
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}>
            
            <Text style={styles.title}>Book recommendations</Text>
            <BookSection title="Fantasy" books={fantasyBooks}/>
            <BookSection title="Romance" books={romanceBooks}/>

            <Modal visible={modalVisible}>
                {selectedBook && (
                    <ScrollView contentContainerStyle={styles.scroll}>
                        <Image
                            source={{ uri: selectedBook.image }}
                            style={{
                            width: 200,
                            height: 300,
                            borderRadius: 15,
                            marginBottom: 20
                            }}
                        />

                    <Text style={styles.title}>{selectedBook.title}</Text>
                    <Text style={styles.bookInfo}>{selectedBook.author}</Text>
                    <Text style={styles.bookInfo}>⭐ {selectedBook.rating}</Text>
                    <Text style={styles.bookInfo}>{selectedBook.description}</Text>

                    <Pressable
                        onPress={() => setModalVisible(false)}
                        style={styles.closeBtn}>
                        <Text style={styles.closeBtnText}>Close</Text>
                    </Pressable>

                    </ScrollView>
                )}
            </Modal>
        </LinearGradient>
    )
}