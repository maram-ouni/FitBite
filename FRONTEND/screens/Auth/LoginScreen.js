import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, StyleSheet, Image, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';

import Button from '../../components/Button'; // Bouton personnalisé

import Button2 from '../../components/Button2'; // Deuxième bouton personnalisé

import axios from 'axios'; // Pour les requêtes API

import { useUser } from '../../services/Usercontext';

import AsyncStorage from '@react-native-async-storage/async-storage';

 

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');

    const [logoSize, setLogoSize] = useState(250);

    const [logoPosition, setLogoPosition] = useState(0);

    const [titlePosition, setTitlePosition] = useState(0);

    const { setUserId } = useUser(); // Utiliser le setUserId du contexte

 

    useEffect(() => {

        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {

            setLogoSize(150);

            setLogoPosition(45);

            setTitlePosition(23);

        });

 

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {

            setLogoSize(250);

            setLogoPosition(0);

            setTitlePosition(0);

        });

 

        return () => {

            keyboardDidShowListener.remove();

            keyboardDidHideListener.remove();

        };

    }, []);

 

    const handleLogin = async () => {

        if (!email || !password) {

            Alert.alert('Erreur', 'Veuillez entrer un email et un mot de passe.');

            return;

        }

 

        try {
            const response = await axios.post('http://192.168.56.1:5000/api/auth/connexion', {
                email,

                motDePasse: password,

            });

 

            console.log('Connexion réussie:', response.data);

            Alert.alert('Succès', 'Connexion réussie!');

            const userId = response.data.utilisateur.id;

            setUserId(userId);

            console.log(userId)

            await AsyncStorage.setItem('utilisateurId', userId);

 

            // Naviguer vers l'écran principal

            navigation.navigate('Main', { user: response.data.utilisateur });

        } catch (error) {

            console.error('Erreur de connexion:', error.response?.data || error.message);

            Alert.alert('Erreur', error.response?.data.message || 'Une erreur est survenue.');

        }

    };

 

    return (

        <KeyboardAvoidingView style={styles.container} behavior="padding">

            {/* Logo */}

            <Image

                source={require('../../assets/images/logo.png')}

                style={[

                    styles.logo,

                    { width: logoSize, height: logoSize, transform: [{ translateY: logoPosition }] },

                ]}

            />

 

            {/* Titre */}

            <Text style={[styles.title, { transform: [{ translateY: titlePosition }] }]}>

                Welcome to FitBite

            </Text>

 

            {/* Email */}

            <TextInput

                placeholder="Your Email"

                style={styles.input}

                keyboardType="email-address"

                value={email}

                onChangeText={(text) => setEmail(text)}

            />

 

            {/* Mot de passe */}

            <TextInput

                placeholder="Password"

                secureTextEntry

                style={styles.input}

                value={password}

                onChangeText={(text) => setPassword(text)}

            />

 

            {/* Bouton de connexion */}

            <Button title="Log in" onPress={handleLogin} style={styles.button} />

 

            {/* Bouton d'inscription */}

            <Button2 title="Sign Up" onPress={() => navigation.navigate('SignUp')} style={styles.button} />

        </KeyboardAvoidingView>

    );

};

 

const styles = StyleSheet.create({

    container: {

        flex: 1,

        justifyContent: 'center',

        alignItems: 'center',

        padding: 20,

        backgroundColor: 'white',

    },

    logo: {

        marginBottom: 30,

    },

    title: {

        fontSize: 30,

        fontWeight: 'bold',

        color: '#006D77',

        marginBottom: 30,

    },

    input: {

        width: '90%',

        padding: 10,

        fontSize: 16,

        marginBottom: 20,

        borderBottomWidth: 1,

        borderColor: '#006D77',

        backgroundColor: 'transparent',

    },

    button: {

        marginBottom: 10,

        marginTop: 15,

    },

});

 

export default LoginScreen;