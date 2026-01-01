export default function ChatListItem({ chat, isActive, onClick }) {
  const lastMessage = chat.lastMessage?.text || "";
  const unreadCount = chat.unreadCounts?.[chat.currentUserId] || 0;

  return (
    <div
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${
        isActive ? "bg-gray-200" : ""
      }`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0 mr-4" />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-semibold">{chat.participantsName}</p>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2">{unreadCount}</span>
          )}
        </div>
        <p className="text-gray-500 text-sm truncate">{lastMessage}</p>
      </div>
    </div>
  );
}
