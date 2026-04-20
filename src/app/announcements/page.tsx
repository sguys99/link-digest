import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QueryProvider } from "@/components/providers/query-provider";
import { AnnouncementList } from "@/components/announcements/announcement-list";
import { toAnnouncementResponse } from "@/lib/api/mappers";
import { LinkDigestLogo } from "@/components/logo";

export const metadata = {
  title: "공지사항 | LinkDigest",
  description: "LinkDigest 공지사항",
};

export default async function AnnouncementsPage() {
  const supabase = await createClient();

  // 현재 사용자 확인 (비인증도 허용)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin =
    !!user?.email && user.email === process.env.ADMIN_EMAIL;

  // 공개된 공지사항 조회 (관리자는 전체 조회)
  let query = supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (!isAdmin) {
    query = query.eq("is_published", true);
  }

  const { data } = await query;
  const announcements = (data ?? []).map(toAnnouncementResponse);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-2"
          >
            <LinkDigestLogo size={24} />
            <span className="text-lg font-bold tracking-tight">LinkDigest</span>
          </Link>
          <Link
            href={user ? "/dashboard" : "/"}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            {user ? "대시보드" : "홈"}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-screen-sm px-4 pt-20 pb-12">
        <h1 className="mb-6 text-2xl font-bold">공지사항</h1>
        <QueryProvider>
          <AnnouncementList isAdmin={isAdmin} initialData={announcements} />
        </QueryProvider>
      </main>
    </>
  );
}
