import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { Send, Paperclip, XCircle, Image, Video } from "lucide-react";

interface Props {
  onSendMessage: (message: string, files?: File[]) => void;
  initialMessage?: string;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  replyingTo?: {
    id: string;
    text: string;
    isUser: boolean;
  } | null;
  onCancelReply?: () => void;
}

export function ChatInput({ onSendMessage, initialMessage = "", isEditing = false, onCancelEdit, replyingTo, onCancelReply }: Props) {
  const [message, setMessage] = useState(initialMessage);
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  useEffect(() => {
    // Create preview URLs for files when they change
    const previews = files.map(file => URL.createObjectURL(file));
    setFilePreviews(previews);

    // Clean up created object URLs when component unmounts or files change
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, [files]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage("");
      setFiles([]);
      setFilePreviews([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (isEditing && onCancelEdit) {
        onCancelEdit();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const isImageFile = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  const isVideoFile = (file: File): boolean => {
    return file.type.startsWith('video/');
  };

  const canSendMessage = message.trim().length > 0 || files.length > 0;

  const cancelEdit = () => {
    if (onCancelEdit) {
      setMessage("");
      onCancelEdit();
    }
  };

  return (
    <div className="p-3 border-t bg-background">
      {replyingTo && (
        <div className="mb-2 p-2 bg-secondary rounded-md flex items-center justify-between text-sm">
          <span className="truncate">
            Replying to {replyingTo.isUser ? "you" : "support"}: "{replyingTo.text}"
          </span>
          <button 
            onClick={onCancelReply} 
            className="ml-2 text-muted-foreground hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
      {isEditing && (
        <div className="mb-3 flex justify-end">
          <span
            onClick={cancelEdit}
            className="text-sm text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            Cancel Edit
          </span>
        </div>
      )}
      {files.length > 0 && (
        <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {isImageFile(file) ? (
                <div className="rounded-md overflow-hidden bg-muted aspect-square relative">
                  <img 
                    src={filePreviews[index]} 
                    alt={file.name}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs truncate max-w-[90%] px-2">{file.name}</span>
                  </div>
                </div>
              ) : isVideoFile(file) ? (
                <div className="rounded-md overflow-hidden bg-muted aspect-square relative">
                  <video 
                    src={filePreviews[index]} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs truncate max-w-[90%] px-2">{file.name}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center p-2 bg-muted rounded-md">
                  <span className="text-sm truncate flex-1 mr-2">{file.name}</span>
                </div>
              )}
              <button 
                onClick={() => handleRemoveFile(index)} 
                className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 shadow-sm"
              >
                <XCircle className="h-4 w-4 text-foreground" />
              </button>
            </div>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex items-center my-auto">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleFileButtonClick}
            className="flex-shrink-0 h-9 w-9 flex items-center justify-center"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 relative flex items-center">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={replyingTo ? `Reply to ${replyingTo.isUser ? "yourself" : "support"}...` : "Type your message..."}
            className={cn(
              "w-full resize-none border rounded-md px-3 min-h-[36px] max-h-[200px] overflow-y-auto",
              "focus:outline-none focus:ring-0 focus:ring-offset-0 bg-background text-foreground",
              "focus:border-gray-300 dark:focus:border-gray-600 focus:border-2",
              "scrollbar-thin"
            )}
            style={{
              paddingTop: '8px',
              paddingBottom: '8px',
              lineHeight: '1.5',
              display: 'block'
            }}
            autoFocus={isEditing || !!replyingTo}
            rows={1}
          />
        </div>
        <div className="flex items-center my-auto">
          <Button 
            type="submit" 
            size="icon"
            className={cn(
              "flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-md",
              !canSendMessage && "opacity-50 cursor-not-allowed"
            )}
            disabled={!canSendMessage}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
        accept="image/*,video/*,audio/*,application/*,text/*"
      />
    </div>
  );
}
