import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from "react";
import { Image, Text, View } from 'react-native';

export default function HomeScreen() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('test').select('*').limit(1);
        if (error) {
          console.log('Supabase connection test:', error.message);
          setConnectionStatus('Connected (table not found - expected)');
        } else {
          setConnectionStatus('Connected successfully!');
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
        setConnectionStatus('Connection failed');
      }
    };

    testConnection();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        style={{ width: 200, height: 200, alignSelf: 'center', marginBottom: 20 }}
        resizeMode="contain"
        source={require('@/assets/images/react-logo.png')}
      />
      <Text style={{ fontSize: 16, marginTop: 20 }}>
        Supabase Status: {connectionStatus}
      </Text>
    </View>
  );
}
    
