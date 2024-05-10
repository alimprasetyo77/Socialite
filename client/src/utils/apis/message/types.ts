export interface IConversations {
  lastMessage: LastMessage;
  _id: string;
  participants: Participant[];
  createdAt?: Date;
  mock?: boolean;
}

export interface LastMessage {
  seen: boolean;
  text: string;
  sender: string;
}

export interface Participant {
  _id: string;
  username: string;
  profilePic: string;
}

export interface IConversation {
  _id: string;
  participants: Participant[];
}

export interface IMessagePayload {
  _id: string;
  conversationId: string;
  sender: string;
  text: string;
  img?: string;
  seen: boolean;
}
[];

export interface IMessage {
  recipientId: string;
  message: string;
}
