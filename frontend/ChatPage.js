import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatPage = ({ navigation }) => {
  const [chats, setChats] = useState([
    { id: '1', title: 'Chat 1', messages: [] },
    { id: '2', title: 'Chat 2', messages: [] },
    { id: '3', title: 'Chat 3', messages: [] },
    { id: '4', title: 'Chat 4', messages: [] },
    { id: '5', title: 'Chat 5', messages: [] },
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
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setCurrentChat(null)}>
            <Icon name="arrow-back-outline" size={24} style={styles.backButtonIcon} />
          </TouchableOpacity>
          <Text style={styles.pageTitleInner}>{currentChat.title}</Text>
        </View>
        <FlatList
          data={currentChat.messages}
          renderItem={renderMessageItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.messageList}
        />
        <SafeAreaView style={styles.messageInputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            autoCorrect={false}
            onSubmitEditing={handleSendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Bottom bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Home')}>
            <Icon name="md-newspaper-outline" size={24} style={styles.icon} />
            <Text style={styles.bottomBarButtonText}>News</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Icon name="chatbox-ellipses" size={24} style={styles.icon} />
            <Text style={styles.bottomBarButtonText}>Module Chats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarButton}>
            <Icon name="locate" size={24} style={styles.icon} />
            <Text style={styles.bottomBarButtonText}>Lost & Found</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Chats</Text>
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
      />

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBarButton} onPress={() => navigation.navigate('Home')}>
          <Icon name="md-newspaper-outline" size={24} style={styles.icon} />
          <Text style={styles.bottomBarButtonText}>News</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton}>
          <Icon name="chatbox-ellipses" size={24} style={styles.icon} />
          <Text style={styles.bottomBarButtonText}>Module Chats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBarButton}>
          <Icon name="locate" size={24} style={styles.icon} />
          <Text style={styles.bottomBarButtonText}>Lost & Found</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 16,
  },
  backButton: {
    marginRight: 8,
  },
  backButtonIcon: {
    color: '#333',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingLeft: 16,
  },
  pageTitleInner: {
    fontSize: 24,
    fontWeight: 'bold',
  },
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
    padding: 16,
  },
  messageList: {
    flexGrow: 1,
    paddingTop: 8,
  },
  messageItem: {
    padding: 8,
    backgroundColor: '#DCF8C6',
    marginVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start', // Align messages to the left
    maxWidth: '80%', // Limit the maximum width of the message bubble
  },
  messageInputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D7D7D7', // Use a color similar to Telegram's input field border color
    borderRadius: 20,
    paddingLeft: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    backgroundColor: '#FFF', // Use a color for input field background
    color: '#333', // Use a color similar to Telegram's input field text color
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
});

export default ChatPage;
