import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import Card from '../../components/Card';
import Header from './Header';

const RecipesScreen = (navigation) => {
    const recipes = [
        { id: '1', title: 'Pumpkin Soup', description: 'A warm and cozy recipe.' },
        { id: '2', title: 'Avocado Toast', description: 'Simple and delicious.' },
    ];

    return (
        <View style={styles.container}>
            <Header
                date="2 May, Monday"
                onMorePress={() => console.log('More button pressed')}
                navigation={navigation} // Pass navigation prop
            />
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Card title={item.title} description={item.description} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
});

export default RecipesScreen;
