import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';

export default function HomeLayout() {
  return (
    <View style={{ flex: 1}}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack screenOptions={{ headerShown: false, headerTintColor: '#ffffff' }} />
    </View>
  );
}