import { apiClient } from "../configs/client";
import { ApiResponse } from "../types/api-response.type";
import {
  FavoriteTutorIdsResponse,
  FavoriteTutorsListParams,
  FavoriteTutorsListResponse,
} from "../types/favorite-tutors.type";

export const favoriteTutorsService = {
  /**
   * GET /me/favorite-tutors/ids
   * Get list of all favorite tutor profile IDs for quick bookmark lookup.
   */
  getFavoriteTutorIds: async (): Promise<FavoriteTutorIdsResponse> => {
    return await apiClient.get("/me/favorite-tutors/ids");
  },

  /**
   * GET /me/favorite-tutors
   * Get learner's paginated list of favorite tutors.
   */
  getFavoriteTutors: async (
    params?: FavoriteTutorsListParams,
  ): Promise<FavoriteTutorsListResponse> => {
    return await apiClient.get("/me/favorite-tutors", { params });
  },

  /**
   * PUT /me/favorite-tutors/{tutorProfileId}
   * Add a tutor profile to learner's favorite list (idempotent).
   */
  addFavoriteTutor: async (
    tutorProfileId: string,
  ): Promise<ApiResponse<undefined>> => {
    return await apiClient.put(`/me/favorite-tutors/${tutorProfileId}`);
  },

  /**
   * DELETE /me/favorite-tutors/{tutorProfileId}
   * Remove a tutor profile from learner's favorite list (idempotent).
   */
  removeFavoriteTutor: async (
    tutorProfileId: string,
  ): Promise<ApiResponse<undefined>> => {
    return await apiClient.delete(`/me/favorite-tutors/${tutorProfileId}`);
  },
};
