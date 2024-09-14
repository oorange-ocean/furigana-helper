import React from 'react';

import { View } from '@/ui';

import { PlayControl } from './play-control';
import { SingleLineRepeat } from './single-line-repeat';

export function SongBottom() {
  return (
    <View>
      <PlayControl />
      <SingleLineRepeat />
    </View>
  );
}