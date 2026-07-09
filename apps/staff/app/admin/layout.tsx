export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r p-4">Admin Sidebar</aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
