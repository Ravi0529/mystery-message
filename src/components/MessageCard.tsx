import {
  Card,
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
import { X, MessageSquare, Clock } from "lucide-react";
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
    <Card className="group relative bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors duration-200">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </div>
          </div>

          <div className="flex-grow min-w-0 space-y-1">
            <CardTitle className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2">
              {message.content}
            </CardTitle>
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              <CardDescription className="text-xs sm:text-sm">
                {new Date(message.createdAt).toLocaleString()}
              </CardDescription>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                  Delete Message?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm sm:text-base text-gray-600">
                  This will permanently delete the message. You cannot undo this
                  action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-3">
                <AlertDialogCancel className="mt-0 border-gray-200 hover:bg-gray-50">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-black hover:bg-gray-900 text-white transition-colors duration-200"
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
