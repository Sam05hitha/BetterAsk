import { useMutation } from "@tanstack/react-query";
import { sendResponseFeedback } from "../services/query/queryServices";
import { useAlert } from "../components/AlertBar/AlertBar";

export default function useFeatures({
  onSettled,
  onError,
}: {
  onSettled?: (data: any) => void;
  onError?: (data: any) => void;
}) {
  const alert = useAlert();
  const { status: feedbackStatus, mutateAsync: feedback } = useMutation({
    mutationFn: (params: {
      conversation_id: string;
      like_dislike: boolean;
      response_feedback: string;
    }) =>
      sendResponseFeedback(
        params.conversation_id,
        params.like_dislike,
        params.response_feedback
      ),
    onSuccess(data, _variables, _context) {
      onSettled?.(data);
      alert.onOpen();
      alert.onConfig({
        severity: "success",
        title: "Thank you for your feedback",
        isPrompt: false,
        disableAutoClose: false,
      });
    },
    onError(error) {
      onError?.(error);
    },
  });

  return { feedbackStatus, feedback, alert };
}
