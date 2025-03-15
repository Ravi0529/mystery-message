import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const POST = async (req: Request) => {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    const decodedUsrname = decodeURIComponent(username); // kinda double ckeck
    const user = await UserModel.findOne({ username: decodedUsrname });

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

    const isCodeValid = user?.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Email verified successfully",
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        {
          status: 401,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    console.error("error", error);
    return Response.json(
      {
        success: false,
        message: "An error occurred while sending the message",
      },
      {
        status: 500,
      }
    );
  }
};
