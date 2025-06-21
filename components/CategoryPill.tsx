import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

export type CategoryPillProps = {
  title: string;
  selected: boolean;
  onPress: () => void;
  key?: string; // Incluye la propiedad key opcional para uso en listas
};

export function CategoryPill({ title, selected, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[styles.pill, selected && styles.selectedPill]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, selected && styles.selectedPillText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    marginRight: 6,
    minWidth: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedPill: {
    backgroundColor: '#6B46C1',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666666',
  },
  selectedPillText: {
    color: '#FFFFFF',
  },
});