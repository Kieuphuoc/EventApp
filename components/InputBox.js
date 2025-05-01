import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const InputBox = ({ placeholder, value, onChangeText, iconName, style, multiline }) => {
    return (
        <View style={styles.inputContainer}>
            <Ionicons name={iconName} size={20} color={COLORS.primary} style={[styles.inputIcon, style]} />
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChangeText}
                multiline={multiline}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        padding: 20,
        paddingTop: 50,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        padding: 15,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
});

export default InputBox;
