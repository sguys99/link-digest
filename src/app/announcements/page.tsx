import { createClient } from "@/lib/supabase/server";
import { AnnouncementList } from "@/components/announcements/announcement-list";
import { toAnnouncementResponse } from "@/lib/api/mappers";
import { SiteHeader } from "@/components/layout/site-header";

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
      <SiteHeader authed={!!user} />
      <main className="mx-auto max-w-screen-sm px-4 pt-20 pb-12">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">공지사항</h1>
        <AnnouncementList isAdmin={isAdmin} initialData={announcements} />
      </main>
    </>
  );
}
