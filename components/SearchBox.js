import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import COLORS from "../constants/colors";
import Ionicons from '@expo/vector-icons/Ionicons';


const SearchBox = () => {
  return (
    <View style={styles.container}>
      <TextInput style={[styles.input, styles.boxStyles]} placeholder="Search Event.." placeholderTextColor={'gray'}/>
      <View style={[styles.button, styles.boxStyles]}>
        <Ionicons name="search" size={24}  color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 30
  },
  boxStyles:{
    shadowColor: COLORS.black,
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    marginRight: 10,
    fontSize: 15,
    fontWeight: 400 
  },
  button: {
    width: 50,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
});

export default SearchBox; 