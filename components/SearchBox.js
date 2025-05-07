import React from "react";
import { View, Text, TextInput } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import globalStyles from "../constants/globalStyles";

const SearchBox = ({q, setQ}) => {
    
  return (
    <View style={[globalStyles.container, globalStyles.mb]} >
      <TextInput style={[globalStyles.input, globalStyles.placeholder]} 
        placeholder="Search Event.." 
        placeholderTextColor={'gray'}
        value={q} onChangeText={setQ}/>

      <View style={[globalStyles.button]}>
        <Ionicons name="search" size={24}  color="white" />
      </View>
    </View>
  );
};

export default SearchBox; 