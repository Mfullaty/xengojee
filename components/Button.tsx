import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.small,
    };

    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = Spacing.md;
        baseStyle.paddingVertical = Spacing.sm;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingHorizontal = Spacing.xl;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingHorizontal = Spacing.lg;
        baseStyle.paddingVertical = Spacing.md;
        baseStyle.minHeight = 48;
    }

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (size) {
      case 'small':
        baseTextStyle.fontSize = Typography.fontSize.sm;
        break;
      case 'large':
        baseTextStyle.fontSize = Typography.fontSize.lg;
        break;
      default:
        baseTextStyle.fontSize = Typography.fontSize.md;
    }

    switch (variant) {
      case 'primary':
        baseTextStyle.color = Colors.textInverse;
        break;
      case 'secondary':
        baseTextStyle.color = Colors.text;
        break;
      case 'outline':
        baseTextStyle.color = Colors.primary;
        break;
      case 'ghost':
        baseTextStyle.color = Colors.primary;
        break;
      case 'danger':
        baseTextStyle.color = Colors.text;
        break;
      default:
        baseTextStyle.color = Colors.text;
    }

    return baseTextStyle;
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.textInverse : Colors.primary}
          style={{ marginRight: icon || title ? Spacing.sm : 0 }}
        />
      )}
      {icon && !loading && (
        <Text style={{ marginRight: title ? Spacing.sm : 0 }}>{icon}</Text>
      )}
      {title && (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[getButtonStyle(), style]}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={Colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: BorderRadius.md },
          ]}
        />
        {renderContent()}
      </TouchableOpacity>
    );
  }

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return Colors.surface;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      case 'danger':
        return Colors.error;
      default:
        return Colors.primary;
    }
  };

  const getBorderStyle = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 2,
        borderColor: Colors.primary,
      };
    }
    return {};
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getButtonStyle(),
        { backgroundColor: getBackgroundColor() },
        getBorderStyle(),
        style,
      ]}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};
