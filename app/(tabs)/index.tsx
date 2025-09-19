import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { GradientBackground } from '../../components/GradientBackground';
import { StatusIndicator } from '../../components/StatusIndicator';
import { BorderRadius, Colors, Spacing, Typography } from '../../constants/theme';
import AutomationService from '../../services/AutomationService';
import { loadRules } from '../../utils/storage';

interface Rule {
  id: string;
  name: string;
  keywords: string;
  replies: string;
  createdAt: string;
}

interface LogEntry {
  id: number;
  message: string;
  timestamp: string;
}

export default function HomeScreen() {
  const [isServiceRunning, setIsServiceRunning] = useState(false);
  const [serviceStatus, setServiceStatus] = useState('Checking...');
  const [rules, setRules] = useState<Rule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    initializeApp();
    setupEventListeners();
    
    return () => {
      AutomationService.removeAllListeners();
    };
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
    }
  };

  const initializeApp = async () => {
    try {
      await loadRulesData();
      
      const status = await AutomationService.getStatus();
      setIsServiceRunning(status === 'running');
      if (status === 'disabled') {
        setServiceStatus('Service Disabled');
      } else if (status === 'running') {
        setServiceStatus('Service Running');
      } else if (status === 'connected') {
        setServiceStatus('Service Connected');
      } else {
        setServiceStatus('Service Stopped');
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      setServiceStatus('Error checking status');
    }
  };

  const setupEventListeners = () => {
    AutomationService.addEventListener('serviceConnected', () => {
      addLog('Accessibility service connected');
    });

    AutomationService.addEventListener('automationStarted', () => {
      setIsServiceRunning(true);
      setServiceStatus('Service Running');
      addLog('Automation started');
    });

    AutomationService.addEventListener('automationStopped', () => {
      setIsServiceRunning(false);
      setServiceStatus('Service Stopped');
      addLog('Automation stopped');
    });

    AutomationService.addEventListener('postMatched', (data: any) => {
      addLog(`Post matched rule: ${data.rule}`);
    });

    AutomationService.addEventListener('postLiked', () => {
      addLog('Post liked');
    });

    AutomationService.addEventListener('commentPosted', (data: any) => {
      addLog(`Comment posted: ${data.reply}`);
    });

    AutomationService.addEventListener('error', (data: any) => {
      addLog(`Error: ${data.message}`);
    });
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [
      { id: Date.now(), message, timestamp },
      ...prevLogs.slice(0, 49) // Keep only last 50 logs
    ]);
  };

  const handleServiceToggle = async (value: boolean) => {
    if (value) {
      await startService();
    } else {
      await stopService();
    }
  };

  const startService = async () => {
    if (rules.length === 0) {
      Alert.alert('No Rules', 'Please create at least one rule before starting the service.');
      return;
    }

    setIsLoading(true);
    try {
      await AutomationService.start(rules);
      addLog('Service start requested');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to start service: ${errorMessage}`);
      addLog(`Failed to start service: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stopService = async () => {
    setIsLoading(true);
    try {
      await AutomationService.stop();
      addLog('Service stop requested');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Alert.alert('Error', `Failed to stop service: ${errorMessage}`);
      addLog(`Failed to stop service: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openAccessibilitySettings = async () => {
    try {
      await AutomationService.openAccessibilitySettings();
      Alert.alert(
        'Enable Accessibility Service',
        'Please find "X Engojee" in the accessibility services list and enable it.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to open accessibility settings');
    }
  };

  const getStatusType = (): 'running' | 'stopped' | 'error' | 'warning' => {
    if (serviceStatus.includes('Running')) return 'running';
    if (serviceStatus.includes('Disabled')) return 'warning';
    if (serviceStatus.includes('Error')) return 'error';
    if (serviceStatus.includes('Checking')) return 'warning';
    return 'stopped';
  };

  const getLogColor = (message: string) => {
    if (message.includes('Error') || message.includes('Failed')) return Colors.error;
    if (message.includes('started') || message.includes('connected')) return Colors.success;
    if (message.includes('matched') || message.includes('posted')) return Colors.primary;
    return Colors.textMuted;
  };

  return (
      <GradientBackground>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={Colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Ionicons name="flash" size={32} color={Colors.textInverse} />
            </View>
            <Text style={styles.title}>X Engojee</Text>
            <Text style={styles.subtitle}>Automated X Engagement</Text>
          </View>
        </LinearGradient>

        {/* Service Control Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="power" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Service Control</Text>
          </View>
          
          <View style={styles.serviceControl}>
            <View style={styles.serviceInfo}>
              <View style={styles.statusContainer}>
                <StatusIndicator 
                  status={getStatusType()} 
                  size="medium" 
                  animated={true}
                />
                <Text style={styles.statusText}>{serviceStatus}</Text>
              </View>
            </View>
            
            <View style={styles.switchContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Switch
                  value={isServiceRunning}
                  onValueChange={handleServiceToggle}
                  trackColor={{ false: Colors.surface, true: Colors.primary + '40' }}
                  thumbColor={isServiceRunning ? Colors.primary : Colors.textMuted}
                />
              )}
            </View>
          </View>

          <Button
            title="Enable Accessibility Service"
            onPress={openAccessibilitySettings}
            variant="outline"
            icon={<Ionicons name="settings-outline" size={20} color={Colors.primary} />}
            style={styles.settingsButton}
          />
        </Card>

        {/* Rules Summary */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="library-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Rules Summary</Text>
          </View>
          
          <View style={styles.rulesStats}>
            <View style={styles.statItem}>
              <LinearGradient
                colors={[Colors.primary + '20', Colors.primary + '10']}
                style={styles.statCard}
              >
                <Text style={styles.statNumber}>{rules.length}</Text>
                <Text style={styles.statLabel}>Total Rules</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statItem}>
              <LinearGradient
                colors={[Colors.accent + '20', Colors.accent + '10']}
                style={styles.statCard}
              >
                <Text style={styles.statNumber}>
                  {rules.reduce((acc, rule) => acc + (rule.keywords?.split(',').length || 0), 0)}
                </Text>
                <Text style={styles.statLabel}>Keywords</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.statItem}>
              <LinearGradient
                colors={[Colors.secondary + '20', Colors.secondary + '10']}
                style={styles.statCard}
              >
                <Text style={styles.statNumber}>
                  {rules.reduce((acc, rule) => acc + (rule.replies?.split('\n').filter((r: string) => r.trim()).length || 0), 0)}
                </Text>
                <Text style={styles.statLabel}>Replies</Text>
              </LinearGradient>
            </View>
          </View>
        </Card>

        {/* Activity Log */}
        <Card style={StyleSheet.flatten([styles.section, styles.lastSection])}>
          <View style={styles.sectionHeader}>
            <Ionicons name="pulse-outline" size={24} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Activity Log</Text>
          </View>
          
          <View style={styles.logContainer}>
            {logs.length === 0 ? (
              <View style={styles.emptyLogContainer}>
                <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.noLogsText}>No activity yet</Text>
                <Text style={styles.noLogsSubtext}>Start the service to see real-time logs</Text>
              </View>
            ) : (
              logs.map((log, index) => (
                <View key={log.id} style={[styles.logItem, { opacity: 1 - (index * 0.05) }]}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logTime}>{log.timestamp}</Text>
                    <View style={[styles.logDot, { backgroundColor: getLogColor(log.message) }]} />
                  </View>
                  <Text style={styles.logMessage}>{log.message}</Text>
                </View>
              ))
            )}
          </View>
        </Card>
        </ScrollView>
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
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: '800',
    color: Colors.textInverse,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  lastSection: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: Spacing.md,
  },
  serviceControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  serviceInfo: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text,
    marginLeft: Spacing.md,
    fontWeight: '500',
  },
  switchContainer: {
    marginLeft: Spacing.md,
  },
  settingsButton: {
    marginTop: Spacing.sm,
  },
  rulesStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    marginHorizontal: Spacing.xs,
  },
  statCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  logContainer: {
    maxHeight: 300,
  },
  emptyLogContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  noLogsText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
  noLogsSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  logItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  logTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  logDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  logMessage: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});
