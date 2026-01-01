export default function MessageBubble({ message, currentUser }) {
  const isSender = message.sender === currentUser;
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-lg mb-2 ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {message.text}
        {message.attachments?.map((a, i) => (
          <div key={i}>
            <a href={a} target="_blank" className="text-blue-700 underline">{a}</a>
          </div>
        ))}
        <div className="text-xs text-gray-500 mt-1 flex space-x-1">
          {message.reactions?.map((r, i) => (
            <span key={i}>{r.type}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
