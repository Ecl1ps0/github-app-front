import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { notification } from "antd";
import { Chat } from "../../models/Chat.entity";
import { Message } from "../../models/Message.entity";

export const textChatApi = createApi({
  reducerPath: "textChatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/text_chats",
  }),
  tagTypes: ["textMessages"],
  endpoints: (builder) => ({
    postCreateTextChat: builder.mutation<
      { text_chat_id: string },
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
    getTextChatMessages: builder.query<Message[], string>({
      query: (chatId) => `/${chatId}/messages`,
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
      providesTags: ["textMessages"],
    }),
    getTextChat: builder.query<Chat, string>({
      query: (chatId) => `/${chatId}`,
      transformResponse: (response: Chat) => {
        response.type = "text";
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
    getChannelTextChats: builder.query<Chat[], string>({
      query: (channelId) => `/channel/${channelId}`,
      transformResponse: (response: Chat[]) =>
        response.map((chat) => ({
          ...chat,
          type: "text",
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
  usePostCreateTextChatMutation,
  useLazyGetTextChatQuery,
  useGetChannelTextChatsQuery,
  useGetTextChatMessagesQuery,
} = textChatApi;
