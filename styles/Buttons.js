import { StyleSheet } from "react-native";
import colors from "./Colors.js";

export default StyleSheet.create({
  buttonForm: {
    marginTop: 30,
    backgroundColor: colors.solidGreen,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  deleteButton: { marginTop: 30, backgroundColor: colors.danger,paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: "center"},
});
