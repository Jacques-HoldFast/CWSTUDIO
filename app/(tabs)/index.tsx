import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Image } from 'react-native';
import { useRouter } from 'expo-router';


const STAMP_KEY = 'loyalty_stamps';
const STAMP_GOAL = 3;


export default function HomeScreen() {
  const router = useRouter();
  const [stampCount, setStampCount] = useState<number>(0);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/login');
  };

  useFocusEffect(
    useCallback(() => {
      const loadStamps = async () => {

        const count = await AsyncStorage.getItem(STAMP_KEY);

        if (count !== null) setStampCount(parseInt(count, 10));
      };

      loadStamps();

    }, [])
  );


  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Image
        source={require('../../assets/images/logo.jpg')} // adjust the path if you're deeper in the folder structure
        style={styles.image}
        resizeMode="contain" // or "cover", depending on your layout
      />
      <Text style={styles.title}>Morning Jacques</Text>
      <Text style={styles.title}>You currently have the 3 class package</Text>
      <Text style={styles.sessions}>🎯 Sessions Completed</Text>
      <Text style={styles.count}>
        {stampCount} / {STAMP_GOAL}
      </Text>
      {stampCount >= STAMP_GOAL && (
        <Text style={styles.rewardText}>🎉 You've earned a free session!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
  },
  count: {
    fontSize: 40,
    fontWeight: 'bold',

  },
  sessions: {
    marginTop: 40,
    fontSize: 24,
  },
  image: {
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 20,
    marginTop: 20,
    color: 'green',
    fontWeight: 'bold',
  },
});