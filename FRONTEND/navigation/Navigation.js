import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthStack from "./AuthStack";
import MainStack from "./MainStack";
import OnboardingStack from "./OnboardingStack";
import PlanningMealsScreen from "../screens/Main/PlanningMealsScreen";
import GroceriesListScreen from "../screens/Main/GroceriesListScreen";
// import ProfileScreen from '../screens/Main/ProfileScreen';
import RecipesScreen from "../screens/Main/RecipesScreen";
import IngredientsScreen from "../screens/Main/IngredientsScreen";
import Mealschoix from "../screens/Main/mealschoix";
import Addfood1 from "../screens/addfood/addfood1";
import Addfood2 from "../screens/addfood/addfood2";
import Addfood3 from "../screens/addfood/addfood3";
import Addfood4 from "../screens/addfood/addfood4";
import Addfood5 from "../screens/addfood/addfood5";
import ParentComponent from "../screens/addfood/ParentComponent";
import UpdateScreen from "../screens/Main/UpdateScreen";
import ProfileScreen from "../screens/Main/ProfileScreen";
const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [isFirstTime, setIsFirstTime] = useState(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const value = await AsyncStorage.getItem("hasSeenOnboarding");
        if (value === null) {
          // If the value is null, it means it's the first time opening the app
          setIsFirstTime(true);
        } else {
          // If the value exists, onboarding has been completed
          setIsFirstTime(false);
        }
      } catch (e) {
        console.error("Error reading value from AsyncStorage", e);
        setIsFirstTime(false); // Default to false if there is an error
      }
    };

    checkFirstTime();
  }, []);

  if (isFirstTime === null) {
    // Show a loading screen or nothing while checking AsyncStorage
    return null;
  }

  return (
    <Stack.Navigator initialRouteName={isFirstTime ? "Onboarding" : "Auth"}>
      <Stack.Screen
        name="FormulaireDynamique"
        component={UpdateScreen}
        options={{ headerShown: false }}
      />
            <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PlanningMeals"
        component={PlanningMealsScreen}
        options={{ headerShown: false }}
      />
       {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      <Stack.Screen
        name="GroceriesList"
        component={GroceriesListScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="RecipesScreen"
        component={RecipesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="addfood1"
        component={Addfood1}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addfood2"
        component={Addfood2}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addfood3"
        component={Addfood3}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addfood4"
        component={Addfood4}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="addfood5"
        component={Addfood5}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ParentComponent"
        component={ParentComponent}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Ingredients"
        component={IngredientsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MealDetailsScreen"
        component={Mealschoix}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
