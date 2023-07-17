import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const RenderChatItem = ({ item, handleChatPress }) => {
  return (
    <TouchableOpacity
      key={item.id}
      style={styles.chatItem}
      onPress={() => handleChatPress(item.id)}
    >
      <Text style={styles.chatTitle}>{item.moduleCode}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'center',
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
  },
});

export default memo(RenderChatItem);
