import React, {useRef, useState} from 'react';
import {Button, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import {labelThemes, MiMapView} from '@mappedin/react-native-sdk';
import {mapOptions} from './app.json';

const MOCK_LOCATION = {
  timestamp: new Date().getTime(),
  coords: {
    latitude: 25.1975871,
    longitude: 55.2779951,
    accuracy: 1,
    floorLevel: 0,
  },
};

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

const YOGURTLAND = '5ab11b7a4bd0ef096a000004';
const FOOD_COURT = '5bec18aa4bd0ef050c000000';

const MappedInApp = () => {
  const ref = useRef();
  const [blueDot, setBlueDot] = useState();

  const findYogurtland = () => {
    return ref.current?.venueData?.locations?.find(({id}) => id === YOGURTLAND);
  };

  const focusOnFastFood = async () => {
    const yogurtland = findYogurtland();
    const polygon = yogurtland.polygons[0];
    /* await */ ref.current?.focusOn({polygons: [polygon]}); // it works fine if we put await here
    ref.current?.setPolygonColor(polygon, 'blue');
  };

  /**
   * This function takes too much time to execute. Here are some of my results from
   * running it on android emulator:
   * * ~20s when MOCKED_LOCATION's floorLevel is 0 and hermes disabled
   * * ~50s when MOCKED_LOCATION's floorLevel is 0 and hermes enabled
   * * ~4s when MOCKED_LOCATION's floorLevel is 1 and hermes enabled
   * * ~4s when MOCKED_LOCATION's floorLevel is 3 and hermes enabled
   * And results for iOS:
   * * 28s when MOCKED_LOCATION's floorLevel is 0 and hermes enabled
   */
  const checkFindNearest = () => {
    console.group('find nearest');

    const yogurtland = findYogurtland();
    const from = blueDot.nearestNode;

    const startTotal = new Date().getTime();
    let startTime = new Date().getTime();
    from.distanceTo(yogurtland.nodes[0]);
    let endTime = new Date().getTime();
    console.log('distanceTo Yogurtland [ms]:', endTime - startTime);

    startTime = new Date().getTime();
    const foodCourtNodes = findFoodCourtNodes(ref.current?.venueData);
    endTime = new Date().getTime();
    console.log('findFoodCourtNodes [ms]:', endTime - startTime);

    startTime = new Date().getTime();
    const nearest = findNearest(from, foodCourtNodes);
    endTime = new Date().getTime();
    console.log('findNearest [ms]:', endTime - startTime);

    startTime = new Date().getTime();
    from.directionsTo(nearest, {});
    endTime = new Date().getTime();
    console.log('directionsTo [ms]:', endTime - startTime);

    console.log('total time [ms]:', endTime - startTotal);

    console.groupEnd();
  };

  const onDataLoaded = () => {
    ref.current?.labelAllLocations({...labelAppearance});
    ref.current?.BlueDot.enable();
    ref.current?.overrideLocation({...MOCK_LOCATION});
  };

  const onBlueDotUpdated = ({update}) => {
    setBlueDot(update);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <MiMapView
          style={styles.map}
          options={mapOptions}
          ref={ref}
          onDataLoaded={onDataLoaded}
          onBlueDotUpdated={onBlueDotUpdated}
        />
        <View>
          <ScrollView horizontal>
            <Button
              title={'Check black label issue'}
              onPress={focusOnFastFood}
            />
            <Button
              title={'Check find nearest issue'}
              onPress={checkFindNearest}
            />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

const findFoodCourtNodes = venueData =>
  venueData?.locations?.find(({id}) => id === FOOD_COURT)?.nodes;

const findNearest = (from, nodes) => {
  const distances = nodes.map(node => ({
    node,
    distance: from.distanceTo(node, {}),
  }));
  return distances.reduce((prev, current) =>
    prev.distance < current.distance || current.distance === 0 ? prev : current,
  ).node;
};

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
});

export default MappedInApp;
