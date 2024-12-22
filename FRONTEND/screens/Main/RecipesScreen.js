
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { COLORS } from "../../styles/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import Button from "../../components/Button"; // Import du composant Button
import Header from "./Header";
import { getRecipes, getFormulaireTrimestreById } from "../../services/apiService"; // Importation du service getRecipes
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the search icon

const RecipesScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState("Breakfast");
  const [recipes, setRecipes] = useState([]); // Changer l'état en tableau pour stocker les recettes
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [searchText, setSearchText] = useState(""); // State for search input
  const [userTrimester, setUserTrimester] = useState(null); // État pour stocker la trimestre de l'utilisateur
  const [userId, setUserId] = useState(null);

  // Liste des filtres horizontaux
  const filters = ["Breakfast", "Lunch", "Dinner", "Snacks"];

  // Récupérer les recettes depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le userId stocké depuis AsyncStorage
        const userId = await AsyncStorage.getItem("utilisateurId");
        if (userId) {
          setUserId(userId); // Mettre à jour l'état avec userId
        }
        console.log(userId)
        // Vérifie si AuserId est disponible avant de continuer
        if (userId) {
          const userForm = await getFormulaireTrimestreById(userId);
          setUserTrimester(userForm.trimestre); // Stocke le trimestre de l'utilisateur
          console.log(`User Trimester: ${userTrimester}`);
        }
        
        const data = await getRecipes(); // Appeler la fonction getRecipes depuis le service
        setRecipes(data); // Stocker les recettes dans l'état
        setLoading(false); // Terminer le chargement
        console.log("Recipes:", recipes);
      } catch (error) {
        setError("Failed to fetch recipes"); // Gérer l'erreur
        setLoading(false); // Terminer le chargement
        console.error(error);
      }
    };

    fetchData(); // Exécuter la fonction fetchData au montage du composant
  }, []);  // L'effet ne s'exécute qu'une fois, lors du montage du composant

  // Récupérer les recettes pour le filtre actif

  const selectedRecipes = recipes.filter(
    (recipe) =>
      recipe.categorie?.toLowerCase() === activeFilter.toLowerCase() &&
      recipe.nom.toLowerCase().includes(searchText.toLowerCase()) &&
      recipe.trimester.includes(userTrimester)
  ); // Filter recipes by search text


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={COLORS.gradients.background.colors}
      locations={COLORS.gradients.background.locations}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header date="2 May, Monday" navigation={navigation} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeFilter.toLowerCase()} recipes...`}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filtres horizontaux */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollBox}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={styles.filterButton}
            >
              {activeFilter === filter ? (
                <LinearGradient
                  colors={[COLORS.primary.dark, COLORS.primary.main]}
                  style={styles.activeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.filterText, styles.activeText]}>
                    {filter}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveButton}>
                  <Text style={styles.filterText}>{filter}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Liste des recettes */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.addButtonContainer}>
          <Button
            title="Add Your Own Recipe"
            onPress={() => navigation.navigate("addfood2")}
          />
        </View>

        {/* Cartes des recettes */}
        {selectedRecipes.map((recipe) => (
          <TouchableOpacity
            key={recipe._id}
            style={styles.recipeCard}
            onPress={() =>
              navigation.navigate("ParentComponent", { recipeId: recipe._id })
            }
          >
            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{recipe.nom}</Text>

              <Text style={styles.recipeDuration}>{recipe.tempsPreparation} minutes</Text>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { marginTop: 15 },
  scrollView: { flex: 1 },
  filterContainer: {
    backgroundColor: "#F2F5FC",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  scrollBox: { flexDirection: "row" },
  filterButton: { marginRight: 10, borderRadius: 25 },
  activeGradient: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  inactiveButton: {
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterText: { fontSize: 14, color: "#666" },
  activeText: { color: "#fff", fontWeight: "bold" },
  addButtonContainer: { marginHorizontal: 20, marginBottom: 20 },
  recipeCard: {
    backgroundColor: "white",
    borderRadius: 15,
    marginBottom: 20,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  recipeImage: { width: "100%", height: 200, resizeMode: "cover" },
  recipeInfo: { padding: 15 },
  recipeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  recipeDuration: { color: "#666" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: { color: "red", fontSize: 18 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    height: 40,
    marginBottom: 15,
    marginHorizontal: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: "#555",
    fontSize: 15,
  },
});

export default RecipesScreen;
