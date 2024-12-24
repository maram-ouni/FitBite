import axios from 'axios';

 

const API_URL = 'http://192.168.56.1:5000/api'; // Replace with your actual backend URL

 

export const signUpUser = async (userData) => {

  const user = {

    email: userData.email,

    motDePasse: userData.motDePasse,

  };

 

  try {

    console.log('Sign-up Data:', user);

 

    // Effectuer la requête POST à l'API

    const response = await axios.post(`${API_URL}/auth/inscrire`, user);

 

    // Retourner les données de la réponse de l'API

    return response.data;

  } catch (error) {

    // Vérifier si 'error.response' existe pour éviter l'erreur si elle est undefined

    if (error.response) {

      // Si 'error.response' existe, cela signifie que l'API a retourné une erreur

      console.error('Sign-up Error:', error.response.data);

      throw new Error(error.response.data.message || 'Une erreur s\'est produite lors de l\'inscription.');

    } else {

      // Si l'erreur n'a pas de réponse (par exemple, problème de connexion)

      console.error('Sign-up Error:', error.message);

      throw new Error(error.message || 'Une erreur inconnue est survenue.');

    }

  }

};

 

// export const signUpUser = async (userData) => {

//   const user = {

//     email: userData.email,

//     motDePasse: userData.motDePasse,

//   };

 

//   try {

//     console.log('Sign-up Data:', user);

//     const response = await axios.post(`${API_URL}/auth/inscrire`, user);

 

//     return response.data;

//   } catch (error) {

//     console.error('Sign-up Error:', error);

//     throw error.response?.data || error.message;

//   }

// };




export const getRecipes = async () => {

  try {

    const response = await axios.get(`${API_URL}/recettes`);

    console.log('Recipes:', response.data); // Logs the recipes

    return response.data; // Return the recipe data

  } catch (error) {

    console.error('Error fetching recipes:', error);

  }

}

 

export const loginUser = async (userData) => {

  const user = {

    email: userData.email,

    motDePasse: userData.motDePasse,

  };

 

  try {

    console.log('Login Data:', user);

    const response = await axios.post(`${API_URL}/auth/connexion`, user);

    console.log('Response:', response.data);

    return response.data; // Contient l'utilisateur connecté

  } catch (error) {

    console.error('Login Error:', error);

 

    throw error.response?.data || error.message;

  }

};

 

export const addRecipe = async (recipeData) => {

  try {

    const response = await axios.post(`${API_URL}/recettes`, recipeData, {

      headers: {

        'Content-Type': 'application/json',

      },

    });

    return response.data; // Retourne la réponse de l'API (par exemple, la recette ajoutée)

  } catch (error) {

    console.error('Error adding recipe:', error);

    throw error;

  }

};

 

// Récupérer les ingrédients

export const getIngredients = async () => {

  try {

    const response = await axios.get(`${API_URL}/ingredients`);

    console.log('Ingredients:', response.data);

    return response.data;

  } catch (error) {

    console.error('Error fetching ingredients:', error);

  }

}

 

export const getIngredientsParId = async (IngredientId) => {

  try {

    console.log(`Fetching ingredient with ID: ${IngredientId}`);

    const response = await axios.get(`${API_URL}/ingredients/${IngredientId}`);

    console.log("Ingredient data:", response.data);

    return response.data;

  } catch (error) {

    console.error("Error fetching ingredient:", error);

    throw error;

  }

};

 

// Créer un formulaire dynamique

export const createFormulaire = async (formData) => {

  try {

    console.log('Creating Form:', formData);

    const response = await axios.post(`${API_URL}/formulaireDynamique`, formData);

    console.log('Formulaire Created:', response.data);

    return response.data;

  } catch (error) {

    console.error('Create Form Error:', error);

 

    throw error.response?.data || error.message;

  }

};

 

// Ajouter un nouvel ingrédient

export const addIngredient = async (ingredientData) => {

  try {

    const response = await axios.post(`${API_URL}/ingredients`, ingredientData, {

      headers: {

        'Content-Type': 'application/json',

      },

    });

    return response.data; // Retourne l'ingrédient ajouté

  } catch (error) {

    console.error('Error adding ingredient:', error);

  }

}

// Obtenir tous les formulaires dynamiques

