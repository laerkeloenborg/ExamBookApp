import { LinearGradient } from "expo-linear-gradient"
import { Text, FlatList, View, Image } from "react-native"
import colors from '../../styles/Colors.js'
import styles from '../../styles/HomeStyling.js'
import { useEffect, useState } from "react"

export default function Home() {
    const [fantasyBooks, setFantasyBooks] = useState([])
    const [romanceBooks, setRomanceBooks] = useState([])
    const API_KEY = "2563cf30fc764102b3862e2cfec6e705"

    useEffect(() => {
        fetchBooks("fantasy", setFantasyBooks)
        fetchBooks("romance", setRomanceBooks)
    }, [])

    function BookSection({title, books}){
        return (
            <View style={{marginBottom: 30}}>
                <Text style={{fontSize: 24, fontWeight: "bold", marginBottom:10}}> {title}</Text>
                
                <FlatList 
                data = {books}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                renderItem={({item}) => (
                    <View style={{marginRight: 15}}>
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

                    </View>
                )}
                />
            </View>
        )
    }

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
    
    return (
        <LinearGradient  
            colors={colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}>
            
            <Text style={styles.title}>Book recommendations</Text>
            <BookSection title="Fantasy" books={fantasyBooks}/>
            <BookSection title="Romance" books={romanceBooks}/>
        </LinearGradient>
    )
}