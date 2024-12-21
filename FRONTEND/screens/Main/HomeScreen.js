import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Svg, Circle, G, LinearGradient, Stop, Defs } from 'react-native-svg';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient as RNLinearGradient } from 'expo-linear-gradient';
import { COLORS, getGradientColors, getMealColor } from '../../styles/colors';
import Header from './Header';
import { useUser } from '../../services/Usercontext';
import { getMealsByUser, getTrimestreByUser } from '../../services/apiService';


const CircularProgress = ({ eatenCalories, totalCalories }) => {
    const percentage = totalCalories > 0 ? (eatenCalories / totalCalories) * 100 : 0;
    const size = 200;
    const strokeWidth = 15;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressStrokeDashoffset = circumference - (percentage / 100) * circumference;

    return (


        <View style={styles.progressContainer}>
            <Svg width={size} height={size}>
                <Defs>
                    <LinearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={COLORS.gradients.circular.progress[0]} />
                        <Stop offset="1" stopColor={COLORS.gradients.circular.progress[1]} />
                    </LinearGradient>
                </Defs>
                <G rotation="-90" origin={center}>
                    <Circle
                        stroke={COLORS.gradients.circular.background}
                        fill="none"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <Circle
                        stroke="url(#progressGradient)"
                        fill="none"
                        cx={center}
                        cy={center}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={progressStrokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <View style={styles.progressContent}>
                <Text style={styles.caloriesText}>{eatenCalories}</Text>
                <Text style={styles.caloriesLabel}>of {totalCalories} Kcal</Text>
            </View>
        </View>
    );
};

const MealItem = ({ title, calories, recommended, items, isExpanded, onToggle, navigation }) => (
    <View style={[styles.mealItem, { borderLeftColor: title === 'Breakfast' || title === 'Dinner' ? '#006A6A' : '#FF8E6E' }]}>
        <TouchableOpacity style={styles.mealHeader} onPress={onToggle}>
            <View style={styles.mealContent}>
                <View style={styles.mealTitleContainer}>
                    <Text style={[styles.mealTitle, { color: title === 'Breakfast' || title === 'Dinner' ? '#006A6A' : '#FF8E6E' }]}>
                        {title}
                    </Text>
                    {calories && <Text style={styles.mealCalories}>{calories} Kcal</Text>}
                </View>
                <Text style={styles.recommendedText}>Recommended {recommended} Kcal</Text>
            </View>
            <TouchableOpacity
                onPress={() => navigation.navigate('Ingredients', {
                    category: title, //selon le bouton appuyé
                })}
            >
                <Feather name="plus" size={24} color="#006A6A" />
            </TouchableOpacity>
        </TouchableOpacity>
        {isExpanded && items && (
            <View style={styles.mealItems}>
                {items.map((item, index) => (
                    <View key={index} style={styles.mealItemRow}>
                        <Text style={styles.itemText}>{item.name} {item.quantity}</Text>
                        <Text style={styles.itemCalories}>{item.calories} Kcal</Text>
                    </View>
                ))}
            </View>
        )}
    </View>
);

const HomeScreen = ({ navigation }) => {
    const [expandedMeal, setExpandedMeal] = useState('Breakfast');
    const [meals, setMeals] = useState([]);
    const { userId } = useUser(); // Get the current user's ID

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mealsData] = await Promise.all([
                    getMealsByUser(userId),
                ]);
                setMeals(mealsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [userId]);

    const getMealData = (mealType) => {
        const meal = meals.find(meal => meal.mealType === mealType);
        return meal ? meal : { items: [], totalCalories: 0 };
    };

    const getRecommendedCalories = (mealType) => {
        const recommendations = {
            Breakfast: 450,
            Lunch: 600,
            Dinner: 600,
            Snack: 350,
        };

        return recommendations[mealType] || 0;
    };

    const eatenCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const totalCalories = Object.values({
        Breakfast: 450,
        Lunch: 600,
        Dinner: 600,
        Snack: 350,
    }).reduce((sum, calories) => sum + calories, 0);
    console.log(totalCalories);

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Header
                    navigation={navigation} // Pass navigation prop
                />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <CircularProgress eatenCalories={eatenCalories} totalCalories={totalCalories} />

                <Text style={styles.goalText}>{totalCalories}</Text>
                <Text style={styles.goalLabel}>Kcal Goal</Text>

                <View style={styles.mealsContainer}>
                    <View style={styles.mealsHeader}>
                        <Text style={styles.mealsTitle}>Daily meals</Text>
                        <View style={styles.expandButton}>
                            <Feather name="chevron-down" size={24} color="#fff" />
                        </View>
                    </View>


                    <MealItem
                        title="Breakfast"
                        calories={getMealData('Breakfast').totalCalories}
                        recommended={getRecommendedCalories('Breakfast')}
                        items={getMealData('Breakfast').items}
                        isExpanded={expandedMeal === 'Breakfast'}
                        onToggle={() => setExpandedMeal(expandedMeal === 'Breakfast' ? null : 'Breakfast')}
                        navigation={navigation}
                    />
                    <MealItem
                        title="Lunch"
                        calories={getMealData('Lunch').totalCalories}
                        recommended={getRecommendedCalories('Lunch')}
                        items={getMealData('Lunch').items}
                        isExpanded={expandedMeal === 'Lunch'}
                        onToggle={() => setExpandedMeal(expandedMeal === 'Lunch' ? null : 'Lunch')}
                        navigation={navigation}
                    />
                    <MealItem
                        title="Dinner"
                        calories={getMealData('Dinner').totalCalories}
                        recommended={getRecommendedCalories('Dinner')}
                        items={getMealData('Dinner').items}
                        isExpanded={expandedMeal === 'Dinner'}
                        onToggle={() => setExpandedMeal(expandedMeal === 'Dinner' ? null : 'Dinner')}
                        navigation={navigation}
                    />
                    <MealItem
                        title="Snack"
                        calories={getMealData('Snack').totalCalories}
                        recommended={getRecommendedCalories('Snack')}
                        items={getMealData('Snack').items}
                        isExpanded={expandedMeal === 'Snack'}
                        onToggle={() => setExpandedMeal(expandedMeal === 'Snack' ? null : 'Snack')}
                        navigation={navigation}
                    />

                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.ui.cardBackground,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        marginTop: 15,

    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.text.dark,
    },
    progressContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressContent: {
        position: 'absolute',
        alignItems: 'center',
    },
    caloriesText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    caloriesLabel: {
        fontSize: 14,
        color: COLORS.text.primary,
        marginTop: 4,
    },
    dots: {
        flexDirection: 'row',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.ui.dot.inactive,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: COLORS.ui.dot.active,
    },
    goalText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.text.dark,
    },
    goalLabel: {
        fontSize: 14,
        color: COLORS.text.light,
        textAlign: 'center',
        marginTop: 4,
    },
    mealsContainer: {
        marginTop: 20,
        backgroundColor: COLORS.primary.light,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    mealItem: {
        backgroundColor: COLORS.ui.cardBackground,
        borderRadius: 16,
        marginBottom: 15,
        borderLeftWidth: 4,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    mealHeader: {
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mealContent: {
        flex: 1,
    },
    mealTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    mealTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    mealCalories: {
        fontSize: 14,
        color: '#666',
    },
    recommendedText: {
        fontSize: 12,
        color: '#999',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    mealItems: {
        padding: 15,
        backgroundColor: '#fff',
    },
    mealItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemText: {
        fontSize: 14,
        color: '#666',
    },
    itemCalories: {
        fontSize: 14,
        color: '#666',
    },
});

export default HomeScreen;