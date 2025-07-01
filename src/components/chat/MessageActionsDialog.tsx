
import React from 'react';
import { Copy, Edit, Reply, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface MessageActionsDialogProps {
  message: string;
  attachments: Array<{ name: string; url: string }>;
  isUser: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCopy: () => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MessageActionsDialog: React.FC<MessageActionsDialogProps> = ({
  message,
  attachments,
  isUser,
  open,
  onOpenChange,
  onCopy,
  onReply,
  onEdit,
  onDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </div>
      </DialogTrigger>
      <DialogContent 
        className="w-72 p-0 rounded-xl bg-background border border-border/50 overflow-hidden" 
        hideCloseButton
        forceMount
      >
        <VisuallyHidden>
          <DialogTitle>Message Actions</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col divide-y-0">
          <button onClick={onCopy} className="flex items-center gap-2 p-3 hover:bg-muted text-foreground text-left transition-colors">
            <Copy className="h-4 w-4" />
            <span>Copy</span>
          </button>
          <button onClick={onReply} className="flex items-center gap-2 p-3 hover:bg-muted text-foreground text-left transition-colors">
            <Reply className="h-4 w-4" />
            <span>Reply</span>
          </button>
          {isUser && (
            <>
              <button onClick={onEdit} className="flex items-center gap-2 p-3 hover:bg-muted text-foreground text-left transition-colors">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button onClick={onDelete} className="flex items-center gap-2 p-3 hover:bg-muted text-red-600 text-left transition-colors">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
