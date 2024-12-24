import React, { useState, useEffect } from 'react';

import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

import { Picker } from '@react-native-picker/picker';

import Button from '../../components/Button';

import { COLORS } from '../../styles/colors';

import { LinearGradient } from 'expo-linear-gradient';

import Header from './Header';

import { getFormulaires, updateFormulaire, createFormulaire } from '../../services/apiService';

import { useUser } from '../../services/Usercontext';

import { v4 as uuidv4 } from 'uuid'; // Import UUID pour générer des IDs uniques

 


const UpdateScreen = ({ navigation, route }) => {
    const { userId } = useUser(); // Identifiant de l'utilisateur connecté
    const [loading, setLoading] = useState(true);
    const [formulaireId, setFormulaireId] = useState(null); // ID du formulaire (null par défaut)
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [trimester, setTrimester] = useState('1');
    const [activityLevel, setActivityLevel] = useState('sedentary');
    const [supplements, setSupplements] = useState('');
    const [doctorRemarks, setDoctorRemarks] = useState('');
    const [specialDiet, setSpecialDiet] = useState('');
    const [fromSignup, setFromSignup] = useState( route.params?.fromsignup || false);
    const [iduser, setIduser] = useState('');
    const [idform, setIdform] = useState('');





    // const iduser = route.params.iduser|| null; // ID utilisateur transmis par Signup
    // console.log(iduser)
    // const idform = route.params.idform || null; // ID formulaire transmis par Signup
    //  fromSignup = route.params.fromsignup || false; // Détection de la provenance de la navigation

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                if (fromSignup) {
                    // Traitement spécifique pour une navigation depuis Signup
                    const iduser = route.params.iduser; // ID utilisateur transmis par Signup
                    setIduser(iduser);
                    console.log(iduser)

                    const idform = route.params.idform ;

                    setIdform(idform);
                    // const fromSignup = route.params.fromsignup;
                    console.log('Navigation depuis Signup');

                    // setFormulaireId(idform);
                } else {
                    // Charger les données du formulaire existant
                    const formData = await getFormulaires();
                    // const fromSignup = false;
                    setFromSignup(false);
                    console.log('Form data:', userId);
                    const userForm = formData.find(form => form.utilisateur === userId);

                    if (userForm) {
                        setFormulaireId(userForm._id);
                        setHeight(userForm.taille || '');
                        setWeight(userForm.poidsActuel || '');
                        setTrimester(userForm.trimestre || '');
                        setActivityLevel(userForm.ActivitePhysique || '');
                        setSupplements(userForm.recommandations || '');
                        setDoctorRemarks(userForm.doctorRemarks || '');
                        setSpecialDiet(userForm.regimeSpecial || '');
                    }
                }
            } catch (error) {
                console.error('Error fetching form data:', error);
                alert('Failed to load data. Please try again.');
            }
            setLoading(false);
        };

        fetchInitialData();
    }, [userId]);

    const handleSubmit = async () => {
        const formData = {
            utilisateur: fromSignup ? iduser : userId,
            taille: height,
            poidsActuel: weight,
            trimestre: trimester,
            ActivitePhysique: activityLevel,
            recommandations: supplements,
            doctorRemarks: doctorRemarks,
            regimeSpecial: specialDiet,
        };

        try {
            if (fromSignup) {
                // Création d'un formulaire pour un utilisateur venant de Signup
                console.log('Création de formulaire depuis Signup');
                await updateFormulaire(idform,formData);
                alert('Form submitted successfully!');
                navigation.navigate('Auth'); // Rediriger vers Auth
            } else {
                // Mise à jour d'un formulaire existant pour un utilisateur connecté
                console.log('Mise à jour du formulaire existant');
                await updateFormulaire(formulaireId, formData);
                alert('Form updated successfully!');
                navigation.navigate('Main'); // Rediriger vers Main
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to save data. Please try again.');
        }
    };

 

    if (loading) {

        return <ActivityIndicator size="large" color={COLORS.primary.dark} />;

    }

 

    return (

        <LinearGradient

            colors={COLORS.gradients.background.colors}

            locations={COLORS.gradients.background.locations}

            start={{ x: 0, y: 0 }}

            end={{ x: 0, y: 1 }}

            style={styles.container}

        >

            <View style={styles.header}>

                <Header date="2 May, Monday" navigation={navigation} />

            </View>

 

            <ScrollView

                showsVerticalScrollIndicator={false}

                contentContainerStyle={styles.scrollContent}

            >

                <View style={styles.filterContainer}>

                    <Text style={styles.title}>Your information</Text>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Height</Text>

                        <TextInput

                            style={styles.input}

                            placeholder="in cm"

                            value={height}

                            onChangeText={setHeight}

                            keyboardType="numeric"

                        />

                    </View>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Weight</Text>

                        <TextInput

                            style={styles.input}

                            placeholder="in Kg"

                            value={weight}

                            onChangeText={setWeight}

                            keyboardType="numeric"

                        />

                    </View>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Pregnancy trimester</Text>

                        <View style={styles.pickerContainer}>

                            <Picker

                                selectedValue={trimester}

                                onValueChange={(itemValue) => setTrimester(itemValue)}

                                style={styles.picker}

                            >

                               

                                <Picker.Item label="First trimester" value="1" />

                                <Picker.Item label="Second trimester" value="2" />

                                <Picker.Item label="Third trimester" value="3" />

                            </Picker>

                        </View>

                    </View>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Regular physical activity level</Text>

                        <View style={styles.pickerContainer}>

                            <Picker

                                selectedValue={activityLevel}

                                onValueChange={(itemValue) => setActivityLevel(itemValue)}

                                style={styles.picker}

                            >

                               

                                <Picker.Item label="Sedentary" value="sedentary" />

                                <Picker.Item label="Light" value="light" />

                                <Picker.Item label="Moderate" value="moderate" />

                                <Picker.Item label="Active" value="active" />

                            </Picker>

                        </View>

                    </View>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Nutritional supplements taken</Text>

                        <TextInput

                            style={styles.input}

                            placeholder="Enter supplements"

                            value={supplements}

                            onChangeText={setSupplements}

                            multiline

                        />

                    </View>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Doctor's Remarks</Text>

                        <TextInput

                            style={styles.input}

                            placeholder="Enter remarks"

                            value={doctorRemarks}

                            onChangeText={setDoctorRemarks}

                            multiline

                        />

                    </View>

 

                    <View style={styles.inputContainer}>

                        <Text style={styles.label}>Special Diet</Text>

                        <View style={styles.pickerContainer}>

                            <Picker

                                selectedValue={specialDiet}

                                onValueChange={(itemValue) => setSpecialDiet(itemValue)}

                                style={styles.picker}

                            >

                                <Picker.Item label="No special diet" value="" />

                                <Picker.Item label="Diabetic" value="diabetic" />

                                <Picker.Item label="Gluten Free" value="glutenFree" />

                                <Picker.Item label="Lactose Free" value="lactoseFree" />

                                <Picker.Item label="Vegan" value="vegan" />

                            </Picker>

                        </View>

                    </View>

 

                    <Button title="Submit" onPress={handleSubmit} style={styles.submitButton} />

                </View>

            </ScrollView>

        </LinearGradient>

    );

};

 

const styles = StyleSheet.create({

    container: {

        flex: 1,

    },

    title: {

        fontSize: 24,

        fontWeight: 'bold',

        color: COLORS.primary.dark,

        marginBottom: 20,

        textAlign: 'center',

    },

    header: {

        marginTop: 15,

    },

    filterContainer: {

        padding: 20,

    },

    inputContainer: {

        marginBottom: 20,

    },

    label: {

        fontSize: 16,

        color: '#666',

        marginBottom: 8,

    },

    input: {

        borderWidth: 1,

        borderColor: '#DDD',

        borderRadius: 8,

        padding: 12,

        backgroundColor: 'white',

    },

    pickerContainer: {

        borderWidth: 1,

        borderColor: '#DDD',

        borderRadius: 8,

        backgroundColor: 'white',

    },

    picker: {

        height: 50,

    },

    submitButton: {

        marginTop: 20,

    },

});

 

export default UpdateScreen;