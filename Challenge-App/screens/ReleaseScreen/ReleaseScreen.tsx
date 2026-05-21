import {View, Text,StyleSheet, Image, ScrollView, Animated} from 'react-native'
import { useFonts, Montserrat_400Regular } from '@expo-google-fonts/montserrat'
import { useEffect, useRef } from 'react';

export default function ReleaseScreen(){
    const [fontsLoaded] = useFonts({
            Montserrat_400Regular,
        });

    const fadeAnim = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(40)).current
    const scale = useRef(new Animated.Value(0.95)).current

    useEffect(() => {

    Animated.parallel([

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),

      Animated.timing(scale, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),

    ]).start()

    }, [])
        
    return(
        <ScrollView>
            <View style={styles.container}>

                <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [
                        { translateY },
                        { scale }
                    ]
                }}
                >
                    <View style={styles.releaseContainer}>
                        <Image 
                            style={styles.releaseContainer}
                            source={require('../../assets/ReleaseFlier.png')}
                            />
                    </View>
                <View>
                    <Text style={styles.pText}>O MONSTRO DAS TRILHAS ESTA CHEGANDO</Text>
                </View>
                <View style={styles.complentContainer}>
                    <Image
                        style={styles.flierComplement}
                        source={require('../../assets/flierComplements.png')}
                        />
                </View>
                <View style={styles.Table}>
                    <Image
                        style={styles.Table}
                        source={require('../../assets/Tabela.png')}
                        />
                </View>

                </Animated.View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    releaseContainer: {
        width: 360,
        height: 350,
        marginTop: 30
    },
    pText: {
        color: '#fff',
        fontFamily: 'Montserrat_400Regular',
        fontSize: 15,
        marginTop: 40
    },
    complentContainer: {
        marginVertical: 20
    },
    flierComplement: {
        width: 365,
        height: 75,
    },
    Table: {
        width: 360,
        height: 440,
    }



})