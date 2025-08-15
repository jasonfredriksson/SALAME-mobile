import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Award, Shield, CheckCircle, Star } from 'lucide-react-native';

interface QualificationProps {
  isFirstPurchase?: boolean;
  verifiedSeller?: boolean;
  rating?: number;
  totalSales?: number;
  totalPurchases?: number;
  isSalamePay?: boolean;
}

export const UserQualifications = ({
  isFirstPurchase = false,
  verifiedSeller = false,
  rating = 0,
  totalSales = 0,
  totalPurchases = 0,
  isSalamePay = false,
}) => {
  // Calculate qualification level based on activity
  const getQualificationLevel = () => {
    const total = totalSales + totalPurchases;
    if (total >= 100) return 'Experto';
    if (total >= 50) return 'Avanzado';
    if (total >= 10) return 'Intermedio';
    return 'Principiante';
  };

  const qualificationLevel = getQualificationLevel();

  return (
    <View style={styles.container}>
      {/* Qualification badges */}
      <View style={styles.badgeRow}>
        {verifiedSeller && (
          <View style={styles.badge}>
            <Shield size={16} color="#6B46C1" />
            <Text style={styles.badgeText}>Vendedor verificado</Text>
          </View>
        )}
        
        {isSalamePay && (
          <View style={styles.badge}>
            <Award size={16} color="#6B46C1" />
            <Text style={styles.badgeText}>Salame Pay</Text>
          </View>
        )}
        
        {isFirstPurchase && (
          <View style={styles.badge}>
            <CheckCircle size={16} color="#6B46C1" />
            <Text style={styles.badgeText}>Primera compra</Text>
          </View>
        )}
      </View>

      {/* Rating and activity level */}
      <View style={styles.statsRow}>
        {rating > 0 && (
          <View style={styles.ratingContainer}>
            <Star size={16} color="#FFB800" fill="#FFB800" />
            <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
          </View>
        )}
        
        <View style={[styles.levelBadge, getStyleForLevel(qualificationLevel)]}>
          <Text style={styles.levelText}>{qualificationLevel}</Text>
        </View>
      </View>

      {/* Activity counts */}
      {(totalSales > 0 || totalPurchases > 0) && (
        <View style={styles.activityRow}>
          {totalSales > 0 && (
            <Text style={styles.activityText}>
              Ventas: {totalSales}
            </Text>
          )}
          
          {totalPurchases > 0 && (
            <Text style={styles.activityText}>
              Compras: {totalPurchases}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const getStyleForLevel = (level: string) => {
  switch (level) {
    case 'Experto':
      return styles.expertLevel;
    case 'Avanzado':
      return styles.advancedLevel;
    case 'Intermedio':
      return styles.intermediateLevel;
    default:
      return styles.beginnerLevel;
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#6B46C1',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  expertLevel: {
    backgroundColor: '#FEF3C7',
  },
  advancedLevel: {
    backgroundColor: '#E0F2FE',
  },
  intermediateLevel: {
    backgroundColor: '#DCFCE7',
  },
  beginnerLevel: {
    backgroundColor: '#F3F4F6',
  },
  activityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  activityText: {
    fontSize: 12,
    color: '#64748B',
  },
});
