import React from 'react';
import {
    View,
    ActivityIndicator,
    StyleSheet,
    Text
} from 'react-native';
import theme from '../styles/theme';
interface LoaderProps {
    visible: boolean;
}

const Loader: React.FC<LoaderProps> = ({ visible }) => {
    return (
        <>

            {visible && (
                <View style={styles.mainContainer}>
                    <View style={styles.container}>
                        <ActivityIndicator size="large" color={theme.colors.secondary} />
                        <Text style={{ color: theme.colors.primary, textAlign: "center" }}>
                            Loading...
                        </Text>
                    </View>
                </View>
            )}

        </>
    );
};

const styles = StyleSheet.create({

    mainContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        zIndex: 9999
    },

    container: {
        position: 'absolute',
        gap: 10,
        width: 100,
        height: 100,

        backgroundColor: theme.colors.transparent_background,
        justifyContent: 'center',

        zIndex: 9999,
        elevation: 10,
        borderRadius: 10,
        alignSelf: 'center'
    }
});

export default Loader;
