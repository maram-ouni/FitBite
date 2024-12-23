import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS } from '../../styles/colors';
import { Ionicons, Feather } from '@expo/vector-icons';
import Header from './Header';
import Button from '../../components/Button';
import { LinearGradient } from 'expo-linear-gradient';
import { getIngredients, getRecipes, createMeal, getMealsByUser, updateMealItems } from '../../services/apiService';
import { useUser } from '../../services/Usercontext';
import { getTrimestreByUser } from '../../services/apiService';


const IngredientsScreen = ({ navigation, route }) => {
  const { category } = route.params;
  const [searchText, setSearchText] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [foods, setFoods] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [quantities, setQuantities] = useState({});
  const { userId } = useUser();
  const [userTrimester, setUserTrimester] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trimestre = await getTrimestreByUser(userId);
        setUserTrimester(trimestre);
        const [ingredientsData, recipesData] = await Promise.all([
          getIngredients(),
          getRecipes()
        ]);

        const filteredRecipes = recipesData.filter(
          (recipe) =>
            recipe.categorie?.toLowerCase() === category.toLowerCase() &&
            recipe.nom.toLowerCase().includes(searchText.toLowerCase()) &&
            recipe.trimester.includes(trimestre)
        );

        const combinedData = [
          ...ingredientsData.map(item => ({
            ...item,
            type: 'ingredient'
          })),
          ...filteredRecipes.map(item => ({
            ...item,
            type: 'recipe'
          }))
        ];

        setFoods(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [category, userId]);

  const updateTotalCalories = () => {
    const newTotal = selectedItems.reduce((sum, item) => {
      const quantity = quantities[item._id] || 1;
      return sum + (item.calories * quantity);
    }, 0);
    setTotalCalories(newTotal);
  };

  useEffect(() => {
    updateTotalCalories();
  }, [selectedItems, quantities]);

  const handleQuantityChange = (itemId, newQuantity) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: newQuantity
    }));
  };

  const handleAddMeal = async () => {
    try {
      const items = selectedItems.map(item => ({
        itemId: item._id,
        name: item.nom,
        count: quantities[item._id] || 1,
        calories: item.calories * (quantities[item._id] || 1)
      }));

      const mealData = {
        userId,
        mealType: category,
        items,
        totalCalories
      };

      const existingMeals = await getMealsByUser(userId);
      const existingMeal = existingMeals.find(meal => meal.mealType === category);

      if (existingMeal) {
        await updateMealItems(existingMeal._id, items);
      } else {
        await createMeal(mealData);
      }

      navigation.navigate('Main');
    } catch (error) {
      console.error('Error adding/updating meal:', error);
    }
  };

  const toggleItem = (item) => {
    if (selectedItems.find(selected => selected._id === item._id)) {
      setSelectedItems(selectedItems.filter(selected => selected._id !== item._id));
      setQuantities(prev => {
        const newQuantities = { ...prev };
        delete newQuantities[item._id];
        return newQuantities;
      });
    } else {
      setSelectedItems([...selectedItems, item]);
      setQuantities(prev => ({
        ...prev,
        [item._id]: 1
      }));
    }
  };

  const renderQuantitySelector = (item) => {
    const quantity = quantities[item._id] || 1;
    const unit = item.type === 'ingredient' ? (item.unité || 'g') : 'serving';

    return (
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item._id, Math.max(1, quantity - 1))}
        >
          <Feather name="minus" size={16} color={COLORS.primary.dark} />
        </TouchableOpacity>

        <View style={styles.quantityValueContainer}>
          <Text style={styles.quantityValue}>{quantity}</Text>
          <Text style={styles.quantityUnit}>{unit}</Text>
        </View>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item._id, quantity + 1)}
        >
          <Feather name="plus" size={16} color={COLORS.primary.dark} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFoodItem = (item) => {
    const isSelected = selectedItems.find(selected => selected._id === item._id);
    const quantity = quantities[item._id] || 1;
    const itemCalories = item.calories * quantity;

    return (
      <View style={styles.foodCard} key={item._id}>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.nom}</Text>
          {isSelected && renderQuantitySelector(item)}
          <Text style={styles.foodCalories}>{itemCalories} kcal</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isSelected && styles.selectedButton]}
          onPress={() => toggleItem(item)}
        >
          <Feather
            name={isSelected ? 'check' : 'plus'}
            size={20}
            color={COLORS.primary.dark}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const filteredFoods = foods.filter(item =>
    item.nom.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <LinearGradient
      colors={COLORS.gradients.background.colors}
      locations={COLORS.gradients.background.locations}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Header
          onMorePress={() => console.log('More button pressed')}
          navigation={navigation}
        />
      </View>

      <View style={styles.bbb}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.primary.dark} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{category}</Text>
      <Text style={styles.totalCalories}>Total Calories: {totalCalories}</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients or recipes..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={styles.foodList}>
        {filteredFoods.length === 0 ? (
          <Text style={styles.noItemsText}>No items found</Text>
        ) : (
          filteredFoods.map(renderFoodItem)
        )}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          title={`Add ${selectedItems.length} items to ${category}`}
          onPress={handleAddMeal}
          style={styles.submitButton}
          disabled={selectedItems.length === 0}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: COLORS.primary.light,
    borderRadius: 15,
    padding: 5,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quantityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    marginRight: 4,
  },
  quantityUnit: {
    fontSize: 12,
    color: COLORS.primary.dark,
  },
  foodInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    // Ajouté pour réduire la largeur des éléments généraux
  },
  headerContainer: {
    marginTop: 15,
    width: '100%',  // Largeur de l'entête reste pleine
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: COLORS.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bbb: {

    paddingTop: 5,
    paddingLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary.dark,
    marginBottom: 10,
    paddingTop: -20,
    textAlign: 'center',
    width: '80%',  // Réduit la largeur du titre
    alignSelf: 'center',  // Centre le titre
  },
  totalCalories: {
    fontSize: 16,
    color: '#9da8c3',
    marginBottom: 10,
    textAlign: 'center',
    width: '80%',  // Réduit la largeur des calories
    alignSelf: 'center',  // Centre les calories
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 15,
    width: '95%',  // Réduit la largeur de la barre de recherche
    alignSelf: 'center',  // Centre la barre de recherche

  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
    color: '#555',
    fontSize: 15,
  },
  foodList: {
    flex: 1,
    width: '100%',  // Assurez-vous que la liste des aliments occupe toute la largeur disponible
  },
  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.secondary.light,
    width: '95%',  // Réduit la largeur des cartes alimentaires
    alignSelf: 'center',  // Centre les cartes
  },
  foodName: {
    fontSize: 16,
    color: '#1a1c24',
    fontWeight: 'bold',
    marginRight: 5, // Add spacing between name and calories
  },
  foodType: {
    marginRight: 20, // Add spacing between name and calories
  },
  foodCalories: {
    fontSize: 14,
    color: '#9da8c3',
  },

  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.ui.addButton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',  // Réduit la largeur du conteneur du bouton
    alignSelf: 'center',  // Centre le bouton
  },
  submitButton: {
    marginTop: 20,
    width: '100%',  // Largeur complète pour le bouton submit
  },
});

export default IngredientsScreen;
