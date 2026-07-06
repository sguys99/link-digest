import { SettingsContent } from "@/components/settings/settings-content";

export default function SettingsPage() {
  return (
    <div className="space-y-6 py-4">
      <h1 className="text-[1.375rem] font-semibold tracking-tight">설정</h1>
      <SettingsContent />
    </div>
  );
}
