import { StyleSheet } from "react-native"
import colors from "./Colors.js"

export default StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20
    },

    card: {
        backgroundColor: colors.white,
        borderRadius: 30,
        padding: 25,

        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,

        elevation: 5
    },

    title: {
        fontSize: 34,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.darkText,
        marginBottom: 5
    },

    subtitle: {
        textAlign: "center",
        color: colors.lightText,
        marginBottom: 30,
        fontSize: 16
    },

    input: {
        backgroundColor: colors.lightBackground,
        padding: 16,
        borderRadius: 15,
        marginBottom: 15,
        fontSize: 16
    },

    button: {
        padding: 16,
        borderRadius: 15,
        alignItems: "center",
        marginBottom: 12
    },

    googleButton: {
        backgroundColor: colors.googleBlue
    },

    bioAndModalButton: {
        backgroundColor: colors.bioGreen
    },

    loginButton: {
        backgroundColor: colors.primaryBlue,
        marginTop: 10
    },

    cancelButton: {
        backgroundColor: colors.danger,
        marginTop: 10
    },

    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold"
    },

    signUpText: {
        textAlign: "center",
        marginTop: 20,
        color: colors.primaryBlue,
        fontWeight: "600",
        fontSize: 16
    },

    modalContainer: {
       flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(15, 23, 42, 0.45)"
    },

    modalContent: {
        width: "88%",
        backgroundColor: colors.white,
        padding: 28,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 15,
        elevation: 8
    },

    modalTitle: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        color: colors.darkText,
        marginBottom: 8
    }

})