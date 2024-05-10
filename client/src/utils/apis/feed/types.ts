export interface IFeedType {
  _id: string;
  postedBy: string;
  text: string;
  img: string;
  likes: string[];
  replies: {
    userId: string;
    text: string;
    userProfilePic: string;
    name: string;
    createAt: string;
    id: string;
  }[];
  createdAt: string;
  updateAt: string;
}
