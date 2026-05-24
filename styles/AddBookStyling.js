import { StyleSheet } from "react-native";
import colors from "./Colors.js";

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
    backgroundColor: "rgba(255,255,255,0.7)",
  },

  descriptionInput: {
    height: 140,
    textAlignVertical: "top",
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
    backgroundColor: colors.solidGreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonPressed: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  resultInfo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
  },

  toast: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: colors.transparentSolidGreen,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 15,
    zIndex: 999,
    elevation: 10,
    maxWidth: 250,
  },

  toastText: {
    color: "white",
    fontWeight: "bold",
  },
});
