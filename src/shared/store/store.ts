import { configureStore } from "@reduxjs/toolkit";
import userStore from "./user.store";
import { channelApi } from "../api/channel.api";
import { userApi } from "../api/user.api";
import { voiceChatApi } from "../api/voice_chat.api";

const store = configureStore({
  reducer: {
    user: userStore,
    [channelApi.reducerPath]: channelApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [voiceChatApi.reducerPath]: voiceChatApi.reducer,
    [textChatApi.reducerPath]: textChatApi.reducer,
  },
  middleware: (gdm) =>
    gdm().concat([
      channelApi.middleware,
      userApi.middleware,
      voiceChatApi.middleware,
      textChatApi.middleware,
    ]),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { textChatApi } from "../api/text_chat.api";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
