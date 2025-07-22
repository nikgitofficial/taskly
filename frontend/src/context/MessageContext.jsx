import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageCount, setMessageCount] = useState(0);

  const fetchMessageCount = async () => {
    try {
      const { data } = await axios.get("/contact/message-count");
      setMessageCount(data.count);
    } catch (err) {
      console.error("❌ Failed to fetch message count:", err);
    }
  };

  useEffect(() => {
    fetchMessageCount();
    const interval = setInterval(fetchMessageCount, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <MessageContext.Provider value={{ messageCount, fetchMessageCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
