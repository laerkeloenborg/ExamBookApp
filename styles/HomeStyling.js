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
    closeBtn:{
        marginTop: 30,
        backgroundColor: colors.bioGreen,
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 15
    },
    closeBtnText:{
        color: "white",
        fontWeight: "bold"
    },
    scroll:{
        alignItems: "center",
        padding: 20
    }
})