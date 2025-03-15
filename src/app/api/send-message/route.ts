import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export const POST = async (req: Request) => {
  await dbConnect();

  const { username, content } = await req.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // is user accepting the messages?
    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message posted successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("error", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while fetching user information",
      },
      {
        status: 500,
      }
    );
  }
};
