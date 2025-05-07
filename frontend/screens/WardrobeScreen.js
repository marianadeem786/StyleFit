import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

const sampleUploads = []; // Change to [] to test empty state or add items

export default function WardrobeScreen({ navigation }) {
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
        <Text style={styles.title}>WARDROBE</Text>
      </View>

      {/* Action Row */}
<View style={styles.actionRow}>
  <View style={styles.actionItem}>
    <TouchableOpacity>
      <Image source={require('../assets/add.png')} style={styles.actionIcon} />
    </TouchableOpacity>
    <Text style={styles.actionLabel}>Add</Text>
  </View>

  <View style={{ flex: 1 }} />

  <View style={styles.actionItem}>
    <TouchableOpacity>
      <Image source={require('../assets/remove.png')} style={styles.actionIcon} />
    </TouchableOpacity>
    <Text style={styles.actionLabel}>Remove</Text>
  </View>
</View>


      {/* Uploaded items or Empty state */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {sampleUploads.length === 0 ? (
          <Text style={styles.emptyText}>Nothing uploaded yet, this page is empty</Text>
        ) : (
          <View style={styles.uploadGrid}>
            {sampleUploads.map((item, index) => (
              <View key={index} style={styles.uploadBox}>
                <View style={styles.imagePlaceholder}></View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFBEA',
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
    marginleft: 20,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    width: 28,
    height: 28,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionLabel: {
    marginTop: 4,
    fontSize: 14,
    color: '#4d6a72',
    fontWeight: '500',
  },
  
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  uploadBox: {
    width: '48%',
    height: 160,
    backgroundColor: '#ccc',
    marginBottom: 12,
    borderRadius: 10,
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: '#bbb',
    borderRadius: 10,
  },
});