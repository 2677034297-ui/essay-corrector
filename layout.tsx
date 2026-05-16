import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "四六级 AI 阅卷老师 — 你的作文提分教练",
  description: "真正懂四六级评分逻辑的 AI 阅卷老师。不只纠错，帮你提分。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col antialiased">
        {/* 72px 毛玻璃导航栏 */}
        <header className="navbar-glass sticky top-0 z-50 h-[72px]">
          <div className="max-w-6xl mx-auto px-8 h-full flex items-center justify-between">
            {/* 左侧 Logo */}
            <a
              href="/"
              className="flex items-center gap-3 no-underline group"
              aria-label="四六级 AI 阅卷老师 — 首页"
            >
              {/* 书卷图标 */}
              <svg
                className="w-8 h-8 text-gold transition-transform duration-300 group-hover:scale-105"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 6h6a4 4 0 0 1 4 4v16a4 4 0 0 0-4-4H4V6Z" />
                <path d="M28 6h-6a4 4 0 0 0-4 4v16a4 4 0 0 1 4-4h6V6Z" />
                <line x1="8" y1="13" x2="12" y2="13" />
                <line x1="8" y1="17" x2="12" y2="17" />
              </svg>

              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-heading font-semibold text-ink tracking-tight">
                  四六级 AI 阅卷老师
                </span>
                <span className="text-[11px] text-ink-muted tracking-wide">
                  CET Essay Grader
                </span>
              </div>
            </a>

            {/* 右侧导航 */}
            <nav className="flex items-center gap-1">
              <a
                href="/history"
                className="px-4 py-2 text-[13px] text-ink-secondary rounded-lg
                           hover:text-ink hover:bg-black/[0.03]
                           transition-all duration-200"
              >
                历史记录
              </a>
              <span className="w-px h-5 bg-surface-border mx-1" />
              <button className="px-4 py-2 text-[13px] text-ink-secondary rounded-lg
                                   hover:text-ink hover:bg-black/[0.03]
                                   transition-all duration-200">
                登录
              </button>
              <button className="ml-1 px-5 py-2 text-[13px] font-medium text-white
                                   bg-ink rounded-xl
                                   hover:bg-ink/90 transition-colors duration-200">
                注册
              </button>
            </nav>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <footer className="text-center text-[13px] text-ink-muted py-10" role="contentinfo">
          四六级 AI 阅卷老师 · 你的专属写作提分教练
        </footer>
      </body>
    </html>
  );
}
