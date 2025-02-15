import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { notification } from "antd";
import { Chat } from "../../models/Chat.entity";

export const voiceChatApi = createApi({
  reducerPath: "voiceChatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/voice_chats",
  }),
  endpoints: (builder) => ({
    postCreateVoiceChat: builder.mutation<
      { voice_chat_id: string },
      { name: string; channel_id?: string }
    >({
      query: (chatData) => ({
        url: "/create",
        method: "POST",
        body: chatData,
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;

          notification.success({
            message: "Success",
            description: "Channel created successfully!",
            duration: 5,
          });
        } catch (error) {
          notification.error({
            message: "Error",
            description: error as string,
            duration: 5,
          });
        }
      },
    }),
    getVoiceChat: builder.query<Chat, string>({
      query: (chatId) => `/${chatId}`,
      transformResponse: (response: Chat) => {
        response.type = "voice";
        return response;
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          notification.error({
            message: "Error",
            description: error as string,
            duration: 5,
          });
        }
      },
    }),
    getChannelVoiceChats: builder.query<Chat[], string>({
      query: (channelId) => `/channel/${channelId}`,
      transformResponse: (response: Chat[]) =>
        response.map((chat) => ({
          ...chat,
          type: "voice",
        })),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch (error) {
          notification.error({
            message: "Error",
            description: error as string,
            duration: 5,
          });
        }
      },
    }),
  }),
});

export const {
  usePostCreateVoiceChatMutation,
  useLazyGetVoiceChatQuery,
  useGetChannelVoiceChatsQuery,
} = voiceChatApi;
