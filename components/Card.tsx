import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  elevated?: boolean;
  variant?: 'default' | 'surface' | 'modal';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'md',
  elevated = true,
  variant = 'default',
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'surface':
        return Colors.surface;
      case 'modal':
        return Colors.modal;
      default:
        return Colors.card;
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: getBackgroundColor(),
          padding: Spacing[padding],
        },
        elevated && Shadows.medium,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
