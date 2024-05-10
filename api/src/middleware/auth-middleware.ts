import { Request, Response, NextFunction } from "express";
import User, { IUserSchema } from "../model/user-model";
import jwt, { JwtPayload } from "jsonwebtoken";
// interface UserRequest extends Request {
//   user: IUserSchema;
// }

export const authMiddleware = async (
  req: Request & { user?: IUserSchema },
  res: Response,
  next: NextFunction
) => {
  // const token = req.headers.authorization?.replace("Bearer ", "");
  // const token = req.cookies.token;

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ errors: "Unauthorized" }).end();

    const decoded = jwt.verify(token!, "secret");

    const user = await User.findOne({ _id: (decoded as JwtPayload).id });
    if (!user) return res.status(404).json({ errors: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ errors: (error as Error).message });
  }
};
