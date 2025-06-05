import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export default function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProp) {
  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast(response.data.message);
    onMessageDelete(message._id as string);
  };

  return (
    <Card className="shadow-md border border-gray-200 rounded-xl p-4 bg-gray-50">
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              {message.content}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {new Date(message.createdAt).toLocaleString()}
            </CardDescription>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the message. You cannot undo this
                  action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteConfirm}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
    </Card>
  );
}
