import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  textClassName?: string;
}

export const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  className = '',
  textClassName = '',
  ...props
}: ButtonProps) => {
  let baseClassName = '';
  let baseTextClassName = '';

  switch (variant) {
    case 'primary':
      baseClassName = 'bg-blue-500 rounded-md p-3 items-center';
      baseTextClassName = 'text-white font-semibold text-base';
      break;
    case 'secondary':
      baseClassName = 'bg-gray-500 rounded-md p-3 items-center';
      baseTextClassName = 'text-white font-semibold text-base';
      break;
    case 'outline':
      baseClassName = 'bg-transparent border border-blue-500 rounded-md p-3 items-center';
      baseTextClassName = 'text-blue-500 font-semibold text-base';
      break;
  }

  if (disabled || loading) {
    baseClassName += ' opacity-60';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={twMerge(baseClassName, className)}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3b82f6' : 'white'} size="small" />
      ) : (
        <Text className={twMerge(baseTextClassName, textClassName)}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
