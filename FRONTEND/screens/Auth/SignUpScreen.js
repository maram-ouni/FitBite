import React, { useState } from 'react';

import {

    View,

    Text,

    TextInput,

    StyleSheet,

    Alert,

    KeyboardAvoidingView,

    Platform,

    ScrollView,

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../components/Button';

import { signUpUser, createFormulaire } from '../../services/apiService';

 

const SignUpScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [isPasswordValid, setIsPasswordValid] = useState(false);

    const [isPasswordContainsNumber, setIsPasswordContainsNumber] = useState(false);

    const [activeField, setActiveField] = useState(null);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

   

    const isValidEmail = (email) => {

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        return emailRegex.test(email);

    };

 

    const handlePasswordChange = (text) => {

        setPassword(text);

        setIsPasswordValid(text.length >= 6);

        setIsPasswordContainsNumber(/\d/.test(text));

    };

 

    const handleSignUp = async () => {

        if (!isValidEmail(email)) {

            Alert.alert('Error', 'Please enter a valid email address!');

            return;

        }

   

        if (!isPasswordValid || !isPasswordContainsNumber) {

            Alert.alert('Error', 'Password must be at least 6 characters long and include a number!');

            return;

        }

   

        const userData = {

            email,

            motDePasse: password,

        };

   

        try {

            const result = await signUpUser(userData);

            console.log("User created:", result);

   

            // Si l'ID de l'utilisateur existe, on appelle createFormulaire

            if (result.utilisateurId) {

                console.log('Calling createFormulaire with utilisateurId:', result.utilisateurId);

   

                // Appel à createFormulaire

                const formulaire = await createFormulaire({

                    utilisateur: result.utilisateurId,

                });

   

                // Log du formulaire créé

                console.log('Formulaire created:', formulaire);

   

                navigation.navigate('FormulaireDynamique', { iduser: result.utilisateurId,idform: formulaire._id , fromsignup: true });

            } else {

                console.log('Utilisateur ID is missing');

            }

   

        } catch (error) {

            console.error('Error during sign up or create form:', error);

            Alert.alert('Error', error || 'An unexpected error occurred.');

        }

    };

 

    // const handleSignUp = async () => {

    //     if (!isValidEmail(email)) {

    //         Alert.alert('Error', 'Please enter a valid email address!');

    //         return;

    //     }

 

    //     if (!isPasswordValid || !isPasswordContainsNumber) {

    //         Alert.alert('Error', 'Password must be at least 6 characters long and include a number!');

    //         return;

    //     }

 

    //     const userData = { email, motDePasse: password };

 

    //     try {

    //         const result = await signUpUser(userData);

    //         console.log(result, 'result');

    //         console.log(result.utilisateurId, 'result success');

           

    //        utilisateurId=result.utilisateurId;

           

    //             // Alert.alert('Success', 'Account created successfully!');

    //             const formulaire = await createFormulaire(utilisateurId);

    //             navigation.navigate('FormulaireDynamique',{id:formulaire._id});

    //             // navigation.navigate('FormulaireDynamique');

           

    //     } catch (error) {

    //         Alert.alert('Error', error || 'An unexpected error occurred.');

    //     }

    // };

 

    const togglePasswordVisibility = () => {

        setIsPasswordVisible(!isPasswordVisible);

    };

 

    return (

        <KeyboardAvoidingView

            style={styles.container}

            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        >

            <ScrollView contentContainerStyle={styles.scrollContainer}>

                <Text style={styles.heading}>Welcome!</Text>

                <Text style={styles.subHeading}>Please create your account below</Text>

 

                {/* Email Input */}

                <View

                    style={[

                        styles.inputContainer,

                        activeField === 'email' && styles.inputContainerActive,

                    ]}

                >

                    <Icon name="mail-outline" size={20} color="#E29578" />

                    <TextInput

                        style={styles.input}

                        placeholder="Email"

                        value={email}

                        onChangeText={setEmail}

                        keyboardType="email-address"

                        onFocus={() => setActiveField('email')}

                        onBlur={() => setActiveField(null)}

                    />

                </View>

 

                {/* Password Input */}

                <View

                    style={[

                        styles.inputContainer,

                        activeField === 'password' && styles.inputContainerActive,

                    ]}

                >

                    <Icon name="lock-closed-outline" size={20} color="#E29578" />

                    <TextInput

                        style={styles.input}

                        placeholder="Password"

                        value={password}

                        onChangeText={handlePasswordChange}

                        secureTextEntry={!isPasswordVisible}

                        onFocus={() => setActiveField('password')}

                        onBlur={() => setActiveField(null)}

                    />

                    <Icon

                        name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}

                        size={20}

                        color="#E29578"

                        onPress={togglePasswordVisibility}

                        style={styles.eyeIcon}

                    />

                </View>

 

                {/* Password Requirements */}

                <Text style={styles.requirementsTitle}>Your password must contain:</Text>

                <View style={styles.passwordValidation}>

                    <Text

                        style={[

                            styles.validationText,

                            isPasswordValid ? styles.valid : styles.invalid,

                        ]}

                    >

                        ✓ At least 6 characters

                    </Text>

                    <Text

                        style={[

                            styles.validationText,

                            isPasswordContainsNumber ? styles.valid : styles.invalid,

                        ]}

                    >

                        ✓ Contains a number

                    </Text>

                </View>

 

                {/* Sign Up Button */}

                <Button title="Sign Up" onPress={handleSignUp} style={styles.button} />

            </ScrollView>

        </KeyboardAvoidingView>

    );

};

 

const styles = StyleSheet.create({

    container: {

        flex: 1,

        backgroundColor: '#f9f9f9',

    },

    scrollContainer: {

        flexGrow: 1,

        justifyContent: 'center',

        alignItems: 'center',

        padding: 20,

    },

    heading: {

        fontSize: 24,

        fontWeight: 'bold',

        color: '#008080',

        marginBottom: 5,

    },

    subHeading: {

        fontSize: 14,

        color: '#555',

        marginBottom: 20,

    },

    inputContainer: {

        flexDirection: 'row',

        alignItems: 'center',

        width: '100%',

        height: 65,

        padding: 12,

        borderWidth: 1,

        borderColor: '#ddd',

        borderRadius: 30,

        backgroundColor: '#fff',

        marginBottom: 15,

    },

    inputContainerActive: {

        borderColor: '#E29578',

        borderWidth: 2,

    },

    input: {

        flex: 1,

        paddingLeft: 10,

        fontSize: 15,

    },

    eyeIcon: {

        position: 'absolute',

        right: 15,

    },

    requirementsTitle: {

        fontSize: 16,

        fontWeight: 'bold',

        color: '#555',

        marginBottom: 10,

        textAlign: 'center',

    },

    passwordValidation: {

        alignItems: 'center',

        marginBottom: 20,

    },

    validationText: {

        fontSize: 14,

        marginBottom: 5,

        color: '#999',

    },

    valid: {

        color: '#83C5BE',

    },

    invalid: {

        color: '#999',

    },

});

 

export default SignUpScreen;