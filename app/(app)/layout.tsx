import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar />
      <div className="flex flex-1 flex-col">{children}</div>
      <BottomNav />
    </div>
  );
}
