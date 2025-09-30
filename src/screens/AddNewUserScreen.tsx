import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated, Alert } from 'react-native';
import { StackParamList } from '../types';
import { EROLES } from '../utils/enum';
import { ZellerCustomer } from '../realm/models/ZellerCustomer';
import { useRealm } from '../realm/setup';
import theme from '../styles/theme';
import useTabAnimation from '../hooks/useTabAnimation';
import AnimatedTabView from '../components/AnimatedTabView';
import { validateEmail, validateName } from '../utils/functinos';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '../components/Loader';

type AddNewUserScreenProps = NativeStackScreenProps<StackParamList, 'AddNewUser'>;
const roles = ["Admin", "Manager"]
const AddNewUserScreen: React.FC<AddNewUserScreenProps> = ({ navigation }) => {
    const realm = useRealm();
    const { translateX, startAnimation, tabWidth } = useTabAnimation({ items: roles });

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [userRole, setUserRole] = useState<string>(roles[0]);
    const [loader, setLoader] = useState(false)

    const handleCreate = () => {
        const emailError = validateEmail(email);
        const fullNameError = validateName(fullName);
        if (fullNameError) {
            Alert.alert("Error", fullNameError)
        }
        else if (emailError) {
            Alert.alert("Error", emailError)
        }
        else {
            setLoader(true)
            try {

                realm.write(() => {
                    return new ZellerCustomer(realm, fullName, email, userRole === "Admin" ? EROLES.ADMIN : EROLES.MANAGER);
                })
                // console.log("successfully saved!");
                setLoader(false)

                Alert.alert("Success", "Data saved successfully.")
            } catch (error) {
                setLoader(false)

                // console.log("Something went wrong!", error);
                Alert.alert("Error", "Something went wrong!")

            }
        }
    };
    const handleTabPress = (role: string, index: number) => {
        setUserRole(role);
        startAnimation(index, 300);
    };
    return (

        <SafeAreaView style={styles.modalContainer}>
            <Loader visible={loader} />
            <View style={styles.modalContent}>

                <TouchableOpacity style={styles.closeButton} onPress={() => {
                    navigation.goBack()
                }}>
                    <Text style={styles.closeButtonText}>x</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New User</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full Name*"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>User Role</Text>


            </View>


            {/* <View style={styles.roleContainer}> */}
            <AnimatedTabView
                items={roles}
                handleTabPress={handleTabPress}
                selected={userRole}
                tabWidth={tabWidth}
                translateX={translateX as Animated.Value}
            />
            <View style={{ padding: 20, flex: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
                    <Text style={styles.createButtonText}>Create User</Text>
                </TouchableOpacity>
            </View>
            {/* </View> */}
        </SafeAreaView>


    )
}

export default AddNewUserScreen

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.primary,

    },
    modalContent: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        borderRadius: 10,
        width: '100%',
        // height: "100%",

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: theme.colors.light_gray,
        padding: 10,
        marginVertical: 15,
    },
    label: {
        marginVertical: 20,

    },
    roleContainer: {
        flex: 1,
        width: "100%"
    },
    roleButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: theme.colors.light_gray,
        borderRadius: 15,
        flex: 1,
        marginHorizontal: 5,
    },
    selectedRole: {
        backgroundColor: theme.colors.secondary,
    },
    roleText: {
        textAlign: 'center',
    },
    createButton: {
        backgroundColor: theme.colors.secondary,
        padding: 15,
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
    },
    createButtonText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    closeButton: {
        paddingLeft: 10
    },
    closeButtonText: {
        fontSize: 35,
        color: theme.colors.secondary,
    },
});
