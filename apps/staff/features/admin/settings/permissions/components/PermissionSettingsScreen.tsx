import { PermissionsManager } from "./PermissionsManager";

export function PermissionSettingsScreen() {
  return (
    <main className="min-h-[100dvh] bg-muted/40 px-4 py-7 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-7">
        <PermissionsManager />
      </div>
    </main>
  );
}
