import type { UserInterface } from "./user.type";

export interface ConversationInterface {
  _id: string;
  user1: UserInterface;
  user2: UserInterface;
  lastMessage: MessageInterface;
  createdAt: string;
  updatedAt: string;
}

export interface MessageInterface {
  _id: string;
  conversationId: string;
  senderId: UserInterface;
  content: string;
  messageType: string;
  attachments: AttachmentInterface[];
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttachmentInterface {
  _id: string;
  messageId: string;
  uploaderId: string;
  fileType: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl: string;
}
