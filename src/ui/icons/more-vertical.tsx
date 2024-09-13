import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle } from 'react-native-svg';

export const MoreVertical = ({ color = '#000000', ...props }: SvgProps) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Circle cx={12} cy={12} r={1} fill={color} />
    <Circle cx={12} cy={5} r={1} fill={color} />
    <Circle cx={12} cy={19} r={1} fill={color} />
  </Svg>
);