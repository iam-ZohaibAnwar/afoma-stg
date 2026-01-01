export default function TypingIndicator({ users }) {
  return (
    <div className="flex items-center space-x-1 text-gray-500 text-sm">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-400"></div>
      <span>{users.length} typing...</span>
    </div>
  );
}
