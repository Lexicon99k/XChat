
import React from 'react';
import { File } from "lucide-react";

interface MessageAttachmentsProps {
  attachments: Array<{ name: string; url: string }>;
}

export const MessageAttachments: React.FC<MessageAttachmentsProps> = ({ attachments }) => {
  if (attachments.length === 0) return null;

  const isImageFile = (fileName: string): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension || '');
  };

  const isVideoFile = (fileName: string): boolean => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension || '');
  };

  return (
    <div className="flex flex-col gap-2">
      {attachments.map((file, index) => (
        <div key={index}>
          {isImageFile(file.name) ? (
            <div className="rounded-lg overflow-hidden">
              <img 
                src={file.url} 
                alt={file.name} 
                className="rounded-lg"
              />
              <div className="text-xs text-muted-foreground truncate mt-1">
                {file.name}
              </div>
            </div>
          ) : isVideoFile(file.name) ? (
            <div className="rounded-lg overflow-hidden">
              <video 
                src={file.url} 
                controls
                className="rounded-lg w-full"
              />
              <div className="text-xs text-muted-foreground truncate mt-1">
                {file.name}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs p-2 rounded-md bg-muted/10">
              <File className="w-4 h-4" />
              <a href={file.url} className="hover:underline truncate" target="_blank" rel="noopener noreferrer">
                {file.name}
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
