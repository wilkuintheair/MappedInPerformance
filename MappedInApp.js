import React, {useCallback, useRef} from 'react';
import {SafeAreaView} from 'react-native';
import {MiMapView} from '@mappedin/react-native-sdk';
import {mapOptions} from './app.json';

const MappedInApp = () => {
  const startTime = useRef(Date.now());
  const mapView = React.useRef(null);
  const onFirstMapLoaded = useCallback(() => {
    console.log('Map loaded in:', Date.now() - startTime.current);
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <MiMapView
        style={{flex: 1}}
        key="mappedin"
        ref={mapView}
        options={mapOptions}
        onFirstMapLoaded={onFirstMapLoaded}
      />
    </SafeAreaView>
  );
};

export default MappedInApp;
