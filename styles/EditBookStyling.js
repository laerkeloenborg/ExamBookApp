import { StyleSheet } from "react-native";
import colors from "./Colors.js";

export default StyleSheet.create({
  editInput: {
    borderColor: colors.solidGreen,
    borderWidth: 2,
    width: "100%",
    borderRadius: 12,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: 10,
    marginBottom: 5,
    color: colors.solidGreen
},
});
