import type { ApiResponse } from "@workspace/core/types/api-response.type";

export type TutorViewRecordStatus = "COUNTED" | "DUPLICATE" | "SELF_VIEW";

export interface RecordTutorViewRequest {
  viewId: string;
}

export interface RecordTutorViewData {
  recorded: boolean;
  status: TutorViewRecordStatus;
}

export interface TutorViewsData {
  profileId: string;
  totalViews: number;
}

export type RecordTutorViewResponse = ApiResponse<RecordTutorViewData>;
export type GetTutorViewsResponse = ApiResponse<TutorViewsData>;
