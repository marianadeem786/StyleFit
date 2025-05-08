import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const storesList = [
  'Outfitters', 'Elo', 'Breakout', 'Cambridge', 'Monark',
  'ONE', 'Engine', 'Cougar', 'Aeronore', 'Lama', 'LeftoversDen'
];

const categoryMap = {
  Top: ['polo', 'formal', 'shirt', 'polo shirt', 't-shirt'],
  Bottom: ['trousers', 'jeans', 'shorts', 'chino', 'cargo', 'formal']
};

const sampleProducts = Array.from({ length: 12 }).map((_, index) => ({
  id: index.toString(),
  image: null,
}));

const FilterOption = ({ label, options = [], selected, setSelected, showIcon = false, expandable = false, singleSelect = false }) => {
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
      <TouchableOpacity style={styles.filterLabelRow} onPress={() => expandable && setExpanded(!expanded)}>
        <Text style={styles.filterLabel}>{label}</Text>
        {showIcon && <Image source={require('../assets/arrow.png')} style={styles.arrowIcon} />}
      </TouchableOpacity>
      {(!expandable || expanded) && options.map((option) => (
        <TouchableOpacity
          key={option}
          onPress={() => toggleOption(option)}
          style={[styles.filterButton, selected.includes(option) && styles.filterButtonSelected]}
        >
          <Text style={[styles.filterButtonText, selected.includes(option) && styles.filterButtonTextSelected]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function GlobalStoreScreen() {
  const navigation = useNavigation();
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    gender: [],
    category: [],
    store: [],
    order: [],
  });

  const updateFilter = (type, value) => {
    setSelectedFilters((prev) => ({ ...prev, [type]: value }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.productBox}>
      <View style={styles.imagePlaceholder}></View>
    </View>
  );

  const selectedSummary = Object.entries(selectedFilters)
    .flatMap(([_, value]) => Array.isArray(value) ? value : [])
    .filter(Boolean)
    .join(', ');

  return (
    <View style={styles.container}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/backicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image source={require('../assets/homeicon.png')} style={styles.navIcon} />
        </TouchableOpacity>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>GLOBAL STORE</Text>
      </View>

      {/* Filter Button */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButtonContainer} onPress={() => setFilterVisible(true)}>
          <Image source={require('../assets/filter.png')} style={styles.filterIcon} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {selectedSummary.length > 0 && (
        <Text style={styles.selectedFiltersText}>Selected: {selectedSummary}</Text>
      )}

      <FlatList
        data={sampleProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
      />

      {/* FILTER MODAL */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Filters</Text>
            <ScrollView>

              <FilterOption
                label="Gender"
                options={["mens", "womens"]}
                selected={selectedFilters.gender}
                setSelected={(val) => updateFilter("gender", val)}
                showIcon
                expandable
              />

              <FilterOption
                label="Category - Top"
                options={categoryMap.Top}
                selected={selectedFilters.category}
                setSelected={(val) => updateFilter("category", val)}
                showIcon
                expandable
              />

              <FilterOption
                label="Category - Bottom"
                options={categoryMap.Bottom}
                selected={selectedFilters.category}
                setSelected={(val) => updateFilter("category", val)}
                showIcon
                expandable
              />

              <FilterOption
                label="Store"
                options={storesList}
                selected={selectedFilters.store}
                setSelected={(val) => updateFilter("store", val)}
                showIcon
                expandable
              />

              <FilterOption
                label="Order"
                options={["Price: Low to High", "Price: High to Low"]}
                selected={selectedFilters.order}
                setSelected={(val) => updateFilter("order", val)}
                showIcon
                expandable
                singleSelect={true}
              />
            </ScrollView>

            <Pressable onPress={() => setFilterVisible(false)} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',  // Consistent with other screens
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  filterButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    padding: 6,
  },
  filterIcon: {
    width: 30,
    height: 30,
  },
  filterText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 4,
    color: '#4d6a72',
  },
  selectedFiltersText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
  productGrid: {
    marginTop: 10,
  },
  productBox: {
    width: '48%',
    height: 160,
    backgroundColor: '#ccc',
    margin: '1%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#bbb',
    borderRadius: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Montserrat-Bold',  // Consistent with other screens
    marginBottom: 10,
    textAlign: 'center',
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',  // Consistent with other screens
    marginRight: 8,
    color: '#4d6a72',  // Consistent with other screens
  },
  arrowIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  filterButton: {
    backgroundColor: '#eee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginVertical: 4,
  },
  filterButtonSelected: {
    backgroundColor: '#50808E',
  },
  filterButtonText: {
    color: '#333',
    fontFamily: 'Montserrat-Regular',  // Consistent with other screens
  },
  filterButtonTextSelected: {
    color: 'white',
  },
  applyButton: {
    backgroundColor: '#4d6a72',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    },
    });