export const getFormulaires = async () => {

  try {

    const response = await axios.get(`${API_URL}/formulaireDynamique`);

    console.log('Formulaires:', response.data);

    return response.data;

  } catch (error) {

    console.error('Get Formulaires Error:', error);

    throw error.response?.data || error.message;

  }

};

export const updateFormulaire = async (id, formData) => {

  try {

    const response = await axios.put(`${API_URL}/formulaireDynamique/${id}`, formData);

    console.log('Formulaire Updated:', response.data);

    return response.data;

  } catch (error) {

    console.error('Update Form Error:', error);

    throw error.response?.data || error.message;

  }

};

 

// Mettre à jour une recette avec des ingrédients

export const updateRecipeWithIngredients = async (recipeId, { ingredients }) => {

  try {

      // Calculer la somme des calories de tous les ingrédients

      const totalCalories = ingredients.reduce((sum, ingredient) => {

          return sum + (ingredient.calorie || 0); // Si `calorie` est null ou undefined, utiliser 0

      }, 0);

      console.log(totalCalories)

      // Inclure la somme des calories dans la requête

      const response = await axios.put(

          `${API_URL}/recettes/${recipeId}`,

          {

              ingredients,

              calories: totalCalories // Ajout du champ calories

          },

          {

              headers: {

                  'Content-Type': 'application/json',

              },

          }

      );

      console.log(response);

      console.log(response.data);

 

      return response.data; // Retourne la recette mise à jour

  } catch (error) {

      console.error('Error updating recipe:', error);

  }

};

 

export const updateRecipeWithInstructions = async (recipeId, { instructions }) => {

  try {

    const response = await axios.put(`${API_URL}/recettes/${recipeId}`, { instructions }, {

      headers: {

        'Content-Type': 'application/json',

      },

    });

    return response.data; // Retourne la recette mise à jour

  } catch (error) {

    console.error('Error updating instructions:', error);

    throw error.response?.data || error.message;

  }

};

// Supprimer un formulaire dynamique

export const deleteFormulaire = async (id) => {

  try {

    const response = await axios.delete(`${API_URL}/formulaireDynamique/${id}`);

    console.log('Formulaire Deleted:', response.data);

    return response.data;

  } catch (error) {

    console.error('Delete Form Error:', error);

    throw error.response?.data || error.message;

  }

};

export const getRecetteParId = async (recipeId) => {

  try {

    const response = await axios.get(`${API_URL}/recettes/${recipeId}`);

    return response.data;

  } catch (error) {

    console.error("Error fetching recipe:", error);

    throw error;

  }

};

 

export const updateFavoriteStatus = async (recipeId, favoriteStatus) => {

  try {

    const response = await axios.put(

      `${API_URL}/recettes/${recipeId}/favorite`,

      { favorite: favoriteStatus }

    );

    console.log(response)

    console.log(response.data)

    return response.data;

  } catch (error) {

    console.error('Error updating favorite status:', error);

    throw error;

  }

};

 

export const addFavorite = async (recetteId, utilisateurId) => {

  try {

    // Vérifier si l'ID utilisateur est présent

    if (!utilisateurId) {

      throw new Error("L'ID utilisateur est requis pour ajouter aux favoris.");

    }

    const response = await axios.post(

      `${API_URL}/auth/favorites`, // URL pour ajouter la recette aux favoris

      { recetteId, utilisateurId } // Envoyer les deux informations nécessaires

    );

 

    console.log(response.data);

    return response.data;

  } catch (error) {

    if (error.response) {

      // Si l'erreur provient du serveur

      console.error('Erreur lors de l\'ajout aux favoris:', error.response.data);

      throw new Error(error.response.data.message || 'Erreur interne du serveur');

    } else if (error.request) {

      // Si la requête a été envoyée, mais qu'aucune réponse n'a été reçue

      console.error('Pas de réponse du serveur:', error.request);

      throw new Error('Aucune réponse du serveur');

    } else {

      // Autres erreurs

      console.error('Erreur lors de l\'ajout aux favoris:', error.message);

      throw error;

    }

  }

};

 

export const checkIfFavorite = async (recipeId, userId) => {

  try {

    const response = await fetch(`${API_URL}/auth/favorites/${userId}/${recipeId}`);

    const data = await response.json();

    return data.isFavorite; // Retourne true ou false

  } catch (error) {

    console.error("Erreur lors de la vérification de l'état favori :", error);

    return false;

  }

};

 

