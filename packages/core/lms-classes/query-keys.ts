export const lmsClassKeys = {
  all: ["lms-class-resources"] as const,
  actor: (actor: string) => ["lms-class-resources", actor] as const,
  class: (actor: string, id: string) =>
    ["lms-class-resources", actor, id] as const,
  resource: (
    actor: string,
    id: string,
    name: string,
    ...params: readonly unknown[]
  ) => ["lms-class-resources", actor, id, name, ...params] as const,
};
