import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config'; // Your config file where BACKEND_URL is defined

const FilterOption = ({
  label,
  options = [],
  selected,
  setSelected,
  showIcon = false,
  expandable = false,
  singleSelect = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleOption = (option) => {
    if (singleSelect) {
      if (selected.includes(option)) {
        setSelected([]); // unselect if tapped again
      } else {
        setSelected([option]); // only one selected
      }
    } else {
      const alreadySelected = selected.includes(option);
      if (alreadySelected) {
        setSelected(selected.filter((item) => item !== option));
      } else {
        setSelected([...selected, option]);
      }
    }
  };

  return (
    <View style={styles.filterGroup}>
      <TouchableOpacity
        style={styles.filterLabelRow}
        onPress={() => expandable && setExpanded(!expanded)}
      >
        <Text style={styles.filterLabel}>{label}</Text>
        {showIcon && (
          <Image
            source={require('../assets/arrow.png')}
            style={styles.arrowIcon}
          />
        )}
      </TouchableOpacity>
      {(!expandable || expanded) &&
        options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => toggleOption(option)}
            style={[
              styles.filterButton,
              selected.includes(option) && styles.filterButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.filterButtonText,
                selected.includes(option) && styles.filterButtonTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default function TrendsScreen() {
  const navigation = useNavigation();
  const [selectedFilters, setSelectedFilters] = useState({
    gender: ['mens'],
  });
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateFilter = (type, value) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: value }));
  };

  const getSessionId = async () => {
    try {
      const sessionId = await AsyncStorage.getItem('session_id');
      return sessionId;
    } catch (error) {
      console.error('Failed to fetch session ID:', error);
      return null;
    }
  };

  const fetchTrendyOutfits = async () => {
  setLoading(true);
  const sessionId = await getSessionId();

  if (!sessionId) {
    Alert.alert('Error', 'Session ID not found');
    setLoading(false);
    return;
  }

  const requestData = {
    session_id: sessionId,
    gender: selectedFilters.gender[0],
  };

  try {
    const response = await fetch(`${config.BACKEND_URL}/api/trendy_outfits_view/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Send data as JSON
      },
      body: JSON.stringify(requestData), // Send the request as JSON
    });

    const responseText = await response.text(); // Get raw response as text

    if (!response.ok) {
      // If response is not OK, show the raw response for debugging
      Alert.alert('Error', `Server returned an error: ${response.status} - ${responseText}`);
      return;
    }

    let data;
    try {
      data = JSON.parse(responseText); // Try parsing as JSON
    } catch (error) {
      // Handle JSON parsing error
      Alert.alert('Error', 'Failed to parse response as JSON');
      console.error('JSON parse error:', error);
      return;
    }

    if (data.outfits && data.outfits.length > 0) {
      setOutfits(data.outfits); // Update state with the fetched outfits
    } else {
      Alert.alert('No outfits found', 'No trendy outfits available.');
    }
  } catch (error) {
    Alert.alert('Error', 'Error fetching trendy outfits.');
    console.error('Fetch error:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTrendyOutfits();
  }, [selectedFilters]);

  return (
    <View style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/backicon.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../assets/homeicon.png')}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TRENDS</Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>See the hottest market trends</Text>

      {/* Gender Buttons */}
      <FilterOption
        label="Gender"
        options={['mens', 'womens']}
        selected={selectedFilters.gender}
        setSelected={(val) => updateFilter('gender', val)}
        singleSelect={true}
      />

      {/* Outfits Section */}
      <ScrollView style={styles.outfitContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          outfits.map((outfit, index) => (
            <View key={index} style={styles.outfitCard}>
              <Text style={styles.outfitText}>Top: {outfit.top.name}</Text>
              <Text style={styles.outfitText}>Bottom: {outfit.bottom.name}</Text>
              <Image
                source={{ uri: outfit.top.images[0] }}
                style={styles.outfitImage}
              />
              <Image
                source={{ uri: outfit.bottom.images[0] }}
                style={styles.outfitImage}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    padding: 16,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  navIcon: {
    width: 28,
    height: 28,
    tintColor: '#4d6a72',
  },
  titleContainer: {
    backgroundColor: '#4d6a72',
    alignSelf: 'flex-start',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: '#4d6a72',
    marginBottom: 30,
  },
  filterGroup: {
    alignItems: 'center',
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#4d6a72',
  },
  arrowIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 10,
    width: '70%',
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#4d6a72',
  },
  filterButtonText: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'Montserrat-Bold',
  },
  filterButtonTextSelected: {
    color: 'white',
  },
  outfitContainer: {
    marginTop: 20,
  },
  outfitCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  outfitText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    color: '#333',
  },
  outfitImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
    marginTop: 10,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#4d6a72',
  },
});