export const removeFavorite = async (recipeId, userId) => {

  try {

    const response = await fetch(`${API_URL}/auth/favorites`, {

      method: 'DELETE',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify({

        recetteId: recipeId,

        utilisateurId: userId,

      }),

    });

 

    const data = await response.json();

 

    if (response.ok) {

      return data.message;

    } else {

      throw new Error(data.message || 'Erreur lors de la suppression des favoris');

    }

  } catch (error) {

    console.error('Erreur lors de la suppression des favoris:', error);

    throw error;

  }

};

 

export const getFavoriteRecipes = async (userId) => {

  try {

    // Ensure userId is provided

    if (!userId) {

      throw new Error('User ID is required');

    }

 

    // Make the API call to fetch the favorite recipes

    const response = await fetch(`${API_URL}/auth/favorites/${userId}`);

 

    // If the response is not OK, throw an error

    if (!response.ok) {

      throw new Error('Failed to fetch favorite recipes');

    }

 

    // Parse and return the JSON data (the recipes)

    console.log(response)

    const recipes = await response.json();

    return recipes;

  } catch (error) {

    console.error('Error fetching favorite recipes:', error);

    throw error; // Rethrow the error so it can be handled by the caller

  }

};

 

export const getUserInfo = async (userId) => {

  try {

    const response = await axios.get(`${API_URL}/utilisateurs/profile/${userId}`);

    if (response.status === 200) {

      return response.data;  // Retourner les données de l'utilisateur si la requête réussit

    } else {

      throw new Error(`Erreur : ${response.status} - ${response.statusText}`);

    }

  } catch (error) {

    console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);

    // Vous pouvez également renvoyer un message d'erreur ou un objet vide selon vos besoins

    throw new Error('Impossible de récupérer les informations de l\'utilisateur. Veuillez réessayer.');

  }

};

// Modifier les informations de l'utilisateur

export const updateUserInfo = async (userId, userData) => {

  try {

    // Préparer les données à envoyer pour la mise à jour

    const updatedUser = {

      nom: userData.nom,

      prenom: userData.prenom,

      age: userData.age,

      photo: userData.photo,  // Si vous souhaitez inclure une photo

    };

 

    const response = await axios.put(`${API_URL}/utilisateurs/${userId}`, updatedUser, {

      headers: {

        'Content-Type': 'application/json',

      },

    });

 

    console.log('Utilisateur mis à jour:', response.data);

    return response.data;  // Retourner la réponse de l'API, qui pourrait être l'utilisateur mis à jour

  } catch (error) {

    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);

    throw error.response?.data || error.message;

  }

};

export const addToShoppingList = async (userId, name, quantite, unite, nom, image) => {

  try {

    // Effectuer la requête API pour ajouter l'ingrédient avec les détails du supermarché

    const response = await axios.post(`${API_URL}/auth/shopping-list/add`, {

      userId,

      ingredientName: name,

      quantity: quantite,

      unit: unite,

      supermarcheNom: nom, // Nom du supermarché

      supermarcheImage: image // Image du supermarché

    });

 

    // Si l'ajout est réussi, renvoyer la réponse

    return response.data;

  } catch (error) {

    console.error("Erreur lors de l'ajout à la liste de courses:", error);

    throw error;

  }

};




export const getShoppingList = async (userId) => {

  try {

    // Vérifiez si l'ID utilisateur est fourni

    if (!userId) {

      throw new Error('User ID is required');

    }

 

    // Effectuez l'appel API pour récupérer la liste des courses

    const response = await fetch(`${API_URL}/auth/shopping-list/${userId}`);

 

    // Si la réponse n'est pas correcte, lancez une erreur

    if (!response.ok) {

      throw new Error('Failed to fetch shopping list');

    }

 

    // Analysez et renvoyez les données JSON (les ingrédients de la liste de courses)

    const shoppingList = await response.json();

    return shoppingList;

  } catch (error) {

    console.error('Error fetching shopping list:', error);

    throw error; // Relancez l'erreur afin qu'elle puisse être gérée par l'appelant

  }

};






