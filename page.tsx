"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EssayInput from "@/components/EssayInput";
import LoadingState from "@/components/LoadingState";
import type { GradeResult } from "@/lib/types";

// --- 功能卡片数据 ---
const FEATURES = [
  {
    title: "智能评分",
    desc: "严格遵循四六级评分标准",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    title: "语法纠错",
    desc: "精准识别语法与表达问题",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 2 5 5-13 13H3v-5L16 2Z" />
        <line x1="13" y1="7" x2="18" y2="12" />
      </svg>
    ),
  },
  {
    title: "高分改写",
    desc: "一键升级至 11 / 14 分作文",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    title: "结构分析",
    desc: "从阅卷视角优化文章结构",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  },
];

// --- 信任标签 ---
const TRUST_BADGES = [
  {
    label: "数据安全保护",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "拟人化 AI 点评",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: "10W+ 学生已使用",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: "持续优化更新",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (essay: string, topic: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, topic: topic || undefined }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "批改失败");
      }

      const result: GradeResult = await response.json();
      sessionStorage.setItem("gradeResult", JSON.stringify(result));
      sessionStorage.setItem("originalEssay", essay);
      sessionStorage.setItem("essayTopic", topic);
      router.push("/result");
    } catch (e: any) {
      setError(e.message || "网络错误，请重试");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="animate-fade-in">
      {/* ================================================================
          Hero 区域 — 左右布局
          ================================================================ */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* 左侧文字 */}
          <div className="animate-slide-up">
            {/* 金色标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-gold/[0.08] border border-gold/[0.12]
                          text-[13px] text-gold-dark font-medium mb-8">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              基于四六级评分标准 · 拟人化批改 · 提分为目标
            </div>

            {/* 标题 */}
            <h1 className="text-hero font-heading text-ink mb-5 tracking-tight">
              你的四六级作文
              <br />
              <span className="text-gold-gradient">交给真正懂阅卷的老师</span>
            </h1>

            {/* 副标题 */}
            <p className="text-[1.05rem] text-ink-secondary leading-relaxed mb-10 max-w-md">
              不只纠错，更是帮你理解——
              <br />
              阅卷老师眼中，什么样的作文能拿高分
            </p>

            {/* CTA（跳转到下方输入区） */}
            <a
              href="#essay-input"
              className="inline-flex items-center gap-2 btn-gold !w-auto px-10"
            >
              开始批改
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>

          {/* 右侧插画 — 抽象水印 */}
          <div className="relative flex items-center justify-center select-none">
            {/* 背景光晕 */}
            <div className="absolute w-80 h-80 rounded-full bg-gold/[0.06] blur-3xl" />

            {/* 羽毛笔 + 作文纸抽象图形 */}
            <svg
              className="relative w-72 h-72 text-ink/[0.12] animate-float"
              viewBox="0 0 288 288"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              {/* 纸 */}
              <rect x="60" y="40" width="168" height="208" rx="8" fill="white" stroke="currentColor" strokeWidth="1" />
              {/* 横线 */}
              <line x1="80" y1="80" x2="208" y2="80" />
              <line x1="80" y1="104" x2="208" y2="104" />
              <line x1="80" y1="128" x2="190" y2="128" />
              <line x1="80" y1="152" x2="200" y2="152" />
              <line x1="80" y1="176" x2="180" y2="176" />
              <line x1="80" y1="200" x2="195" y2="200" />
              {/* 阅卷勾 √ */}
              <path d="M 140 120 l 8 8 16-20" stroke="#C9A86A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              {/* 金色徽章 */}
              <circle cx="210" cy="200" r="18" fill="none" stroke="#C9A86A" strokeWidth="1.2" opacity="0.6" />
              <text x="204" y="205" fontSize="16" fill="#C9A86A" opacity="0.7">A+</text>
            </svg>
          </div>
        </div>
      </section>

      {/* ================================================================
          主输入区域
          ================================================================ */}
      <section id="essay-input" className="max-w-3xl mx-auto px-8 pb-16 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
        <EssayInput onSubmit={handleSubmit} />

        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm" role="alert">
            {error}
          </div>
        )}
      </section>

      {/* ================================================================
          功能展示卡片 — 4 列
          ================================================================ */}
      <section className="max-w-6xl mx-auto px-8 pb-20">
        <div className="text-center mb-10">
          <p className="text-ink-muted text-sm tracking-wide uppercase">为什么选择</p>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {FEATURES.map((feat) => (
            <div key={feat.title} className="feature-card group">
              <div className="inline-flex items-center justify-center w-12 h-12
                            rounded-xl bg-gold/[0.06] text-gold
                            group-hover:bg-gold/[0.12] group-hover:scale-110
                            transition-all duration-300 mb-4">
                {feat.icon}
              </div>
              <h3 className="text-[15px] font-heading font-semibold text-ink mb-1.5">
                {feat.title}
              </h3>
              <p className="text-[13px] text-ink-muted leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          信任区域
          ================================================================ */}
      <section className="max-w-6xl mx-auto px-8 pb-24">
        <div className="border-t border-surface-border pt-12">
          <div className="flex items-center justify-center gap-12">
            {TRUST_BADGES.map((badge) => (
              <div key={badge.label} className="trust-badge">
                <span className="text-gold/50">{badge.icon}</span>
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
