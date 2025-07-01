
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-72 p-0 rounded-xl bg-background/80 backdrop-blur-xl border border-border/50">
        <div className="flex flex-col p-4">
          <h3 className="font-medium text-foreground text-center">Delete message</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4 text-center">
            Are you sure you want to delete this message?
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 p-3 text-center text-foreground hover:bg-muted rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 p-3 text-center text-red-600 hover:bg-muted rounded-md transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
