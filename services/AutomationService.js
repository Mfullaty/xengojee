import { NativeEventEmitter, NativeModules } from 'react-native';

const { AutomationModule } = NativeModules;

class AutomationService {
  constructor() {
    this.eventEmitter = new NativeEventEmitter(AutomationModule);
    this.listeners = [];
  }

  async start(rules) {
    try {
      const rulesJson = JSON.stringify(rules);
      const result = await AutomationModule.startService(rulesJson);
      return result;
    } catch (error) {
      throw new Error(`Failed to start service: ${error.message}`);
    }
  }

  async stop() {
    try {
      const result = await AutomationModule.stopService();
      return result;
    } catch (error) {
      throw new Error(`Failed to stop service: ${error.message}`);
    }
  }

  async getStatus() {
    try {
      const status = await AutomationModule.getStatus();
      return status;
    } catch (error) {
      throw new Error(`Failed to get status: ${error.message}`);
    }
  }

  async openAccessibilitySettings() {
    try {
      const result = await AutomationModule.openAccessibilitySettings();
      return result;
    } catch (error) {
      throw new Error(`Failed to open accessibility settings: ${error.message}`);
    }
  }

  addEventListener(eventName, listener) {
    const subscription = this.eventEmitter.addListener(eventName, listener);
    this.listeners.push(subscription);
    return subscription;
  }

  removeEventListener(subscription) {
    if (subscription && subscription.remove) {
      subscription.remove();
      const index = this.listeners.indexOf(subscription);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
  }

  removeAllListeners() {
    this.listeners.forEach(subscription => {
      if (subscription && subscription.remove) {
        subscription.remove();
      }
    });
    this.listeners = [];
  }
}

export default new AutomationService();
