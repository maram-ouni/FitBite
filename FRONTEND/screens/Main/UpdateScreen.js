// import React, { useState, useEffect } from 'react';

// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

// import { Picker } from '@react-native-picker/picker';

// import Button from '../../components/Button';

// import { COLORS } from '../../styles/colors';

// import { LinearGradient } from 'expo-linear-gradient';

// import Header from './Header';

// import { getFormulaires, updateFormulaire, createFormulaire } from '../../services/apiService'; // Import des fonctions API

// import { useUser } from '../../services/Usercontext';


// const UpdateScreen = ({ navigation, route }) => {

//     const { userId } = useUser();

//     const { formulaireId } = route.params || {};


//     const [loading, setLoading] = useState(true);

//     const [height, setHeight] = useState('');

//     const [weight, setWeight] = useState('');

//     const [trimester, setTrimester] = useState('');

//     const [activityLevel, setActivityLevel] = useState('');

//     const [supplements, setSupplements] = useState('');

//     const [doctorRemarks, setDoctorRemarks] = useState('');

//     const [specialDiet, setSpecialDiet] = useState(''); // Nouveau champ pour le régime spécial


//     useEffect(() => {

//         // Charger les données initiales si formulaireId ou userId est fourni

//         const fetchInitialData = async () => {

//             if (formulaireId) {

//                 try {

//                     const formData = await getFormulaires(); // Récupérer la liste des formulaires

//                     const selectedForm = data.filter(form => form.utilisateur === userId); // Filtrer par utilisateur

//                     if (selectedForm) {

//                         setHeight(selectedForm.taille || '');

//                         setWeight(selectedForm.poidsActuel || '');

//                         setTrimester(selectedForm.trimestre || '');

//                         setActivityLevel(selectedForm.ActivitePhysique || '');

//                         setSupplements(selectedForm.recommandations || '');

//                         setDoctorRemarks(selectedForm.doctorRemarks || '');

//                         setSpecialDiet(selectedForm.regimeSpecial || ''); // Remplir le champ régime spécial

                        

//                     }

//                 } catch (error) {

//                     console.error('Error fetching form data:', error);

//                     alert('Failed to load data. Please try again.');

//                 }

//             }

//             setLoading(false);

//         };


//         fetchInitialData();

//     }, [formulaireId]);


//     const handleSubmit = async () => {

//         const newFormData = {

//             trimestre: trimester,

//             poidsActuel: weight,

//             taille: height,

//             ActivitePhysique: activityLevel,

//             recommandations: supplements,

//             utilisateur: userId,

//             regimeSpecial: specialDiet, // Ajouter le régime spécial dans les données envoyées

//             doctorRemarks:  doctorRemarks,

//             utilisateur: userId,

//         };


//         console.log('New form data:', newFormData);


//         try {

//             if (formulaireId) {

//                 // Mise à jour du formulaire existant

//                 await updateFormulaire(formulaireId, newFormData);

//             } else {

//                 // Créer un nouveau formulaire si formulaireId est absent

//                 await createFormulaire(newFormData);

//             }

//             alert('Information saved successfully!');

//             navigation.navigate('Main');

//         } catch (error) {

//             console.error('Error submitting form:', error);

//             alert('Failed to save data. Please try again.');

//         }

//     };


//     if (loading) {

//         return <ActivityIndicator size="large" color={COLORS.primary.dark} />;

//     }


//     return (

//         <LinearGradient

//             colors={COLORS.gradients.background.colors}

//             locations={COLORS.gradients.background.locations}

//             start={{ x: 0, y: 0 }}

//             end={{ x: 0, y: 1 }}

//             style={styles.container}

//         >

//             <View style={styles.header}>

//                 <Header date="2 May, Monday" navigation={navigation} />

//             </View>


//             <ScrollView

//                 showsVerticalScrollIndicator={false}

//                 contentContainerStyle={styles.scrollContent}

//             >

//                 <View style={styles.filterContainer}>

//                     <Text style={styles.title}>Your information</Text>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Height</Text>

//                         <TextInput

//                             style={styles.input}

//                             placeholder="in cm"

//                             value={height}

//                             onChangeText={setHeight}

//                             keyboardType="numeric"

//                         />

//                     </View>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Weight</Text>

//                         <TextInput

//                             style={styles.input}

//                             placeholder="in Kg"

//                             value={weight}

//                             onChangeText={setWeight}

//                             keyboardType="numeric"

//                         />

//                     </View>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Pregnancy trimester</Text>

//                         <View style={styles.pickerContainer}>

//                             <Picker

//                                 selectedValue={trimester}

//                                 onValueChange={(itemValue) => setTrimester(itemValue)}

//                                 style={styles.picker}

//                             >

                                

//                                 <Picker.Item label="First trimester" value="1" />

//                                 <Picker.Item label="Second trimester" value="2" />

//                                 <Picker.Item label="Third trimester" value="3" />

//                             </Picker>

//                         </View>

//                     </View>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Regular physical activity level</Text>

//                         <View style={styles.pickerContainer}>

//                             <Picker

//                                 selectedValue={activityLevel}

//                                 onValueChange={(itemValue) => setActivityLevel(itemValue)}

//                                 style={styles.picker}

//                             >

                                

//                                 <Picker.Item label="Sedentary" value="sedentary" />

