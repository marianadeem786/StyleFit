import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Image,
  Linking
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'; // Ensure this is properly set

export default function GlobalStoreScreen({ navigation }) {
  const [genderFilter, setGenderFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [storeFilter, setStoreFilter] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Async function to fetch session ID from AsyncStorage
  const getSessionId = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('session_id'); // Assuming session ID is saved as 'session_id'
      return sessionId;
    } catch (error) {
      console.error('Failed to fetch session ID:', error);
      return null;
    }
  };

  // Function to fetch products based on filters
  const fetchProducts = async () => {
    setLoading(true);

    const sessionId = await getSessionId();
    if (!sessionId) {
      Alert.alert('Error', 'Session ID not found.');
      setLoading(false);
      return;
    }

    const filters = {
      session_id: sessionId,
      name: searchTerm,
      store: storeFilter,
      category: categoryFilter,
      gender: genderFilter,
      order: priceOrder
    };

    try {
      const response = await fetch(`${config.BACKEND_URL}/api/advanced_search_view/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data.results || []);
      } else {
        Alert.alert('Error', data.error || 'Failed to fetch products.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [genderFilter, categoryFilter, storeFilter, priceOrder, searchTerm]); // Re-fetch products when filters change

  const openURL = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error('Failed to open URL:', err));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Filters */}
      <View style={styles.filtersContainer}>
        <Text style={styles.filterTitle}>Filters</Text>
        
        {/* Gender Filter */}
        <TouchableOpacity
          style={[styles.filterButton, genderFilter ? styles.filterButtonSelected : {}]}
          onPress={() => setGenderFilter(genderFilter === 'mens' ? '' : 'mens')}
        >
          <Text style={styles.filterButtonText}>Men</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, genderFilter === 'womens' ? styles.filterButtonSelected : {}]}
          onPress={() => setGenderFilter(genderFilter === 'womens' ? '' : 'womens')}
        >
          <Text style={styles.filterButtonText}>Women</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, genderFilter === 'unisex' ? styles.filterButtonSelected : {}]}
          onPress={() => setGenderFilter(genderFilter === 'unisex' ? '' : 'unisex')}
        >
          <Text style={styles.filterButtonText}>Unisex</Text>
        </TouchableOpacity>

        {/* Category Filter */}
        <TouchableOpacity
          style={[styles.filterButton, categoryFilter === 'top' ? styles.filterButtonSelected : {}]}
          onPress={() => setCategoryFilter(categoryFilter === 'top' ? '' : 'top')}
        >
          <Text style={styles.filterButtonText}>Top Wear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, categoryFilter === 'bottom' ? styles.filterButtonSelected : {}]}
          onPress={() => setCategoryFilter(categoryFilter === 'bottom' ? '' : 'bottom')}
        >
          <Text style={styles.filterButtonText}>Bottom Wear</Text>
        </TouchableOpacity>

        {/* Price Order Filter */}
        <TouchableOpacity
          style={[styles.filterButton, priceOrder === 'low' ? styles.filterButtonSelected : {}]}
          onPress={() => setPriceOrder(priceOrder === 'low' ? '' : 'low')}
        >
          <Text style={styles.filterButtonText}>Low to High</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, priceOrder === 'high' ? styles.filterButtonSelected : {}]}
          onPress={() => setPriceOrder(priceOrder === 'high' ? '' : 'high')}
        >
          <Text style={styles.filterButtonText}>High to Low</Text>
        </TouchableOpacity>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      </View>

      {/* Load products */}
      {loading ? (
        <Text style={styles.loadingText}>Loading products...</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {/* Product Image */}
              <Image source={{ uri: item.images[0] }} style={styles.productImage} />

              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>PKR{item.price}</Text>
              <TouchableOpacity
                style={styles.productLink}
                onPress={() => openURL(item.url)}>
                <Text style={styles.productLinkText}>View</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5DC',
    padding: 16,
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#4d6a72',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 4,
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#50808E',
  },
  filterButtonText: {
    color: '#333',
    fontFamily: 'Montserrat-Regular',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 14,
    color: '#50808E',
    marginTop: 5,
  },
  productLink: {
    marginTop: 10,
  },
  productLinkText: {
    color: '#50808E',
    fontWeight: 'bold',
  },
});
