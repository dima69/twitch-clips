import { FollowingUsersResponse } from "../types/follower";
import create from "zustand";

// @@@ setUserFollowsData: (data: any)?
interface UserState {
  username: string;
  isAuth: boolean;
  userFollowsData: FollowingUsersResponse;
  toggleIsAuth: () => void;
  setUsername: (username: string) => void;
  setUserFollowsData: (data: FollowingUsersResponse) => void;
  globalVolume: number;
  setGlobalVolume: (volume: number) => void;
  setVideoMuted: (muted: boolean) => void;
  videoMuted: boolean;
}

const useUserStore = create<UserState>()((set) => ({
  username: "",
  globalVolume: 0.5,
  isAuth: false,
  userFollowsData: { data: [] },
  toggleIsAuth: () => set((state) => ({ isAuth: !state.isAuth })),
  setUsername: (username) => set((state) => ({ username: username })),
  setUserFollowsData: (data) => set((state) => ({ userFollowsData: data })),
  setGlobalVolume: (volume) => set((state) => ({ globalVolume: volume })),
  videoMuted: false,
  setVideoMuted: (muted) => set((state) => ({ videoMuted: muted })),
}));

export default useUserStore;
