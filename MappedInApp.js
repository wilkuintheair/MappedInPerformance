import React, {useRef} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {labelThemes, MiMapView} from '@mappedin/react-native-sdk';
import {mapOptions} from './app.json';

export const labelAppearance = {
  appearance: {
    margin: 50,
    text: {
      ...labelThemes.lightOnDark.text,
      backgroundColor: 'black',
    },
    marker: {
      size: 10,
      foregroundColor: {
        active: 'white',
        inactive: 'rgba(255, 255, 255, 0.2)',
      },
      backgroundColor: {
        active: 'black',
        inactive: 'rgba(0, 0, 0, 0.2)',
      },
    },
  },
};

const MappedInApp = () => {
  const ref = useRef();

  const focusOnFastFood = async () => {
    const yogurtland = ref.current?.venueData?.locations?.find(
      ({id}) => id === '5ab11b7a4bd0ef096a000004',
    );
    const polygon = yogurtland.polygons[0];
    /* await */ ref.current?.focusOn({polygons: [polygon]}); // it works fine if we put await here
    ref.current?.setPolygonColor(polygon, 'blue');
  };

  const onDataLoaded = () => {
    ref.current?.labelAllLocations({...labelAppearance});
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <MiMapView
          style={styles.map}
          options={mapOptions}
          ref={ref}
          onDataLoaded={onDataLoaded}
        />
        <View>
          <ScrollView horizontal>
            <Button
              title={'Check black label issue'}
              onPress={focusOnFastFood}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
});

export default MappedInApp;
