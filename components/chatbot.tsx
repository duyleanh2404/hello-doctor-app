"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import { IoMdSend } from "react-icons/io";
import { IoClose, IoChatbubbleSharp } from "react-icons/io5";

import ReactMarkdown from "react-markdown";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Chatbot = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [response, setResponse] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const [showChat, setShowChat] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (showChat && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showChat]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: userInput })
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.answer) {
          setResponse(data.answer);
        }
      } else {
        setResponse("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
      }
    } catch (error) {
      setResponse("Có lỗi xảy ra. Vui lòng thử lại sau ít phút nữa!");
    } finally {
      setLoading(false);
    }

    setUserInput("");
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
      setUserInput("");
    }
  };

  return (
    <div
      onClick={() => setShowChat(!showChat)}
      className="hidden lg:block fixed bottom-6 right-4 py-4 px-8 bg-primary rounded-full shadow-xl hover:shadow-2xl transition duration-500 cursor-pointer select-none z-50"
    >
      <div className="flex items-center gap-3 text-white">
        <IoChatbubbleSharp className="size-6 animate-bounce" />
        <p className="text-base font-semibold">Bạn có thắc mắc?</p>
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "absolute bottom-[calc(100%+20px)] right-0 w-[400px] 2xl:w-[450px] h-[500px] 2xl:h-[550px] flex flex-col bg-white shadow-lg rounded-2xl transition duration-500 overflow-hidden cursor-default",
          showChat ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/avatar-default-white.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="flex flex-col gap-1">
              <p className="text-[17px] font-semibold">Hello Bacsi AI</p>
              <p className="text-sm">Trợ lý ảo của chúng tôi sẽ giúp bạn!</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowChat(false)}
          >
            <IoClose className="size-6" />
          </Button>
        </div>

        <div className="h-full flex flex-col gap-6 p-4 pb-8 bg-[#f9f9fb]">
          <div className="flex flex-col gap-4">
            <p className="text-center relative inline-block">
              <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[38%] border-t border-[#ddd]" />
              <span className="relative text-sm font-medium text-[#5a6169] z-10">Hôm nay</span>
              <span className="absolute right-0 top-1/2 transform -translate-y-1/2 w-[38%] border-t border-[#ddd]" />
            </p>

            <div className="flex items-start gap-4 h-[240px] 2xl:h-[320px] pb-4 pr-4 overflow-y-auto">
              <Image
                src="/chatbot.png"
                alt="Chatbot"
                width={40}
                height={40}
                className="flex-shrink-0 object-contain"
              />

              {isLoading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                response ? (
                  <div className="text-[15px] text-[#333] p-4 bg-white rounded-2xl shadow-lg cursor-text select-text">
                    <ReactMarkdown>{response}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-[15px] text-[#333] p-4 bg-white rounded-2xl shadow-lg cursor-text select-text">
                    <p>Vui lòng đặt câu hỏi cho tôi!</p>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-auto">
            <Input
              ref={inputRef}
              value={userInput}
              spellCheck={false}
              onKeyDown={handleKeyPress}
              placeholder="Nhập câu hỏi của bạn..."
              onChange={(e) => setUserInput(e.target.value)}
              className="h-12 text-sm bg-white border-primary !shadow-input-primary"
            />

            {userInput.trim() && (
              <Button
                type="button"
                variant="ghost"
                className="h-14"
                disabled={isLoading}
                onClick={handleSendMessage}
              >
                <IoMdSend className="size-6 text-primary" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;