//                                 <Picker.Item label="Light" value="light" />

//                                 <Picker.Item label="Moderate" value="moderate" />

//                                 <Picker.Item label="Active" value="active" />

//                             </Picker>

//                         </View>

//                     </View>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Nutritional supplements taken</Text>

//                         <TextInput

//                             style={styles.input}

//                             placeholder="Enter supplements"

//                             value={supplements}

//                             onChangeText={setSupplements}

//                             multiline

//                         />

//                     </View>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Doctor's Remarks</Text>

//                         <TextInput

//                             style={styles.input}

//                             placeholder="Enter remarks"

//                             value={doctorRemarks}

//                             onChangeText={setDoctorRemarks}

//                             multiline

//                         />

//                     </View>


//                     <View style={styles.inputContainer}>

//                         <Text style={styles.label}>Special Diet</Text>

//                         <View style={styles.pickerContainer}>

//                             <Picker

//                                 selectedValue={specialDiet}

//                                 onValueChange={(itemValue) => setSpecialDiet(itemValue)}

//                                 style={styles.picker}

//                             >

//                                 <Picker.Item label="No special diet" value="" />

//                                 <Picker.Item label="Diabetic" value="diabetic" />

//                                 <Picker.Item label="Gluten Free" value="glutenFree" />

//                                 <Picker.Item label="Lactose Free" value="lactoseFree" />

//                                 <Picker.Item label="Vegan" value="vegan" />

//                             </Picker>

//                         </View>

//                     </View>


//                     <Button title="Submit" onPress={handleSubmit} style={styles.submitButton} />

//                 </View>

//             </ScrollView>

//         </LinearGradient>

//     );

// };


// const styles = StyleSheet.create({

//     container: {

//         flex: 1,

//     },

//     title: {

//         fontSize: 24,

//         fontWeight: 'bold',

//         color: COLORS.primary.dark,

//         marginBottom: 20,

//         textAlign: 'center',

//     },

//     header: {

//         marginTop: 15,

//     },

//     filterContainer: {

//         padding: 20,

//     },

//     inputContainer: {

//         marginBottom: 20,

//     },

//     label: {

//         fontSize: 16,

//         color: '#666',

//         marginBottom: 8,

//     },

//     input: {

//         borderWidth: 1,

//         borderColor: '#DDD',

//         borderRadius: 8,

//         padding: 12,

//         backgroundColor: 'white',

//     },

//     pickerContainer: {

//         borderWidth: 1,

//         borderColor: '#DDD',

//         borderRadius: 8,

//         backgroundColor: 'white',

//     },

//     picker: {

//         height: 50,

//     },

//     submitButton: {

//         marginTop: 20,

//     },

// });


// export default UpdateScreen;







import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator,Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/Button';
import { COLORS } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './Header';
import { getFormulaires, updateFormulaire, createFormulaire } from '../../services/apiService'; // Import des fonctions API
import { useUser } from '../../services/Usercontext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateScreen = ({ navigation, route }) => {
    const { userId } = useUser();
    const { formulaireId } = route.params || {};

    const [loading, setLoading] = useState(true);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [trimester, setTrimester] = useState('');
    const [activityLevel, setActivityLevel] = useState('');
    const [supplements, setSupplements] = useState('');
    const [doctorRemarks, setDoctorRemarks] = useState('');
    const [specialDiet, setSpecialDiet] = useState(''); // Nouveau champ pour le régime spécial
    const { setUserId } = useUser(); 

    useEffect(() => {
        // Charger les données initiales si formulaireId ou userId est fourni
        const fetchInitialData = async () => {
            if (formulaireId) {
                try {
                    const formData = await getFormulaires(); // Récupérer la liste des formulaires
                    const selectedForm = formData.find(form => form.id === formulaireId); // Trouver le formulaire spécifique
                    if (selectedForm) {
                        setHeight(selectedForm.taille || '');
                        setWeight(selectedForm.poidsActuel || '');
                        setTrimester(selectedForm.trimestre || '');
                        setActivityLevel(selectedForm.ActivitePhysique || '');
                        setSupplements(selectedForm.recommandations || '');
                        setDoctorRemarks(selectedForm.doctorRemarks || '');
                        setSpecialDiet(selectedForm.regimeSpecial || ''); // Remplir le champ régime spécial
                    }
                } catch (error) {
                    console.error('Error fetching form data:', error);
                    alert('Failed to load data. Please try again.');
                }
            }
            setLoading(false);
        };

        fetchInitialData();
    }, [formulaireId]);

    const handleSubmit = async () => {
    
    const newFormData = {
            trimestre: trimester,
            poidsActuel: weight,
            taille: height,
            ActivitePhysique: activityLevel,
            recommandations: supplements,
            utilisateur: userId,
            regimeSpecial: specialDiet, // Ajouter le régime spécial dans les données envoyées
            doctorRemarks:  doctorRemarks,
        };
        console.log

        try {
            if (formulaireId) {
                // Mise à jour du formulaire existant
                await updateFormulaire(formulaireId, newFormData);
            } else {
                // Créer un nouveau formulaire si formulaireId est absent
                await createFormulaire(newFormData);
            }
            alert('Information saved successfully!');
            navigation.navigate('Auth');
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
