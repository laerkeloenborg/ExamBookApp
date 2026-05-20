import { StyleSheet } from "react-native"
import colors from "./Colors.js"

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        justifyContent: "flex-start"
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 40,
        marginTop: 40
    },

    title: {
        fontSize: 30,
        fontWeight: "bold",
        color: colors.darkText,
        width: "70%"
    },

    profileImage: {
        width: 75,
        height: 75,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: colors.white
    },  
    card: {
        backgroundColor: "rgba(255,255,255,0.25)",
        borderRadius: 25,
        padding: 25,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6
    },
    userInfo: {
        alignItems: "center",
        marginBottom: 25
    },

    userName: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.darkText,
        marginTop: 15
    },

    userMail: {
        fontSize: 16,
        color: colors.lightText,
        marginTop: 5
    },

    modalButton: {
        width: "100%",
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        backgroundColor: colors.bioGreen
    },

    logoutButton: {
        width: "100%",
        backgroundColor: colors.primaryBlue,
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6
    },

    deleteButton: {
        backgroundColor: colors.danger
    },

    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "bold"
    },

    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 25
    },

    modalContent: {
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.92)",
        borderRadius: 30,
        padding: 30,
        alignItems: "center"
    },

    modalTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.darkText,
        marginBottom: 25
    },

    largeProfileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: colors.white,
        marginBottom: 25
    }

})