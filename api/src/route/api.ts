import express from "express";
import {
  addBio,
  changePasswordUser,
  deleteUser,
  followUnFollowUser,
  getPeople,
  getUsers,
  logout,
  searchUser,
  updatePhotoUser,
  updateUser,
  uploadCoverPic,
} from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import {
  createPost,
  createPostStatus,
  deletePost,
  deletePostStatus,
  generateSignature,
  getFeedPosts,
  getPost,
  getPostStatus,
  getUserPosts,
  likeUnlikePost,
  ReplyToPost,
} from "../controller/post-controller";
import {
  getConversation,
  getConversations,
  getMessages,
  sendMessage,
} from "../controller/message-controller";
import { getNotifications } from "../controller/notification-controller";

export const apiRouter = express.Router();

apiRouter.use(authMiddleware);

// user
apiRouter.get("/people", getPeople);
apiRouter.get("/users/:query?", getUsers);
apiRouter.get("/user/search", searchUser);
apiRouter.post("/follow/:id", followUnFollowUser);
apiRouter.post("/addBio", addBio);
apiRouter.post("/uploadCoverPic", uploadCoverPic);
apiRouter.patch("/users", updateUser);
apiRouter.put("/changePassword", changePasswordUser);
apiRouter.put("/changePhotoProfile", updatePhotoUser);
apiRouter.put("/logout", logout);
apiRouter.delete("/users", deleteUser);

// post
apiRouter.get("/feed", getFeedPosts);
apiRouter.post("/signatureUpload", generateSignature);
apiRouter.get("/post-status", getPostStatus);
apiRouter.post("/post", createPost);
apiRouter.post("/post-status", createPostStatus);
apiRouter.put("/post-status", deletePostStatus);
apiRouter.get("/post/:id", getPost);
apiRouter.get("/post-user/:id", getUserPosts);
apiRouter.delete("/post/:id", deletePost);
apiRouter.put("/like/:id", likeUnlikePost);
apiRouter.post("/reply/:id", ReplyToPost);

//message
apiRouter.get("/conversations", getConversations);
apiRouter.get("/conversation/:id", getConversation);
apiRouter.get("/message/:otherUserId", getMessages);
apiRouter.post("/message", sendMessage);

//notification
apiRouter.get("/notifications", getNotifications);
