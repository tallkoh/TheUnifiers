import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';

const ChatPage = () => {
  const [chats, setChats] = useState([
    { id: '1', title: 'Chat 1', messages: [] },
    { id: '2', title: 'Chat 2', messages: [] },
    { id: '3', title: 'Chat 3', messages: [] },
    // Add more chats as needed
  ]);

  const [currentChat, setCurrentChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const handleChatPress = (chatId) => {
    const chat = chats.find((c) => c.id === chatId);
    setCurrentChat(chat);
  };

  const handleSendMessage = () => {
    if (messageText.trim() === '') {
      return;
    }

    const newMessage = messageText.trim();
    setMessageText('');

    const updatedChats = chats.map((chat) => {
      if (chat.id === currentChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
        };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item.id)}>
      <Text style={styles.chatTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageItem}>
      <Text>{item}</Text>
    </View>
  );

  if (currentChat) {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>{currentChat.title}</Text>
        <FlatList
          data={currentChat.messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
        />
        <View style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            autoCorrect={false}
            onSubmitEditing={handleSendMessage} // Updated prop to handle send on enter key press
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Chats</Text>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatTitle: {
    fontSize: 16,
  },
  messageList: {
    flexGrow: 1,
    paddingTop: 8,
  },
  messageItem: {
    padding: 8,
    backgroundColor: '#f2f2f2',
    marginVertical: 4,
    borderRadius: 8,
  },
  messageInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatPage;
