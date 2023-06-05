import React from 'react';
import { View, TouchableOpacity, TouchableHighlight, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BottomBar = ({ navigation }) => {
    return (
      <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Home')}>
        <Icon name="md-newspaper" size={24} style={styles.icon} />
        <Text style={styles.bottomBarButtonText}>News</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Chat')}>
        <Icon name="chatbox-ellipses-outline" size={24} style={styles.icon} />
        <Text style={styles.bottomBarButtonText}>Module Chats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.bottomBarButton}>
        <Icon name="locate" size={24} style={styles.icon} />
        <Text style={styles.bottomBarButtonText}>Lost & Found</Text>
      </TouchableOpacity>
    </View>
    );
};

const styles = {
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around', // Space the buttons evenly
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ccc',
        paddingTop: 8,
      },
      bottomBarButton: {
        flex: 1, // Equal flex distribution for all buttons
        paddingVertical: 8,
        alignItems: 'center',
      },
      bottomBarButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      icon: {
        marginBottom: 4,
      },
    };

export default BottomBar;