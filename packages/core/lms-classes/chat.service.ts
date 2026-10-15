import { z } from "zod";
import { classPath, getLmsResource, postLmsCommand } from "./api-response";
import {
  chatPageSchema,
  chatMessageSchema,
  sendMessageSchema,
  subscriptionSchema,
} from "./schemas";

export const classChatService = {
  messages: (classId: string, cursor?: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(classId)}/chat/messages`,
      chatPageSchema,
      signal,
      { cursor, pageSize: 20 },
    ),
  send: (classId: string, input: z.infer<typeof sendMessageSchema>) =>
    postLmsCommand(
      `${classPath(classId)}/chat/messages`,
      chatMessageSchema,
      sendMessageSchema.parse(input),
    ),
  subscription: (classId: string, signal?: AbortSignal) =>
    getLmsResource(
      `${classPath(classId)}/chat/subscription-token`,
      subscriptionSchema,
      signal,
    ),
};
