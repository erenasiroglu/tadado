import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user, session, loading, signOut, updateUserProfile } = useAuth();

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: signOut 
        }
      ]
    );
  };

  const handleTogglePremium = async () => {
    if (!user) return;
    
    const result = await updateUserProfile({
      is_premium: !user.is_premium
    });
    
    if (result.success) {
      Alert.alert('Success', 'Premium status updated!');
    } else {
      Alert.alert('Error', result.error || 'Update failed');
    }
  };

  const handleLoginPress = () => {
    router.push('/(auth)/login');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with login button for non-authenticated users */}
      {!session && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tadado</Text>
          <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.content}>
          <Image
            style={styles.logo}
            resizeMode="contain"
            source={require('@/assets/images/react-logo.png')}
          />
          
          {session && user ? (
            // Authenticated user view
            <>
              <View style={styles.userCard}>
                <Text style={styles.welcome}>Welcome back!</Text>
                <Text style={styles.username}>@{user.username}</Text>
                
                <View style={styles.userInfo}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{session.user.email}</Text>
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.infoLabel}>Language:</Text>
                  <Text style={styles.infoValue}>{user.language}</Text>
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.infoLabel}>Adult:</Text>
                  <Text style={styles.infoValue}>{user.is_adult ? 'Yes' : 'No'}</Text>
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.infoLabel}>Premium:</Text>
                  <Text style={[styles.infoValue, user.is_premium && styles.premium]}>
                    {user.is_premium ? 'Premium Member ⭐' : 'Standard Member'}
                  </Text>
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.infoLabel}>Member since:</Text>
                  <Text style={styles.infoValue}>
                    {new Date(user.created_at).toLocaleDateString('en-US')}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity 
                  style={styles.button}
                  onPress={handleTogglePremium}
                >
                  <Text style={styles.buttonText}>
                    {user.is_premium ? 'Cancel Premium' : 'Go Premium'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.signOutButton]}
                  onPress={handleSignOut}
                >
                  <Text style={[styles.buttonText, styles.signOutText]}>
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            // Public home view for non-authenticated users
            <View style={styles.publicContent}>
              <Text style={styles.title}>Welcome to Tadado</Text>
              <Text style={styles.subtitle}>
                Discover amazing content and connect with a vibrant community
              </Text>
              
              <View style={styles.features}>
                <View style={styles.feature}>
                  <Text style={styles.featureTitle}>🎯 Discover Content</Text>
                  <Text style={styles.featureDescription}>
                    Find interesting topics and engaging discussions
                  </Text>
                </View>
                
                <View style={styles.feature}>
                  <Text style={styles.featureTitle}>👥 Join Community</Text>
                  <Text style={styles.featureDescription}>
                    Connect with like-minded people and share your thoughts
                  </Text>
                </View>
                
                <View style={styles.feature}>
                  <Text style={styles.featureTitle}>⭐ Premium Features</Text>
                  <Text style={styles.featureDescription}>
                    Unlock exclusive content and advanced features
                  </Text>
                </View>
              </View>

              <View style={styles.authButtons}>
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={() => router.push('/(auth)/signup')}
                >
                  <Text style={styles.primaryButtonText}>Get Started</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.secondaryButton}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.secondaryButtonText}>I have an account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  // Public content styles
  publicContent: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 40,
  },
  feature: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  featureDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  authButtons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // User profile styles
  userCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  username: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  infoValue: {
    fontSize: 16,
    color: '#666',
  },
  premium: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
  },
  signOutText: {
    color: 'white',
  },
});
    
