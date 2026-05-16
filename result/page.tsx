"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { GradeResult } from "@/lib/types";
import { getHistoryEntry, saveToHistory } from "@/lib/storage";
import ScoreCard from "@/components/ScoreCard";
import GrammarSection from "@/components/GrammarSection";
import ExpressionUpgrade from "@/components/ExpressionUpgrade";
import StructureAnalysis from "@/components/StructureAnalysis";
import UpgradedVersion from "@/components/UpgradedVersion";
import LoadingState from "@/components/LoadingState";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const historyId = searchParams.get("id");

  const [result, setResult] = useState<GradeResult | null>(null);
  const [originalEssay, setOriginalEssay] = useState("");
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (historyId) {
      // 从历史记录加载
      const entry = getHistoryEntry(historyId);
      if (entry) {
        setResult(entry.result);
        setOriginalEssay(entry.essay);
        setCurrentHistoryId(historyId);
      } else {
        router.replace("/history");
        return;
      }
    } else {
      // 新批改结果
      const stored = sessionStorage.getItem("gradeResult");
      const essay = sessionStorage.getItem("originalEssay");

      if (stored && essay) {
        try {
          const parsed: GradeResult = JSON.parse(stored);
          setResult(parsed);
          setOriginalEssay(essay);

          // 保存到历史
          const topic =
            sessionStorage.getItem("essayTopic") || "未指定题目";
          const id = saveToHistory(essay, topic, parsed);
          setCurrentHistoryId(id);
        } catch {
          router.replace("/");
          return;
        }
      } else {
        router.replace("/");
        return;
      }
    }
    setLoading(false);
  }, [historyId, router]);

  if (loading) return <LoadingState />;
  if (!result) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 历史回看标记 */}
      {historyId && (
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          历史记录查看
        </div>
      )}

      <ScoreCard
        score={result.score}
        band={result.band}
        distanceToNext={result.distance_to_next_band}
        dimensionScores={result.dimension_scores}
        overallComment={result.overall_comment}
      />

      {result.grammar_errors.length > 0 && (
        <GrammarSection errors={result.grammar_errors} />
      )}

      {result.advanced_expressions.length > 0 && (
        <ExpressionUpgrade expressions={result.advanced_expressions} />
      )}

      <StructureAnalysis feedback={result.structure_feedback} />

      <UpgradedVersion
        originalEssay={originalEssay}
        improvedVersion11={result.improved_version_11}
        improvedVersion14={result.improved_version_14}
        historyId={currentHistoryId}
      />

      <div className="flex gap-4 pt-4 border-t border-surface-border">
        <button
          onClick={() => router.push("/")}
          className="flex-1 btn-secondary"
        >
          返回修改
        </button>
        <button
          onClick={() => {
            sessionStorage.removeItem("gradeResult");
            sessionStorage.removeItem("originalEssay");
            sessionStorage.removeItem("essayTopic");
            router.push("/");
          }}
          className="flex-1 py-3 rounded-xl bg-ink text-white font-medium text-sm
                     hover:bg-ink-light transition-colors duration-200"
        >
          批改新作文
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResultContent />
    </Suspense>
  );
}
