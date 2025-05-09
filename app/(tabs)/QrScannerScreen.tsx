import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


export default function QrScannerScreen() {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [stampCount, setStampCount] = useState(0);
    const router = useRouter();


    const STAMP_KEY = 'loyalty_stamps';
    const STAMP_GOAL = 3;

    useFocusEffect(
        useCallback(() => {
            setScanned(false); // Reset when screen comes into focus
        }, [])
    );


    useFocusEffect(
        useCallback(() => {
            const fetchStampCount = async () => {
                const storedCount = await AsyncStorage.getItem(STAMP_KEY);
                if (storedCount) {
                    setStampCount(parseInt(storedCount, 10));
                }
            };

            fetchStampCount();
        }, [])
    );


    const handleBarCodeScanned = async ({ data }: { data: string }) => {


        if (scanned) return; // Prevent scanning if alert is visible or not enabled



        setScanned(true); // Prevent multiple scans


        let newCount = stampCount + 1;

        if (newCount >= STAMP_GOAL) {

            if (newCount === STAMP_GOAL) {
                console.log("You erned a free ssions");
                await AsyncStorage.setItem(STAMP_KEY, STAMP_GOAL.toString());
            } else {
                console.log("COMPLETED FREE SESSION!!!!");
                await AsyncStorage.setItem(STAMP_KEY, "0");
            }

        } else {
            await AsyncStorage.setItem(STAMP_KEY, newCount.toString());
        }

        // Navigate to the index page
        router.replace('/');
    };

    const resetScanner = async (newCount: number) => {
        await AsyncStorage.setItem(STAMP_KEY, newCount.toString());
        setStampCount(newCount);
        setScanned(false); // Allow scanning again

    };



    if (!permission) {
        return <Text>Requesting camera permissions...</Text>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>No access to camera</Text>
                <Button title="Allow Camera" onPress={requestPermission} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}

                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}

                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
            />
            <View style={styles.overlay}>
                <Text style={styles.counter}>Scan your CW qr code </Text>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        bottom: 100,
        width: '100%',
        alignItems: 'center',
    },
    counter: {
        fontSize: 20,
        marginBottom: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
    },
});
