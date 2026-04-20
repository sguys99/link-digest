import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { QueryProvider } from "@/components/providers/query-provider";
import { toAnnouncementResponse } from "@/lib/api/mappers";
import { LinkDigestLogo } from "@/components/logo";
import { AnnouncementDetail } from "@/components/announcements/announcement-detail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("title")
    .eq("id", id)
    .single();

  return {
    title: data
      ? `${data.title} | 공지사항 | LinkDigest`
      : "공지사항 | LinkDigest",
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAdmin = !!user?.email && user.email === process.env.ADMIN_EMAIL;

  // RLS 적용 조회
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  let announcement = data ? toAnnouncementResponse(data) : null;

  // 관리자: 비공개 공지도 조회 가능
  if (!announcement && isAdmin) {
    const adminSupabase = createAdminClient();
    const { data: adminData } = await adminSupabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();
    if (adminData) {
      announcement = toAnnouncementResponse(adminData);
    }
  }

  if (!announcement) {
    notFound();
  }

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
        <QueryProvider>
          <AnnouncementDetail announcement={announcement} isAdmin={isAdmin} />
        </QueryProvider>
      </main>
    </>
  );
}
