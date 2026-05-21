import {View, Text, Pressable, StyleSheet, ImageBackground} from 'react-native';
import { memo } from 'react';

interface cardProps {
    make: string,
    model: string,
    trim: string,
    type: string,
    year: number,
    onPress: () => void;
}

function TruckCard ({make, model, trim, type, year, onPress} : cardProps) {
    
    return(
    <ImageBackground
        source={require('../assets/CarListCard.png')}
        resizeMode='cover'
    >
    <View style={styles.container}>
        <View>
            <View style={styles.carInfos}>
                <Text style={[styles.cardText, {color: '#000000'}]}>{make} </Text>
                <Text style={[styles.cardText, {color: '#fff'}]}>{model} ({year})</Text>
                <Text style={[styles.cardText, {color: '#000000'}]}>{trim} </Text>
                <Text style={[styles.cardText, {color: '#fff'}]}>{type} </Text>
            </View>
        </View>
        <Pressable onPress={onPress}>
            <Text style={styles.about}>SABER MAIS</Text>
        </Pressable>
    </View>
    </ImageBackground>
    )
    
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        width: 330,
        height: 135,
        alignItems: 'center'
    },
    carInfos: {
        width:250,
        marginLeft: 90,
        marginTop: 14,
    },
    about: {
        color: "#fff",
        backgroundColor:'#0E63EE',
        textAlign: "center",
        fontFamily: 'Montserrat_700Bold',
        width: 100,
        borderRadius: 5,
        marginTop: 5
      

    },
    cardText: {
        color: '#000000',
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14
    }

})

export default memo(TruckCard)