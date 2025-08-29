import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaBook,
  FaSpinner,
  FaChevronRight,
} from "react-icons/fa";

export default function ChatAskPanel() {
  const [pdfId, setPdfId] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const chatBodyRef = useRef(null);


  const pdfList = async () => {
    try {
      const { data } = await API.get("/pdf/list");
      setSubjects(data || []);
      if (data?.length) {
        setPdfId(data[0]._id);
        setSelectedSubject(data[0]);
      }
    } catch (e) {
      console.error("Error fetching PDF list:", e);
    }
  };

  // Select subject
  const handleSubjectSelect = (subject) => {
    setPdfId(subject._id);
    setSelectedSubject(subject);
    setMessages([]);
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = 0;
  };

  // Send question
  const send = async () => {
    if (!input.trim() || !pdfId) return;

    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await API.post("/qa/ask", { pdfId, question: q });
      setMessages((m) => [
        ...m,
        { role: "bot", text: data?.data?.answer || "(no answer)" },
      ]);
    } catch (e) {
      console.error("Ask error:", e);
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Sorry, I encountered an error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    pdfList();
  }, []);

  return (
    <div className="h-[550px]  w-full mx-auto container bg-white border border-gray-200 rounded-xl sha dow-md overflow-hidden">
      <div className="px-2 py-3 border-b border-gray-200 bg-white">
        <h1 className=" flex  text-xl font-bold text-[#2f80ed]  items-center gap-2">
          <FaRobot className="text-[#2f80ed]" /> Study Portal — Chat Assistant
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Ask questions about your uploaded study materials
        </p>
      </div>

      <div className="flex h-[calc(550px-68px)]">
        <div className="w-1/3 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <FaBook className="text-[#2f80ed]" />
              <h2 className="text-sm font-medium text-gray-800">
                Study Materials
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">Select a subject</p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 scroll-area">
            {subjects.map((subject) => {
              const active = pdfId === subject._id;
              return (
                <button
                  type="button"
                  key={subject._id}
                  onClick={() => handleSubjectSelect(subject)}
                  className={`w-full text-left p-3 mb-2 rounded-xl border transition-all ${
                    active
                      ? "bg-[#2f80ed]/10 border-[#2f80ed] shadow-sm"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          active ? "bg-[#2f80ed]" : "bg-gray-200"
                        }`}
                      >
                        <FaBook
                          className={active ? "text-white" : "text-gray-600"}
                          size={14}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {subject.filename}
                        </div>
                        <div className="text-xs text-gray-500">
                          {subject.uploadDate
                            ? new Date(subject.uploadDate).toLocaleDateString()
                            : "Unknown"}
                        </div>
                      </div>
                    </div>
                    {active && (
                      <FaChevronRight className="text-[#2f80ed]" size={12} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        
        <div className="w-2/3 flex flex-col">
       
          <div className="px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <FaRobot className="text-[#2f80ed]" />
              <h2 className="text-sm font-medium text-gray-800">
                Study Assistant
              </h2>
            </div>
            {selectedSubject && (
              <p className="text-xs text-gray-500 mt-1">
                Chatting about:{" "}
                <span className="font-medium">{selectedSubject.filename}</span>
              </p>
            )}
          </div>

          {/* Messages */}
          <div
            ref={chatBodyRef}
            className="flex-1 px-4 py-4 overflow-y-auto bg-gray-50 scroll-area"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
                <div className="p-3 border border-gray-200 bg-white rounded-xl mb-3">
                  <FaRobot className="text-[#2f80ed] text-xl" />
                </div>
                <div className="text-sm">
                  Start a conversation about your materials.
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                        m.role === "user"
                          ? "bg-[#2f80ed] text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {m.role === "bot" && (
                          <FaRobot
                            className="text-[#2f80ed] mt-0.5"
                            size={14}
                          />
                        )}
                        <p className="text-sm leading-relaxed">{m.text}</p>
                        {m.role === "user" && (
                          <FaUser className="text-white/80 mt-0.5" size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[70%] p-3 rounded-2xl bg-white border border-gray-200 text-sm text-gray-600 flex items-center gap-2 shadow-sm">
                      <FaRobot className="text-[#2f80ed]" size={14} />
                      <FaSpinner className="animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2 shadow-sm bg-gray-50">
              <input
                className="flex-1 bg-transparent px-2 focus:outline-none text-sm"
                placeholder="Message Study Assistant..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={loading}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="p-2 rounded-full bg-[#2f80ed] text-white flex items-center justify-center disabled:bg-gray-300 transition-colors"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaPaperPlane className="cursor-pointer" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scroll-area {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb transparent;
        }
        .scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-area::-webkit-scrollbar-track {
          background: transparent;
        }
        .scroll-area::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 9999px;
        }
        .scroll-area:hover::-webkit-scrollbar-thumb {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}
