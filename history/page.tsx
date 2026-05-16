"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { HistoryEntry } from "@/lib/types";
import { getHistory, deleteHistoryEntry } from "@/lib/storage";

function scoreColor(score: number): string {
  if (score >= 14) return "text-score-green";
  if (score >= 11) return "text-score-amber";
  return "text-score-red";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "刚刚";
  if (mins < 60) return `${mins} 分钟前`;
  if (hours < 24) return `${hours} 小时前`;
  if (days < 7) return `${days} 天前`;
  return d.toLocaleDateString("zh-CN");
}

export default function HistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setLoaded(true);
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("确定删除这条记录？")) return;
    deleteHistoryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleView = (id: string) => {
    router.push(`/result?id=${id}`);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-28">
        <div className="w-5 h-5 border-2 border-surface-border border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display font-heading text-ink">历史记录</h1>
          <p className="text-ink-muted text-sm mt-1">
            共 {entries.length} 篇批改记录
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="btn-primary !w-auto px-6 py-2.5 text-sm"
        >
          批改新作文
        </button>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-surface-border"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
          <p className="text-ink-muted text-sm mb-4">还没有批改记录</p>
          <button
            onClick={() => router.push("/")}
            className="text-gold text-sm font-medium hover:underline transition-colors duration-150"
          >
            去批改第一篇作文
          </button>
        </div>
      )}

      {/* Entry list */}
      {entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => handleView(entry.id)}
              className="card cursor-pointer group hover:border-gold/30 transition-all duration-200 hover:shadow-sm"
            >
              <div className="p-5 flex items-center gap-5">
                {/* Score badge */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center ${
                    entry.result.score >= 14
                      ? "bg-green-50"
                      : entry.result.score >= 11
                      ? "bg-amber-50"
                      : "bg-red-50"
                  }`}
                >
                  <span
                    className={`text-xl font-heading font-bold ${scoreColor(
                      entry.result.score
                    )}`}
                  >
                    {entry.result.score}
                  </span>
                  <span className="text-[10px] text-ink-muted">/14</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-medium text-ink text-sm truncate">
                    {entry.topic || "未指定题目"}
                  </h3>
                  <p className="text-xs text-ink-muted mt-0.5 line-clamp-1">
                    {entry.essay.slice(0, 80)}
                    {entry.essay.length > 80 ? "..." : ""}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[10px] text-ink-muted/70">
                      {formatDate(entry.createdAt)}
                    </span>
                    <span className="text-[10px] text-ink-muted/70">
                      {entry.result.band}
                    </span>
                    {entry.essay.split(/\s+/).filter((w) => w.length > 0)
                      .length > 0 && (
                      <span className="text-[10px] text-ink-muted/70">
                        {
                          entry.essay
                            .split(/\s+/)
                            .filter((w) => w.length > 0).length
                        }{" "}
                        词
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="flex-shrink-0 p-2 rounded-lg text-ink-muted/40
                             hover:text-score-red hover:bg-red-50
                             transition-colors duration-150 opacity-0 group-hover:opacity-100
                             cursor-pointer"
                  aria-label="删除记录"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </button>

                {/* Arrow */}
                <svg
                  className="w-4 h-4 text-ink-muted/30 flex-shrink-0
                             group-hover:text-gold group-hover:translate-x-0.5
                             transition-all duration-200"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
