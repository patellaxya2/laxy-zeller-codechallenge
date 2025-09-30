import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IZellerCustomer } from '../types'
import { EROLES } from '../utils/enum'
import theme from '../styles/theme'

function UserItem({ item }: { item: IZellerCustomer }) {

    return (
        <View style={styles.userRow}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <Text style={styles.name}>{item.name}</Text>
            {item.role === EROLES.ADMIN && <Text style={styles.role}>Admin</Text>}
        </View>
    )
}

export default UserItem


const styles = StyleSheet.create({
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#ddd",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 6,
        backgroundColor: "#e6f0ff",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: { color: theme.colors.secondary, fontWeight: "600" },
    name: { flex: 1, fontSize: 16 },
    role: { color: "#999", fontSize: 12 },


})