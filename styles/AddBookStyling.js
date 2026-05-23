import { StyleSheet } from "react-native"
import colors from "./Colors.js"

export default StyleSheet.create({
container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
        paddingTop: 60,
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },

    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.7)"
    },

    list: {
        marginVertical: 20,
    },

    bookItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },

    bookTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },

    searchBookImage: {
        width: 60,
        height: 90,
        resizeMode: "contain",
        marginBottom: 8,
        alignSelf: "center",
    },

    bookImage: {
        width: 150,
        height: 220,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 20,
    },

    button: {
        backgroundColor: colors.solidGreen
    }


})