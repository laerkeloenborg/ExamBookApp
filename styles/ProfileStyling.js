import { StyleSheet } from "react-native";
import colors from "./Colors.js";
import Colors from "./Colors.js";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "flex-start",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.darkText,
    width: "70%",
  },

  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.solidGreen,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  userInfo: {
    alignItems: "center",
    marginBottom: 25,
  },

  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.darkText,
    marginTop: 15,
  },

  userMail: {
    fontSize: 16,
    color: colors.lightText,
    marginTop: 5,
  },

  modalButton: {
    width: "100%",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: colors.solidGreen,
    padding: 5,
  },

  logoutButton: {
    width: "100%",
    backgroundColor: colors.solidGreen,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  deleteButton: {
    backgroundColor: colors.danger,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  modalContent: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.44)",
    borderRadius: 30,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.8)",
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.darkText,
    marginBottom: 25,
  },

  largeProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: colors.solidGreen,
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.solidGreen,
    marginBottom: 15,
    marginLeft: 10,
  },

  userBookCard: {
    width: 100,
    backgroundColor: "#ffffff6e",
    borderRadius: 10,
    padding: 0,
    marginHorizontal: 15,
  },
  userBookImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 0,
  },

  userBookTitle: {
    color: colors.solidGreen,
    fontSize: 16,
    fontWeight: "bold",
  },

  userBookAuthor: {
    color: colors.solidGreen,
    marginBottom: 5,
  },

  bookDate: {
    color: colors.solidGreen,
    fontSize: 12,
  },

  bookButtons: {
    marginTop: 10,
    gap: 10,
    backgroundColor: colors.solidGreen,
  },

  statusButton: {
    backgroundColor: colors.solidGreen,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
  },

  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    width: "100%",
  },

  searchBookImage: {
    width: 60,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },

  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.solidGreen,
    flex: 1,
  },

  bookModalContent: {
    backgroundColor: "rgba(255, 255, 255,0.9)",
    margin: 20,
    borderRadius: 30,
    padding: 20,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
  },

  modalBookImage: {
    width: 200,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },

  modalBookTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.solidGreen,
    textAlign: "center",
    marginBottom: 10,
  },

  modalBookAuthor: {
    fontSize: 18,
    color: colors.solidGreen,
    marginBottom: 15,
  },

  modalBookDescription: {
    color: colors.solidGreen,
    marginBottom: 20,
    textAlign: "center",
  },

  booksContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
  },

  reviewContainer: {
    marginTop: 20,
    width: "100%",
    padding: 15,
    borderRadius: 12,
  },

  reviewTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.solidGreen,
    marginTop: 10,
    marginBottom: 5,
  },

  reviewText: {
    fontSize: 16,
    color: colors.solidGreen,
    marginBottom: 8,
  },

  quoteText: {
    fontStyle: "italic",
    color: colors.solidGreen,
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
     width: "100%",
    backgroundColor: "white",

    borderWidth: 2,
    borderColor: colors.solidGreen,

    borderRadius: 14,

    paddingVertical: 14,
    paddingHorizontal: 16,

    marginTop: 12,

    fontSize: 16,
  }
});
