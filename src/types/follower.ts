export interface FollowingUser {
  broadcaster_type: string;
  created_at: string;
  description: string;
  display_name: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: string;
  view_count: string;
}

export interface FollowingUsersResponse {
  data: FollowingUser[];
}