export const addIngredientToShoppingList = async (userId, ingredient) => {

  try {

    const response = await fetch(`${API_URL}/auth/shopping-list/${userId}`, {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

      },

      body: JSON.stringify(ingredient),

    });

 

    if (!response.ok) {

      throw new Error('Erreur lors de l’ajout de l’ingrédient');

    }

 

    const newIngredient = await response.json();

    return newIngredient;

  } catch (error) {

    console.error('Erreur lors de l’ajout de l’ingrédient:', error);

    throw error;

  }

};







export const resetShoppingList = async (userId) => {

  try {

    // Vérifiez si l'ID utilisateur est fourni

    if (!userId) {

      throw new Error('User ID is required');

    }

 

    // Effectuez la requête DELETE vers l'API

    const response = await fetch(`${API_URL}/auth/shopping-list/${userId}`, {

      method: 'DELETE',

    });

 

    // Si la réponse n'est pas correcte, levez une erreur

    if (!response.ok) {

      throw new Error('Erreur lors de la réinitialisation de la liste des courses');

    }

 

    // Analysez et renvoyez les données de la réponse

    const result = await response.json();

    return result;

  } catch (error) {

    console.error('Erreur lors de la réinitialisation de la liste des courses:', error);

    throw error;

  }

};





export const deleteIngredientFromShoppingList = async (userId, itemId) => { // Remplacer ingredientId par itemId

  try {

    const response = await fetch(`${API_URL}/auth/shopping-list/${userId}/${itemId}`, {  // Utiliser itemId ici

      method: 'DELETE',

    });

 

    if (!response.ok) {

      throw new Error('Erreur lors de la suppression de l’ingrédient');

    }

 

    const updatedList = await response.json();

    return updatedList; // Retourne la liste mise à jour

  } catch (error) {

    console.error('Erreur lors de la suppression de l’ingrédient:', error);

    throw error;

  }

};

 

export const getSupermarcheByName = async (supermarcheName) => {

  try {

    const response = await axios.get(`${API_URL}/supermarches`, {

      params: { nom: supermarcheName },  // Passer le nom du supermarché comme paramètre

    });

 

    // Vérification de la réponse

    if (response.data && response.data.length > 0) {

      return {

        nom: response.data[0].nom,

        adresse: response.data[0].adresse,

        image: response.data[0].image,  // L'image est facultative

      };

    } else {

      throw new Error('Supermarché non trouvé');

    }

  } catch (error) {

    console.error('Erreur lors de la récupération du supermarché :', error);

    throw error;

  }

};

 

export const getAllSupermarches = async () => {

  try {

    const response = await axios.get(`${API_URL}/supermarches`);

    console.log('Supermarchés récupérés:', response.data);  // Vérifiez la réponse

    return response.data; // Retourne la liste des supermarchés

  } catch (error) {

    console.error('Erreur lors de la récupération des supermarchés:', error);

    throw new Error('Erreur serveur');  // Propager l'erreur

  }

};

 

export const getTrimestreByUser = async (userId) => {

  try {

    const url = `${API_URL}/formulaireDynamique/user/${userId}`;

    console.log('Fetching trimestre data from URL:', url); // Log the full URL

    const response = await axios.get(url);

    return response.data.trimestre;

  } catch (error) {

    console.error('Error fetching trimestre data:', error);

    if (error.response) {

      console.error('Response data:', error.response.data);

      console.error('Response status:', error.response.status);

      console.error('Response headers:', error.response.headers);

    } else if (error.request) {

      console.error('Request data:', error.request);

    } else {

      console.error('Error message:', error.message);

    }

    throw error;

  }

};

 

export const createMeal = async (mealData) => {

  const response = await axios.post(`${API_URL}/meals`, mealData);

  return response.data;

};

 

export const updateMealItems = async (mealId, items) => {

  const response = await axios.patch(`${API_URL}/meals/${mealId}/items`, { items });

  return response.data;

};

 

export const getMealsByUser = async (userId) => {

  const response = await axios.get(`${API_URL}/meals/user/${userId}`);

  return response.data;

};

 

export const getFormulaireTrimestreById = async (userId) => {

  try {

    const response = await axios.get(`${API_URL}/formulaireDynamique/${userId}/trimestre`);

    console.log(response)

    console.log(response.data)

    return response.data;

  } catch (error) {

    console.error("Error fetching trimestre by ID:", error);

    throw error;

  }

};