import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';

interface PauseProps {
  size?: number;
  color?: string;
}

export const Pause: React.FC<PauseProps> = ({ size = 24, color = 'currentColor' }) => (
  <MaterialCommunityIcons name="pause" size={size} color={color} />
);