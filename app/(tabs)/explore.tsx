import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { GradientBackground } from '../../components/GradientBackground';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import { deleteRule, loadRules } from '../../utils/storage';

interface Rule {
  id: string;
  name: string;
  keywords: string;
  replies: string;
  createdAt: string;
}

export default function RulesScreen() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRulesData();
  }, []);

  // Refresh rules when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRulesData();
    }, [])
  );

  const loadRulesData = async () => {
    try {
      const loadedRules = await loadRules();
      setRules(loadedRules);
    } catch (error) {
      console.error('Error loading rules:', error);
      Alert.alert('Error', 'Failed to load rules');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRule = async (ruleId: string, ruleName: string) => {
    Alert.alert(
      'Delete Rule',
      `Are you sure you want to delete "${ruleName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedRules = await deleteRule(ruleId);
              setRules(updatedRules);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete rule');
            }
          },
        },
      ]
    );
  };

  const handleEditRule = (rule: Rule) => {
    router.push({
      pathname: '/modal',
      params: {
        mode: 'edit',
        ruleId: rule.id,
        ruleName: rule.name,
        keywords: rule.keywords,
        replies: rule.replies,
      },
    });
  };

  const renderRuleItem = ({ item }: { item: Rule }) => {
    const keywordCount = item.keywords ? item.keywords.split(',').length : 0;
    const replyCount = item.replies ? item.replies.split('\n').filter(r => r.trim()).length : 0;

    return (
      <Card style={styles.ruleItem} padding="lg">
        <View style={styles.ruleHeader}>
          <View style={styles.ruleIcon}>
            <Ionicons name="document-text" size={24} color={Colors.primary} />
          </View>
          <View style={styles.ruleContent}>
            <Text style={styles.ruleName}>{item.name}</Text>
            <View style={styles.ruleStats}>
              <View style={styles.statBadge}>
                <Text style={styles.statText}>{keywordCount} keywords</Text>
              </View>
              <View style={[styles.statBadge, styles.statBadgeSecondary]}>
                <Text style={styles.statText}>{replyCount} replies</Text>
              </View>
            </View>
          </View>
        </View>
        
        {item.keywords && (
          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Keywords:</Text>
            <Text style={styles.previewText} numberOfLines={2}>
              {item.keywords}
            </Text>
          </View>
        )}
        
        <View style={styles.ruleActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditRule(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={18} color={Colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteRule(item.id, item.name)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={18} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <LinearGradient
        colors={[Colors.primary + '20', Colors.primary + '10']}
        style={styles.emptyIconContainer}
      >
        <Ionicons name="document-text-outline" size={64} color={Colors.primary} />
      </LinearGradient>
      <Text style={styles.emptyTitle}>No Rules Yet</Text>
      <Text style={styles.emptyText}>
        Create your first rule to start automating X engagement with custom keywords and replies
      </Text>
      <Button
        title="Create First Rule"
        onPress={() => router.push('/modal')}
        variant="primary"
        icon={<Ionicons name="add" size={20} color={Colors.textInverse} />}
        style={styles.createButton}
      />
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <GradientBackground style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading rules...</Text>
          </View>
        </GradientBackground>
      </SafeAreaView>
    );
  }

  return (
      <GradientBackground>
        <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={Colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <Ionicons name="library" size={28} color={Colors.textInverse} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Rules Management</Text>
                <Text style={styles.headerSubtitle}>{rules.length} rule{rules.length !== 1 ? 's' : ''} configured</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/modal')}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={24} color={Colors.textInverse} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <FlatList
          data={rules}
          renderItem={renderRuleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyComponent}
        />
        </View>
      </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    fontWeight: '500',
  },
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    paddingTop: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  ruleItem: {
    marginBottom: Spacing.md,
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  ruleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  ruleContent: {
    flex: 1,
  },
  ruleName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  ruleStats: {
    flexDirection: 'row',
  },
  statBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  statBadgeSecondary: {
    backgroundColor: Colors.accent + '20',
  },
  statText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text,
    fontWeight: '600',
  },
  previewContainer: {
    marginBottom: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  previewLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
  },
  previewText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  ruleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  editButton: {
    backgroundColor: Colors.primary + '20',
  },
  deleteButton: {
    backgroundColor: Colors.error + '20',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.md,
    marginBottom: Spacing.xl,
  },
  createButton: {
    marginTop: Spacing.md,
  },
});
