import React, { useCallback, useEffect,useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { colors } from '@/constants/tokens';
import { PinIcon } from '@/ui/icons/pin';

interface AutoScrollControlProps {
  isAutoScrollEnabled: boolean;
  toggleAutoScroll: () => void;
  size?: number;
  color?: string;
}

export const AutoScrollControl: React.FC<AutoScrollControlProps> = ({
  isAutoScrollEnabled,
  toggleAutoScroll,
  size = 24,
  color = colors.primary
}) => {
  const [localIsAutoScrollEnabled, setLocalIsAutoScrollEnabled] = useState(isAutoScrollEnabled);

  useEffect(() => {
    setLocalIsAutoScrollEnabled(isAutoScrollEnabled);
  }, [isAutoScrollEnabled]);

  const handleToggleAutoScroll = useCallback(() => {
    setLocalIsAutoScrollEnabled(prev => !prev);
    // 使用 setTimeout 来延迟执行 toggleAutoScroll
    setTimeout(toggleAutoScroll, 0);
  }, [toggleAutoScroll]);

  return (
    <TouchableOpacity onPress={handleToggleAutoScroll}>
      <PinIcon
        size={size}
        color={localIsAutoScrollEnabled ? color : colors.textMuted}
      />
    </TouchableOpacity>
  );
};