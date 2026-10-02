export interface ConnectRequestEligibility {
  canCreateConnection: boolean;
  blockingReason?: string | null;
  requiresConsultantSupport?: boolean;
  activeConnectRequestId?: string | null;
  activeChatRoomId?: string | null;
  activeTutorId?: string | null;
  connectionStatus?: string | null;
  connectionStage?: string | null;
}

export interface CreateConnectRequestInput {
  tutorId: string;
}

export interface CreatedConnectRequest {
  connectRequestId?: string;
  chatRoomId?: string;
}

export interface OutboundConnectRequest {
  id: string;
  tutorId: string;
  chatRoomId?: string | null;
  status?: string | null;
  createdAt?: string;
}
