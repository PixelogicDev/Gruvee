/* eslint-disable camelcase */
// nfsdarkdevv - "MAPPLES IS A SUPERIOR ♥" (05/26/20)
// 404_mr_robot - "WATCH MR. ROBOT" (05/26/20)
import React, { useState } from 'react'
import useDebounce from 'react-use/lib/useDebounce'
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import {
    ALPHA_40,
    BASE_BUTTON_BACKGROUND_DARK_COLOR,
    BASE_FONT_COLOR,
    BUTTON_TEXT_SIZE_iOS,
    HEADLINE_SIZE_iOS,
    LARGE_TITLE_SIZE_iOS,
} from '@StyleConstants'
import { IsUsernamAvailable } from 'Gruvee/firestore/userActions'

import ValidUsername from './components/ValidUsername'

// Styles
const styles = StyleSheet.create({
    ButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 150,
    },
    ButtonText: {
        fontSize: BUTTON_TEXT_SIZE_iOS,
        textAlign: 'center',
    },
    ButtonTextDisabled: {
        color: '#9A9A9A',
    },
    ButtonTextEnabled: {
        color: 'white',
    },
    Container: {
        marginHorizontal: 20,
    },
    GetStartedButton: {
        minHeight: 44,
        width: '50%',
        justifyContent: 'center',
        backgroundColor: BASE_BUTTON_BACKGROUND_DARK_COLOR + ALPHA_40,
        borderWidth: 1,
        borderRadius: 5,
    },
    GetStartedButtonEnabled: {
        borderColor: '#C3EF87',
    },
    GetStartedDisabled: {
        borderColor: '#FEAF68',
    },
    Header: {
        color: BASE_FONT_COLOR,
        fontSize: LARGE_TITLE_SIZE_iOS,
        paddingTop: 30,
        paddingBottom: 25,
    },
    Headline: {
        color: BASE_FONT_COLOR,
        fontSize: HEADLINE_SIZE_iOS,
    },
    InputContainer: {
        flexWrap: 'wrap',
        width: '100%',
        marginTop: 125,
        paddingHorizontal: 5,
        minHeight: 44,
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#424242',
    },
    Input: {
        color: 'white',
        fontSize: 12,
        paddingLeft: 5,
    },
    ValidUsernameContainer: {
        paddingTop: 5,
    },
})

const AddUsername = ({ user }) => {
    const [username, setUsername] = useState('')
    const [usernameAvailable, setUsernameAvailable] = useState(null)
    const [isTyping, setIsTyping] = useState(false)

    // Way to add username that is being searched for
    const [, cancel] = useDebounce(
        async () => {
            const result = await IsUsernamAvailable(username)
            setUsernameAvailable(result)
            setIsTyping(false)
        },
        450,
        [username]
    )

    return (
        <SafeAreaView style={styles.Container}>
            <Text style={styles.Header}>Choose your username</Text>
            <Text style={styles.Headline}>
                This will be the name all your friends see when inviting you to a playlist. Make it
                count!
            </Text>
            <View style={styles.InputContainer}>
                <TextInput
                    // clearButtonMode="always"
                    onKeyPress={() => setIsTyping(true)}
                    onChangeText={value => setUsername(value.replace(/\s/g, ''))}
                    placeholder="Enter username"
                    placeholderTextColor={BASE_FONT_COLOR}
                    style={styles.Input}
                    value={username}
                />
            </View>
            <ValidUsername
                containerStyle={styles.ValidUsernameContainer}
                isTyping={isTyping}
                username={username}
                usernameAvailable={usernameAvailable}
            />
            <View style={styles.ButtonContainer}>
                <TouchableOpacity
                    style={mergeGetButtonStyles(usernameAvailable)}
                    onPress={getStartedAction(cancel)}
                    disabled={!usernameAvailable}
                >
                    <Text style={mergeGetButtonTextStyles(usernameAvailable)}>
                        Let's Get Grüvee
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const mergeGetButtonStyles = usernameIsAvaiable => {
    const mergeStyle = usernameIsAvaiable
        ? styles.GetStartedButtonEnabled
        : styles.GetStartedDisabled
    return { ...styles.GetStartedButton, ...mergeStyle }
}

const mergeGetButtonTextStyles = usernameIsAvaiable => {
    const mergeStyle = usernameIsAvaiable ? styles.ButtonTextEnabled : styles.ButtonTextDisabled
    return { ...styles.ButtonText, ...mergeStyle }
}

const getStartedAction = cancelDebounce => () => {
    cancelDebounce()
}

export default AddUsername
