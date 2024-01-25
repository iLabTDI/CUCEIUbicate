import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBars, faUser, faSearch, faRoute } from '@fortawesome/free-solid-svg-icons';
import Svg, { Image as SvgImage } from 'react-native-svg';

export const HomePage = () => {
  const renderTopLeftMenu = () => {
    return (
      <View style={styles.topLeftContainer}>
        <TouchableOpacity style={styles.topLeftIcon}>
          <FontAwesomeIcon icon={faBars} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topLeftIcon}>
          <FontAwesomeIcon icon={faUser} size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderTopRightIcons = () => {
    return (
      <View style={styles.topRightIcons}>
        <TouchableOpacity style={styles.topRightIcon}>
          <FontAwesomeIcon icon={faSearch} size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.topRightIcon}>
          <FontAwesomeIcon icon={faRoute} size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Svg
            width={500}
            height={950}
            viewBox="0 0 500 950"
          >
            <SvgImage
              href={require('../assets/images/rayo.svg')}
              width={500}
              height={950}
            />
          </Svg>
          {renderTopLeftMenu()}
          {renderTopRightIcons()}
        </ScrollView>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topLeftContainer: {
    position: 'absolute',
    top: 60,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  topLeftIcon: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 60,
    marginLeft: 10,
  },
  topRightIcons: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  topRightIcon: {
    backgroundColor: 'blue',
    padding: 12,
    borderRadius: 60,
    marginLeft: 10,
  },
});
