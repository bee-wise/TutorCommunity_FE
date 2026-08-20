import { create } from "zustand";
import {
  CommunityPost,
  CommunityFilters,
  CreatePostInput,
  TutorApplication,
  UserProfile,
} from "../types/community";
import {
  initialMockPosts,
  mockLearnerNoSession,
} from "../lib/mock-community-data";

interface CommunityState {
  currentUser: UserProfile;
  posts: CommunityPost[];
  filters: CommunityFilters;

  // Actions
  setCurrentUser: (user: UserProfile) => void;
  setFilters: (filters: Partial<CommunityFilters>) => void;
  createPost: (input: CreatePostInput) => void;
  applyForPost: (
    postId: string,
    pitchNote: string,
    proposedRate: number,
    availableSlots: string[],
  ) => void;
  acceptApplication: (postId: string, applicationId: string) => void;
  updatePost: (postId: string, input: Partial<CreatePostInput>) => void;
  deletePost: (postId: string) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  currentUser: mockLearnerNoSession, // Default mock user
  posts: initialMockPosts,
  filters: {
    searchQuery: "",
    teachingMode: "ALL",
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  createPost: (input) =>
    set((state) => {
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        author: state.currentUser,
        content: input.content,
        imageUrls: input.imageUrls,
        subject: input.subject,
        gradeLevel: input.gradeLevel,
        teachingMode: input.teachingMode,
        city: input.city,
        district: input.district,
        budgetPerSession: input.budgetPerSession,
        status: "OPEN",
        createdAt: new Date().toISOString(),
        applicationsCount: 0,
        applications: [],
      };
      return { posts: [newPost, ...state.posts] };
    }),

  applyForPost: (postId, pitchNote, proposedRate, availableSlots) =>
    set((state) => {
      const newApplication: TutorApplication = {
        id: `app-${Date.now()}`,
        postId,
        tutor: state.currentUser,
        pitchNote,
        proposedRate,
        availableSlots,
        createdAt: new Date().toISOString(),
        status: "PENDING",
      };

      const updatedPosts = state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            applicationsCount: post.applicationsCount + 1,
            applications: [newApplication, ...post.applications],
          };
        }
        return post;
      });

      return { posts: updatedPosts };
    }),

  acceptApplication: (postId, applicationId) =>
    set((state) => {
      const updatedPosts = state.posts.map((post) => {
        if (post.id === postId) {
          const updatedApps = post.applications.map((app) =>
            app.id === applicationId
              ? { ...app, status: "ACCEPTED" as const }
              : app,
          );
          return {
            ...post,
            status: "IN_SESSION" as const,
            applications: updatedApps,
          };
        }
        return post;
      });

      return { posts: updatedPosts };
    }),

  updatePost: (postId, input) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, ...input } : post,
      ),
    })),

  deletePost: (postId) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== postId),
    })),
}));
