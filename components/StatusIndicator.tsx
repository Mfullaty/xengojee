import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/theme';

interface StatusIndicatorProps {
  status: 'running' | 'stopped' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'medium',
  animated = true,
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animated && status === 'running') {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();
    }
  }, [animated, status, pulseAnim]);

  const getColor = () => {
    switch (status) {
      case 'running':
        return Colors.success;
      case 'stopped':
        return Colors.textMuted;
      case 'error':
        return Colors.error;
      case 'warning':
        return Colors.warning;
      default:
        return Colors.textMuted;
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };

  const indicatorSize = getSize();

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: indicatorSize,
            height: indicatorSize,
            backgroundColor: getColor(),
            transform: animated && status === 'running' ? [{ scale: pulseAnim }] : [],
          },
        ]}
      />
      {status === 'running' && (
        <View
          style={[
            styles.ring,
            {
              width: indicatorSize * 2,
              height: indicatorSize * 2,
              borderColor: getColor(),
              opacity: 0.3,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    borderRadius: 999,
    zIndex: 2,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 1,
  },
});
