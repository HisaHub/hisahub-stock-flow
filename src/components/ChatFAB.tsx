
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

const ChatFAB: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="fixed bottom-6 right-6 z-50 bg-secondary shadow-xl rounded-full w-16 h-16 flex items-center justify-center animate-fade-in hover:scale-110 transition transform"
        style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.12)" }}
        onClick={() => setOpen(true)}
        title="Chat with Hisa (AI)"
      >
        <MessageSquare color="#000080" size={32} />
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end md:items-center justify-end z-[99] animate-fade-in">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-md p-5 m-0 md:m-8 shadow-2xl relative flex flex-col" style={{ minHeight: "320px" }}>
            <button
              className="absolute top-4 right-5 text-secondary hover:text-primary transition"
              onClick={() => setOpen(false)}
              aria-label="Close Chat"
            >✕</button>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block bg-secondary text-primary px-3 py-1 rounded-full font-bold text-lg">H</span>
              <span className="font-semibold text-charcoal">Ask Hisa (AI Assistant)</span>
            </div>
            <div className="flex-1 text-neutral mb-2">How can I help you with NSE investing today?</div>
            {/* Mock chat input */}
            <input
              className="w-full border border-neutral rounded-md p-2 bg-neutral/30 font-sans focus:border-secondary focus:ring-2 focus:ring-secondary"
              placeholder="Type your question e.g., 'Which stock is trending?'"
              disabled
              value=""
              style={{ opacity: 0.7 }}
            />
            <div className="text-xs text-neutral mt-2 opacity-70">AI chat coming soon.</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatFAB;
