import React from 'react';
import Svg, { Line } from 'react-native-svg';

const RouteDrawer = ({ route, points }) => {
  if (!route || !points) return null;

  const origin = points.find(p => p.id === route.origin);
  const destination = points.find(p => p.id === route.destination);

  if (!origin || !destination) return null;

  return (
    <Svg height="100%" width="100%" style={{ position: 'absolute' }}>
      <Line
        x1={origin.left + origin.width / 2}
        y1={origin.top + origin.height / 2}
        x2={destination.left + destination.width / 2}
        y2={destination.top + destination.height / 2}
        stroke="blue"
        strokeWidth="5"
      />
    </Svg>
  );
};

export default RouteDrawer;