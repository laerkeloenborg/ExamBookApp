import { View, Text, FlatList, Image, Pressable } from "react-native"
import styles from "../styles/ProfileStyling"

export default function UserBookSection({
    title,
    books,
    onDelete,
    onDoneReading,
    onPressBook
}) {

    return (
        <View style={{ marginBottom: 30 }}>

            <Text style={styles.sectionTitle}>
                {title}
            </Text>

            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={books}
                keyExtractor={(item) => item.id.toString()}

                renderItem={({ item }) => (

                    <Pressable
                        onPress={() => onPressBook(item)}
                        style={styles.userBookCard}
                    >

                        <Image
                            source={{
                                uri:
                                    item.image ||
                                    "https://via.placeholder.com/100"
                            }}
                            style={styles.userBookImage}
                        />

                      

                    </Pressable>
                )}
            />
        </View>
    )
}