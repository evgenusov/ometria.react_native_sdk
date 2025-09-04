"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const OmetriaReactNativeSdk = _reactNative.NativeModules.OmetriaReactNativeSdk;

// 🛟 Save original implementations
const {
  trackProfileIdentifiedByCustomerIdEvent: _trackProfileIdentifiedByCustomerIdEvent,
  trackProfileIdentifiedByEmailEvent: _trackProfileIdentifiedByEmailEvent,
  trackProfileIdentifiedEvent: _trackProfileIdentifiedEvent,
  trackOrderCompletedEvent: _trackOrderCompletedEvent,
  trackScreenViewedEvent: _trackScreenViewedEvent,
  trackCustomEvent: _trackCustomEvent,
  onNotificationReceived: _onNotificationReceived,
  initializeWithApiToken: _initializeWithApi,
  parseNotification: _parseNotification,
  onNotificationInteracted: _onNotificationInteracted
} = OmetriaReactNativeSdk;

// 🛟  Custom implementation for methods that need an optional param for Android
OmetriaReactNativeSdk.trackProfileIdentifiedByCustomerIdEvent = (customerId, storeId = null) => _trackProfileIdentifiedByCustomerIdEvent(customerId, storeId);
OmetriaReactNativeSdk.trackProfileIdentifiedByEmailEvent = (email, storeId = null) => _trackProfileIdentifiedByEmailEvent(email, storeId);
OmetriaReactNativeSdk.trackProfileIdentifiedEvent = (customerId, email, storeId = null) => _trackProfileIdentifiedEvent(customerId, email, storeId);
OmetriaReactNativeSdk.trackOrderCompletedEvent = (orderId, basket = null) => _trackOrderCompletedEvent(orderId, basket);
OmetriaReactNativeSdk.trackScreenViewedEvent = (screenName, additionalInfo = null) => _trackScreenViewedEvent(screenName, additionalInfo);
OmetriaReactNativeSdk.trackCustomEvent = (customEventType, additionalInfo = null) => _trackCustomEvent(customEventType, additionalInfo);

// Other custom implementations

// 🛠️ Custom Implementation: initializeWithApiToken()
OmetriaReactNativeSdk.initializeWithApiToken = (token, options) => _initializeWithApi(token, options ?? {});

// 🛠️ Custom Implementation: onNotificationOpenedApp()
OmetriaReactNativeSdk.onNotificationOpenedApp = async remoteMessage => {
  const iOSRemoteMessage = {
    ...remoteMessage,
    data: {
      ometria: JSON.parse(remoteMessage?.data?.ometria || '{}')
    }
  };
  _onNotificationInteracted(_reactNative.Platform.OS === 'ios' ? iOSRemoteMessage : remoteMessage);
  OmetriaReactNativeSdk.flush();
};

// 🛠️ Custom Implementation: onNotificationReceived()
OmetriaReactNativeSdk.onNotificationReceived = remoteMessage => {
  const iOSRemoteMessage = {
    ...remoteMessage,
    data: {
      ometria: JSON.parse(remoteMessage?.data?.ometria || '{}')
    }
  };
  _onNotificationReceived(_reactNative.Platform.OS === 'ios' ? iOSRemoteMessage : remoteMessage);
};

// 🛠️ Custom Implementation: parseNotification()
OmetriaReactNativeSdk.parseNotification = async notification => {
  const parsedNotification = _reactNative.Platform.OS === 'android' ? await _parseNotification(notification) : Promise.resolve(notification?.data?.ometria ? JSON.parse(notification.data.ometria) : undefined);
  return parsedNotification;
};

// 🛠️ Custom Implementation: 🤖 only - onBackgroundMessage()
OmetriaReactNativeSdk.onAndroidBackgroundMessage = async ({
  ometriaToken,
  remoteMessage,
  ometriaOptions
}) => {
  _reactNative.Platform.OS === 'android' && OmetriaReactNativeSdk.initializeWithApiToken(ometriaToken, ometriaOptions).then(async () => {
    OmetriaReactNativeSdk.onNotificationReceived(remoteMessage);
  });
};

// 🛠️ Deprecated Implementations
OmetriaReactNativeSdk.setBackgroundMessageHandler = async () => {
  console.warn('setBackgroundMessageHandler is deprecated, no longer works and will be removed in the next major version');
  Promise.resolve();
};
OmetriaReactNativeSdk.onNotificationInteracted = () => {
  console.warn('onNotificationInteracted is deprecated, no longer works and will be removed in the next major version');
  return () => {};
};

// 🪦 onNotificationInteracted is a private method that was deprecated for the public API
var _default = exports.default = OmetriaReactNativeSdk;
//# sourceMappingURL=index.js.map