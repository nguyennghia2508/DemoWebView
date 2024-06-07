import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, RefreshControl, ScrollView, Dimensions, Alert, BackHandler, Platform } from 'react-native';
import WebView from 'react-native-webview';

const initialUrl = 'https://tasken.io';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const [url, setUrl] = useState(initialUrl);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const webViewRef = useRef<WebView>(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setKey(prevKey => prevKey + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const onNavigationStateChange = (navState: any) => {
    if (url !== navState.url) { 
      setUrl(navState.url);
      console.log(navState.url);
    }
  };

  const onError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    Alert.alert(
      'Webview Error',
      `Error code: ${nativeEvent.code}\nDescription: ${nativeEvent.description}`,
      [{ text: 'OK' }]
    );
  };

  const onHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    Alert.alert(
      'HTTP Error',
      `HTTP error: ${nativeEvent.statusCode}`,
      [{ text: 'OK' }]
    );
  };

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    if (contentOffset.y === 0) {
      setScrollEnabled(true);
    } else {
      setScrollEnabled(false);
    }
  };

  const handleBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
    return false;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, []);

  const onShouldStartLoadWithRequest = (request: any) => {
    const { url } = request;
    // Block navigation to the specified URL
    if (url.includes('https://365vn.sharepoint.com')) {
      setTimeout(() => {
        if (webViewRef.current) {
          webViewRef.current.stopLoading();
        }
      }, 100);
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          Platform.select({
           ios: (
            <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            />
           ),
           android: (
            <RefreshControl
            enabled={scrollEnabled}
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            />
           )
          })
        }
        scrollEnabled={scrollEnabled}
      >
        <View style={styles.webviewContainer}>
          <WebView
            key={key}
            ref={webViewRef}
            source={{ uri: url }}
            sharedCookiesEnabled
            thirdPartyCookiesEnabled
            allowsFullscreenVideo
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/119.0.2151.97"
            style={styles.webview}
            onNavigationStateChange={onNavigationStateChange}
            onError={onError}
            onHttpError={onHttpError}
            onScroll={handleScroll}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 75,
  },
  webviewContainer: {
    flex: 1,
    height: Dimensions.get('window').height - 75,
  },
  webview: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
});
