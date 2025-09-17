import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { GradientBackground } from '../components/GradientBackground';
import { BorderRadius, Colors, Spacing, Typography } from '../constants/theme';
import { addRule, updateRule } from '../utils/storage';

export default function RuleEditorScreen() {
  const params = useLocalSearchParams();
  const isEditMode = params.mode === 'edit';
  
  const [ruleName, setRuleName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [replies, setReplies] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setRuleName(params.ruleName?.toString() || '');
      setKeywords(params.keywords?.toString() || '');
      setReplies(params.replies?.toString() || '');
    }
  }, [isEditMode, params]);

  const validateForm = () => {
    if (!ruleName.trim()) {
      Alert.alert('Validation Error', 'Please enter a rule name');
      return false;
    }
    
    if (!keywords.trim()) {
      Alert.alert('Validation Error', 'Please enter at least one keyword');
      return false;
    }
    
    if (!replies.trim()) {
      Alert.alert('Validation Error', 'Please enter at least one reply');
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const ruleData = {
        name: ruleName.trim(),
        keywords: keywords.trim(),
        replies: replies.trim(),
      };
      
      if (isEditMode) {
        await updateRule(params.ruleId?.toString() || '', ruleData);
        Alert.alert('Success', 'Rule updated successfully');
      } else {
        await addRule(ruleData);
        Alert.alert('Success', 'Rule created successfully');
      }
      
      router.back();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to save rule: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (ruleName || keywords || replies) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
      <GradientBackground>
        <KeyboardAvoidingView 
          style={styles.container} 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        {/* Header */}
        <LinearGradient
          colors={Colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color={Colors.textInverse} />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>
                {isEditMode ? 'Edit Rule' : 'New Rule'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {isEditMode ? 'Modify your automation rule' : 'Create a new automation rule'}
              </Text>
            </View>
            
            <Button
              title={isLoading ? 'Saving...' : 'Save'}
              onPress={handleSave}
              disabled={isLoading}
              variant="secondary"
              size="small"
              loading={isLoading}
            />
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rule Name Section */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="pricetag" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Rule Name</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Give your rule a descriptive name to easily identify its purpose
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Crypto Project Replies"
              placeholderTextColor={Colors.textMuted}
              value={ruleName}
              onChangeText={setRuleName}
              maxLength={50}
            />
            <Text style={styles.helperText}>
              {ruleName.length}/50 characters
            </Text>
          </Card>

          {/* Keywords Section */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="search" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Keywords</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Enter keywords separated by commas. Posts containing any of these keywords will trigger this rule.
            </Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="bitcoin, crypto, blockchain, web3, defi..."
              placeholderTextColor={Colors.textMuted}
              value={keywords}
              onChangeText={setKeywords}
              multiline
              maxLength={500}
            />
            <View style={styles.helperRow}>
              <Text style={styles.helperText}>
                {keywords.split(',').filter(k => k.trim()).length} keywords
              </Text>
              <Text style={styles.helperText}>
                {keywords.length}/500 characters
              </Text>
            </View>
          </Card>

          {/* Replies Section */}
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="chatbubbles" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Replies</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Enter replies, one per line. The bot will randomly select from these when commenting.
            </Text>
            <TextInput
              style={[styles.textInput, styles.repliesInput]}
              placeholder="Great project! 🚀&#10;Looking forward to this!&#10;Exciting times ahead!&#10;This is the future!"
              placeholderTextColor={Colors.textMuted}
              value={replies}
              onChangeText={setReplies}
              multiline
              textAlignVertical="top"
              maxLength={2000}
            />
            <View style={styles.helperRow}>
              <Text style={styles.helperText}>
                {replies.split('\n').filter(r => r.trim()).length} replies
              </Text>
              <Text style={styles.helperText}>
                {replies.length}/2000 characters
              </Text>
            </View>
          </Card>

          {/* Preview Section */}
          <Card style={StyleSheet.flatten([styles.section, styles.lastSection])} variant="surface">
            <View style={styles.sectionHeader}>
              <Ionicons name="eye" size={20} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Preview</Text>
            </View>
            
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Rule Name</Text>
              <Text style={styles.previewValue}>
                {ruleName || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Keywords ({keywords.split(',').filter(k => k.trim()).length})</Text>
              <Text style={styles.previewValue}>
                {keywords || 'Not set'}
              </Text>
            </View>
            
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>Sample Replies</Text>
              {replies.split('\n').filter(r => r.trim()).slice(0, 3).map((reply, index) => (
                <Text key={index} style={styles.previewReply}>
                  • {reply.trim()}
                </Text>
              ))}
              {replies.split('\n').filter(r => r.trim()).length > 3 && (
                <Text style={styles.previewMore}>
                  +{replies.split('\n').filter(r => r.trim()).length - 3} more replies...
                </Text>
              )}
              {replies.split('\n').filter(r => r.trim()).length === 0 && (
                <Text style={styles.previewValue}>No replies set</Text>
              )}
            </View>
          </Card>
        </ScrollView>
        </KeyboardAvoidingView>
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
  header: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerContent: {
    paddingTop: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.textInverse,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  lastSection: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  sectionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Spacing.md,
  },
  textInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  repliesInput: {
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  previewCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  previewLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  previewValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  previewReply: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    paddingLeft: Spacing.md,
  },
  previewMore: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
});
