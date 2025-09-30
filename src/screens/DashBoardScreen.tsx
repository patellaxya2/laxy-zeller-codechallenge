import React, { useRef, useState } from 'react'
import { StatusBar, StyleSheet, Text, View, Animated, SectionList, TouchableOpacity, useAnimatedValue, Button, Image, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import theme from '../styles/theme'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { StackParamList } from '../types'
import PagerView from 'react-native-pager-view';
import { roles, } from '../utils/constants';
import { EROLES } from '../utils/enum';
import { IZellerCustomer } from '../types';
import UserItem from '../components/UserItem';
import AnimatedTabView from '../components/AnimatedTabView'
import useTabAnimation from '../hooks/useTabAnimation'
import { useQuery } from '../realm/setup'
import { ZellerCustomer } from '../realm/models/ZellerCustomer'
import { Results } from 'realm'


type DashBoardScreenProps = NativeStackScreenProps<StackParamList, 'Dashboard'>;

const DashBoardScreen: React.FC<DashBoardScreenProps> = ({ navigation }) => {
    const zellerCustomerList = useQuery(ZellerCustomer);
    const { translateX, startAnimation, tabWidth } = useTabAnimation({ items: roles });
    const [selected, setSelected] = useState<string>(roles[0]);
    const pagerRef = useRef<PagerView>(null);
    const [searchName, setSearchName] = useState("")

    const animateToTab = (index: number) => {
        startAnimation(index, 300);
    };

    const handleTabPress = (role: string, index: number) => {
        setSelected(role);
        pagerRef.current?.setPage(index);
        animateToTab(index);
    };

    const handlePageSelected = (e: any) => {
        const index = e.nativeEvent.position;
        const role = roles[index];
        setSelected(role);
        animateToTab(index);

    };
    const groupByLetter = (data: IZellerCustomer[]) => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        const grouped: { title: string; data: IZellerCustomer[] }[] = [];

        sorted.forEach((item) => {
            const letter = item.name[0].toUpperCase();
            const section = grouped.find((g) => g.title === letter);
            if (section) {
                section.data.push(item);
            } else {
                grouped.push({ title: letter, data: [item] });
            }
        });

        return grouped;
    };
    const renderList = (filter: EROLES, mZellerCustomerList: Results<ZellerCustomer>, searchByName: string) => {


        let filtered = mZellerCustomerList;
        if (searchByName && filter && filter === "ALL") {
            filtered = mZellerCustomerList.filtered('name CONTAINS[c] $0'
                , searchByName)
        }
        else if (searchByName && filter && filter !== "ALL") {
            filtered = mZellerCustomerList.filtered('role == $0 AND name CONTAINS[c] $1'
                , filter, searchByName)
        }
        else if (filter !== "ALL") {
            filtered = mZellerCustomerList.filtered(`role == $0`, filter)
        }

        const filteredUI: IZellerCustomer[] = Array.from(filtered).map((item) => ({
            id: item?.id,
            name: item.name,
            role: item.role,
            email: item.email,
        }));
        const sections = groupByLetter(filteredUI);

        return (
            <SectionList

                testID='SectionList'
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <UserItem item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={{ paddingBottom: 80 }}
                ListEmptyComponent={() => <Text style={{ textAlign: "center" }}>Data Not Found!</Text>}

            />
        );
    };



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={theme.colors.primary}
            />


            <AnimatedTabView
                items={roles}
                handleTabPress={handleTabPress}
                selected={selected}
                tabWidth={tabWidth}
                translateX={translateX as Animated.Value}
            />


            <TextInput
                placeholder='Search by name...'
                style={{
                    alignSelf: "center",
                    width: '85%',
                    borderWidth: 1,
                    borderColor: theme.colors.light_gray,
                    padding: 10,
                    marginVertical: 15,
                    borderRadius: 40

                }}
                onChangeText={(text) => {
                    setSearchName(text);
                }}
            />
            <PagerView
                testID='pager-view'
                style={styles.container}
                initialPage={0}
                onPageSelected={handlePageSelected}
                ref={pagerRef}
            >
                <View key="1">
                    {selected === roles[0] && renderList(EROLES.ALL, zellerCustomerList, searchName)}
                </View>
                <View key="2">
                    {selected === roles[1] && renderList(EROLES.ADMIN, zellerCustomerList, searchName)}
                </View>
                <View key="3">
                    {selected === roles[2] && renderList(EROLES.MANAGER, zellerCustomerList, searchName)}
                </View>
            </PagerView>
            <TouchableOpacity style={styles.fab} onPress={() => {
                navigation.navigate("AddNewUser")
            }}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>



        </SafeAreaView>
    )
}

export default DashBoardScreen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary
    },
    tabContainer: {
        alignItems: 'center',
        margin: 10,
    },
    tabs: {
        flexDirection: "row",
        justifyContent: "center",
        height: 40,
        backgroundColor: theme.colors.smoke_gray,
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
        color: theme.colors.secondary,
        fontWeight: "600",
    },
    indicator: {
        position: 'absolute',
        height: "100%",
        borderColor: theme.colors.secondary, borderRadius: 20, borderWidth: 1,
        left: 0,
        zIndex: 1,
    },
    tabActive: { borderColor: theme.colors.secondary, borderRadius: 20, borderWidth: 1, },

    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        fontWeight: "bold",
        backgroundColor: theme.colors.very_light_gray,
    },
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: theme.colors.secondary,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
    fabText: { fontSize: 28, color: theme.colors.primary, textAlign: "center" },
});