import ChatListItem from "./ChatListItem";

export default function ChatList({ chats, activeChat, setActiveChat }) {
  return (
    <div>
      {chats.map(chat => (
        <ChatListItem
          key={chat._id}
          chat={chat}
          isActive={chat._id === activeChat}
          onClick={() => setActiveChat(chat._id)}
        />
      ))}
    </div>
  );
}
