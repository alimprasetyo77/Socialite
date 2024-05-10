export interface INotification {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    profilePic: string;
  };
  recipientId: string;
  message?: string;
  post?: {
    _id: string;
    text: string;
  };
  type: "like" | "follow" | "message";
  read: boolean;
  createdAt: Date;
}
