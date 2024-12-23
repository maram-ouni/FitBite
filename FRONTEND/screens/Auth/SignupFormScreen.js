import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/Button';
import { COLORS } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SignupFormScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [city, setCity] = useState('ghazala');
  const { setUserId } = useUser(); 

  const handleSignUp = async () => {
    try {
      const response = await apiCallToSignUpUser({ firstName, lastName, phoneNumber, dateOfBirth, city });
      const userId = response.data.utilisateur.id;
      setUserId(userId);
      console.log()
      await AsyncStorage.setItem('utilisateurId', userId);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Sign up failed:', error);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  return (
    <LinearGradient
      colors={COLORS.gradients.background.colors}
      locations={COLORS.gradients.background.locations}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
    
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Title */}
        <Text style={styles.title}>Complete your Sign Up</Text>

        {/* Profile Picture */}
        <TouchableOpacity style={styles.profilePicContainer}>
          <View style={styles.profilePicCircle}>
            <Image
              source={require('../../assets/images/profile-placeholder.png')}
              style={styles.profileIcon}
            />
          </View>
          <Text style={styles.addPhotoText}>Add Profile Picture</Text>
        </TouchableOpacity>

        {/* First Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            placeholderTextColor="#666"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            placeholderTextColor="#666"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        {/* Phone Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {/* Date of Birth */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              placeholder="dd/mm/yyyy"
              placeholderTextColor="#666"
              value={dateOfBirth.toLocaleDateString()}
              editable={false}
            />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* City Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={city}
              onValueChange={(itemValue) => setCity(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="ghazala" value="ghazala" />
              <Picker.Item label="Another city" value="other" />
            </Picker>
          </View>
        </View>

        {/* Submit Button */}
        <Button title="Sign Up" onPress={handleSignUp} style={styles.button} />

      </ScrollView>
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    marginBottom: 20,
    textAlign: 'center',
},
  profilePicContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F4F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 50,
    height: 50,
    tintColor: '#006D77',
  },
  addPhotoText: {
    color: '#006D77',
    marginTop: 8,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
},
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A8C3C4',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#A8C3C4',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SignupFormScreen;
