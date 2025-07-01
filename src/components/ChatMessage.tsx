
import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, Edit, Reply, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MessageActionsDialog } from "./chat/MessageActionsDialog";
import { DeleteConfirmationDialog } from "./chat/DeleteConfirmationDialog";
import { MessageAttachments } from "./chat/MessageAttachments";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  timestamp: string;
  isEdited?: boolean;
  attachments?: Array<{ name: string; url: string }>;
  replyTo?: {
    id: string;
    text: string;
    isUser: boolean;
  };
  onDelete?: () => void;
  onEdit?: () => void;
  onReply?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser = false,
  timestamp,
  isEdited = false,
  attachments = [],
  replyTo,
  onDelete,
  onEdit,
  onReply,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isMobile) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    toast.success("Message copied to clipboard");
    setOpen(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
      setOpen(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleReply = () => {
    if (onReply) {
      onReply();
      setOpen(false);
    }
  };

  return (
    <>
      <div className={cn(
        "flex gap-3 mb-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <Avatar className="w-8 h-8">
          {isUser && <AvatarImage src="/placeholder.svg" />}
          <AvatarFallback>{isUser ? "U" : "S"}</AvatarFallback>
        </Avatar>
        <div className={cn(
          "flex flex-col max-w-md",
          isUser ? "items-end" : "items-start"
        )}>
          {replyTo && (
            <div className={cn(
              "rounded-lg px-3 py-1.5 mb-1 text-xs bg-muted/50 border-l-2",
              isUser ? "border-primary" : "border-secondary"
            )}>
              <p className="text-muted-foreground">
                Replying to: <span className="font-medium">{replyTo.isUser ? "You" : "Support"}</span>
              </p>
              <p className="truncate max-w-[250px]">{replyTo.text}</p>
            </div>
          )}

          <div className={cn(
            "rounded-2xl px-4 py-2 relative",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            {isMobile ? (
              <MessageActionsDialog
                message={message}
                attachments={[]}
                isUser={isUser}
                open={open}
                onOpenChange={setOpen}
                onCopy={handleCopy}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={() => setShowDeleteDialog(true)}
              />
            ) : (
              <div 
                className="cursor-pointer"
                onContextMenu={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
                onClick={() => setOpen(true)}
              >
                <p className="text-sm whitespace-pre-wrap">{message}</p>
              </div>
            )}
            {!isMobile && open && (
              <div 
                ref={menuRef}
                className="absolute z-50 right-0 top-full mt-1 w-40 bg-background/80 backdrop-blur-lg border border-border/50 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="flex flex-col divide-y-0">
                  <button onClick={handleCopy} className="flex items-center gap-2 p-3 hover:bg-muted text-left transition-colors">
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </button>
                  <button onClick={handleReply} className="flex items-center gap-2 p-3 hover:bg-muted text-left transition-colors">
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                  {isUser && (
                    <>
                      <button onClick={handleEdit} className="flex items-center gap-2 p-3 hover:bg-muted text-left transition-colors">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => setShowDeleteDialog(true)} className="flex items-center gap-2 p-3 hover:bg-muted text-red-600 text-left transition-colors">
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Render attachments outside the message bubble */}
          {attachments && attachments.length > 0 && (
            <div className={cn(
              isUser ? "self-end" : "self-start"
            )}>
              <MessageAttachments attachments={attachments} />
            </div>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>{timestamp}{isEdited && ' • edited'}</span>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  );
};
