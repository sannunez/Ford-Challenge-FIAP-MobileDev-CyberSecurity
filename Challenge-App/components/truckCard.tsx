import {View, Text, Pressable, StyleSheet, ImageBackground, Image} from 'react-native';
import { memo } from 'react';
import { useSavedCars } from '../context/SavedCarsProvider';

interface cardProps {
    id: number,
    make: string,
    model: string,
    trim: string,
    type: string,
    year: number,
    onPress: () => void;
}

function TruckCard ({id, make, model, trim, type, year, onPress} : cardProps) {
   
    const { saveCar, removeCar, isSaved } = useSavedCars();

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
        <View style={styles.actions}>
            <Pressable onPress={onPress}>
                <Text style={styles.about}>SABER MAIS</Text>
            </Pressable>

            <Pressable
            onPress={() => {
                if (isSaved(id)) {
                    removeCar(id);
                } else {
                    saveCar({
                        id,
                        make,
                        model,
                        trim,
                        type,
                        year,
                    });
                }
            }}
            >
                <Image
                    source={
                        isSaved(id)
                            ? require("../assets/save-fill.png")
                            : require("../assets/save.png")
                    }

                    style={{
                        width: 24,
                        height: 24,
                    }}

                    resizeMode="contain"
                />
            </Pressable>
        </View>
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
    actions: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: 300,
        marginTop: 5
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

    },
    cardText: {
        color: '#000000',
        fontFamily: 'Montserrat_400Regular',
        fontSize: 14
    }

})

export default memo(TruckCard)