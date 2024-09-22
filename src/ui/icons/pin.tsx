import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

interface PinIconProps {
  size?: number;
  color?: string;
}

export const PinIcon: React.FC<PinIconProps> = ({ size = 24, color = 'currentColor' }) => (
  <MaterialCommunityIcons name="pin" size={size} color={color} />
);

export default PinIcon;