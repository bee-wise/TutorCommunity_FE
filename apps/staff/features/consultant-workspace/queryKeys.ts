export const consultantWidgetKeys = {
  trials: (roomId: string) => ["consultant-workspace", "trials", roomId] as const,
  confirmations: (roomId: string) =>
    ["consultant-workspace", "confirmations", roomId] as const,
};
