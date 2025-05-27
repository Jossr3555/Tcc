import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        padding: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#FFD700',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        width: '85%',
        maxHeight: '80%',
        gap: 1
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 12,
    },
    info: {
        fontSize: 14,
        color: '#444',
        marginBottom: 6,        
    },
    detailsButton: {
        backgroundColor: '#003366',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        padding: 10,
        marginTop: 15,
        alignSelf: 'center',
        width: '60%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 15,
    },
    modalScrollViewContent: {
        paddingBottom: 10,
        gap: 5
    },

    dialogButton: {
        backgroundColor: 'transparent', 
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
});