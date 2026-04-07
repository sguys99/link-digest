import { SettingsContent } from "@/components/settings/settings-content";

export default function SettingsPage() {
  return (
    <div className="space-y-6 py-4">
      <h1 className="text-lg font-bold">설정</h1>
      <SettingsContent />
    </div>
  );
}
