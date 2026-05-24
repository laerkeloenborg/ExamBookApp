import { StyleSheet } from "react-native"
import colors from "./Colors.js"


export default StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 70,
        paddingHorizontal: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.darkText,
        textAlign: "center",
        marginBottom: 100,
    },
    bookInfo: {
        marginTop: 10,
        fontSize: 18
    },
    scroll:{
        alignItems: "center",
        padding: 20
    },
    bookModal:{
         backgroundColor: "rgba(255, 255, 255,0.9)",
    }
})