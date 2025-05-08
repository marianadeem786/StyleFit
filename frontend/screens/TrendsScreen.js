import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    gender: [],
  });

  const updateFilter = (type, value) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: value }));
  };

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
      <Text style={styles.description}>
        See the hottest market trends
      </Text>

      {/* Gender Buttons */}
      <FilterOption
        label=""
        options={['mens', 'womens']}
        selected={selectedFilters.gender}
        setSelected={(val) => updateFilter('gender', val)}
        singleSelect={true}
      />
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
});
