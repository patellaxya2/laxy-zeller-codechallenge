import React, { memo, } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View, useAnimatedValue } from 'react-native';

interface AnimatedTabViewProps {
    items: string[];
    handleTabPress: (role: string, index: number) => void;
    selected: string;
    translateX: Animated.Value;
    tabWidth: number

}
function AnimatedTabView({ translateX, items, handleTabPress, selected, tabWidth }: AnimatedTabViewProps) {

    return (
        <View style={styles.tabContainer}>
            <View style={styles.tabs}>
                {/* Animated sliding indicator */}
                <Animated.View
                    style={[
                        styles.indicator,
                        {
                            // Account for margins,
                            width: tabWidth,

                            transform: [{ translateX }],

                        },
                    ]}
                />

                {items.map((role, index) => (
                    <TouchableOpacity
                        key={role}
                        testID={`tab-${role}`}
                        style={[
                            styles.tab,
                        ]}
                        onPress={() => handleTabPress(role, index)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                selected === role && styles.tabTextActive,
                            ]}
                        >
                            {role}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    )
}

export default memo(AnimatedTabView)

const styles = StyleSheet.create({
    tabContainer: {
        alignItems: 'center',
        margin: 10,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "center",
        height: 40,
        backgroundColor: '#F0F2F5',
        borderRadius: 20,
        width: "80%",
        position: 'relative',
        // overflow: 'hidden'
    },
    tab: {
        flex: 1,
        // paddingHorizontal: 16,
        justifyContent: "center",
        // marginHorizontal: 4,
        // backgroundColor: "orange",
        alignItems: "center",
        // zIndex: 2, // Ensure tabs are above the indicator
    },
    tabText: {
        fontSize: 14,
        color: "#333",
    },
    tabTextActive: {
        color: "#007aff",
        fontWeight: "600",
    },
    indicator: {
        position: 'absolute',
        height: "100%",
        borderColor: "#007aff", borderRadius: 20, borderWidth: 1,
        left: 0,
        zIndex: 1,
    },
    tabActive: { borderColor: "#007aff", borderRadius: 20, borderWidth: 1, },


})