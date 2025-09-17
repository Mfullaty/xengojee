import AsyncStorage from '@react-native-async-storage/async-storage';

const RULES_STORAGE_KEY = '@xengojee_rules';

export const saveRules = async (rules) => {
  try {
    const jsonValue = JSON.stringify(rules);
    await AsyncStorage.setItem(RULES_STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Error saving rules:', error);
    throw new Error('Failed to save rules');
  }
};

export const loadRules = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(RULES_STORAGE_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    return [];
  } catch (error) {
    console.error('Error loading rules:', error);
    return [];
  }
};

export const deleteRule = async (ruleId) => {
  try {
    const rules = await loadRules();
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    await saveRules(updatedRules);
    return updatedRules;
  } catch (error) {
    console.error('Error deleting rule:', error);
    throw new Error('Failed to delete rule');
  }
};

export const updateRule = async (ruleId, updatedRule) => {
  try {
    const rules = await loadRules();
    const ruleIndex = rules.findIndex(rule => rule.id === ruleId);
    
    if (ruleIndex !== -1) {
      rules[ruleIndex] = { ...rules[ruleIndex], ...updatedRule };
      await saveRules(rules);
      return rules;
    } else {
      throw new Error('Rule not found');
    }
  } catch (error) {
    console.error('Error updating rule:', error);
    throw new Error('Failed to update rule');
  }
};

export const addRule = async (newRule) => {
  try {
    const rules = await loadRules();
    const ruleWithId = {
      ...newRule,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString()
    };
    
    rules.push(ruleWithId);
    await saveRules(rules);
    return rules;
  } catch (error) {
    console.error('Error adding rule:', error);
    throw new Error('Failed to add rule');
  }
};
