import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

interface PlayProps {
  size?: number;
  color?: string;
}

export const Play: React.FC<PlayProps> = ({ size = 24, color = 'currentColor' }) => (
  <MaterialCommunityIcons name="play" size={size} color={color} />
);