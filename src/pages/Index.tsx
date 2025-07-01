
import { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from '@/components/ThemeProvider';
import { TypingIndicator } from '@/components/TypingIndicator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  isEdited?: boolean;
  attachments?: Array<{ name: string; url: string }>;
  replyTo?: {
    id: string;
    text: string;
    isUser: boolean;
  };
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [{
      id: '1',
      text: "Hello! How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
    }];
  });
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    text: string;
    isUser: boolean;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const handleEditMessage = (id: string) => {
    const messageToEdit = messages.find(m => m.id === id);
    if (messageToEdit) {
      setEditingMessage(messageToEdit);
      setReplyingTo(null);
    }
  };

  const handleReplyToMessage = (id: string, text: string, isUser: boolean) => {
    setReplyingTo({ id, text, isUser });
    setEditingMessage(null);
  };

  const handleSendMessage = (text: string, files?: File[]) => {
    if (editingMessage) {
      setMessages(messages.map(m => 
        m.id === editingMessage.id 
          ? { ...m, text, isEdited: true, timestamp: new Date().toLocaleTimeString() }
          : m
      ));
      setEditingMessage(null);
    } else {
      // Create attachments array from files if any
      const attachments = files?.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
        replyTo: replyingTo || undefined,
        attachments: attachments && attachments.length > 0 ? attachments : undefined
      };

      setMessages(prev => [...prev, newMessage]);
      setReplyingTo(null);

      // Show typing indicator
      setIsTyping(true);

      setTimeout(() => {
        const supportMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: replyingTo 
            ? `Thanks for your reply regarding "${replyingTo.text.substring(0, 30)}${replyingTo.text.length > 30 ? '...' : ''}". Our team will get back to you shortly.`
            : "Thanks for your message! Our team will get back to you shortly.",
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        };
        
        // Hide typing indicator and add the message
        setIsTyping(false);
        setMessages(prev => [...prev, supportMessage]);
      }, 1500); // Longer delay to see the typing animation
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const cancelEditing = () => {
    setEditingMessage(null);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background">
      <header className="flex items-center justify-between py-2 border-b">
        <div className="flex items-center gap-2 pl-4">
          <i className={`fas fa-user-secret ${theme === 'dark' ? 'text-white' : 'text-primary'}`} style={{ fontSize: '24px' }}></i>
          <h1 className="text-xl font-semibold">Live Chat</h1>
        </div>
        <div className="pr-3">
          <ThemeToggle />
        </div>
      </header>
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="max-w-2xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              isEdited={message.isEdited}
              attachments={message.attachments}
              replyTo={message.replyTo}
              onDelete={() => message.isUser && handleDeleteMessage(message.id)}
              onEdit={() => message.isUser && handleEditMessage(message.id)}
              onReply={() => handleReplyToMessage(message.id, message.text, message.isUser)}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </ScrollArea>
      <div className="max-w-2xl mx-auto w-full sticky bottom-0 bg-background">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          initialMessage={editingMessage?.text || ""}
          isEditing={!!editingMessage}
          onCancelEdit={cancelEditing}
          replyingTo={replyingTo}
          onCancelReply={handleCancelReply}
        />
      </div>
    </div>
  );
};

export default Index;
