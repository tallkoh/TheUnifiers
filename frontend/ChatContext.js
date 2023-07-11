import React, { createContext, useState } from 'react';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedModules, setSelectedModules] = useState([]);
  const [showAllModules, setShowAllModules] = useState(true);

  return (
    <ChatContext.Provider value={{ selectedModules, setSelectedModules, showAllModules, setShowAllModules }}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatProvider };