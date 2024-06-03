import React, { useRef, useState } from 'react';
import { StyleSheet, View, RefreshControl, ScrollView, Dimensions } from 'react-native';
import WebView from 'react-native-webview';

const initialUrl = 'https://tasken.io';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [key, setKey] = useState(0);
  const [url, setUrl] = useState(initialUrl)
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setKey((prevKey) => prevKey + 1); // Update the key to reload the WebView
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const onNavigationStateChange = (navState: any) => {
    if (url!==navState.url) { 
      setUrl(navState.url)
      alert(navState.url)
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.webviewContainer}>
          <WebView
            key={key}
            source={{
              uri: url,
            }}
            allowsFullscreenVideo={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            style={styles.webview}
            onNavigationStateChange={onNavigationStateChange}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  webviewContainer: {
    flex: 1,
    height: Dimensions.get('window').height - 50, // Adjust to account for the marginTop
  },
  webview: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
});