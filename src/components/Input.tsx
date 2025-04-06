import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { twMerge } from 'tailwind-merge';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export const Input = ({
  label,
  error,
  secureTextEntry = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  errorClassName = '',
  ...props
}: InputProps) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const finalSecureTextEntry = secureTextEntry && !isPasswordVisible;

  const togglePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  return (
    <View className={twMerge('mb-4', className)}>
      {label && (
        <Text className={twMerge('text-gray-700 mb-2 font-medium', labelClassName)}>
          {label}
        </Text>
      )}
      
      <View className="relative">
        <TextInput
          className={twMerge(
            'bg-white border border-gray-300 rounded-md p-3 text-base text-gray-800',
            error ? 'border-red-500' : '',
            secureTextEntry ? 'pr-10' : '',
            inputClassName
          )}
          secureTextEntry={finalSecureTextEntry}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            className="absolute right-3 top-3.5"
            onPress={togglePasswordVisibility}
          >
            <Feather 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color="#6b7280" 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className={twMerge('text-red-500 text-sm mt-1', errorClassName)}>
          {error}
        </Text>
      )}
    </View>
  );
};
