import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import {
  SYSTEM_PROMPT,
  getUpgradePrompt,
  buildUpgradeMessage,
} from "@/lib/prompts";
import type { UpgradeResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const essay = body.essay?.trim();
    const targetBand = body.target_band;

    if (!essay) {
      return NextResponse.json(
        { error: "请提供作文内容" },
        { status: 400 }
      );
    }

    if (targetBand !== "11" && targetBand !== "14") {
      return NextResponse.json(
        { error: "目标档位必须是 11 或 14" },
        { status: 400 }
      );
    }

    const upgradePrompt = getUpgradePrompt(targetBand);
    const raw = await callDeepSeek(
      SYSTEM_PROMPT + "\n\n" + upgradePrompt,
      buildUpgradeMessage(essay, targetBand),
      0.5
    );

    let result: UpgradeResult;
    try {
      result = JSON.parse(extractJSON(raw));
    } catch {
      // 如果解析失败，把原始内容当作改写结果
      result = {
        improved_version: raw,
        changes_summary: "已根据要求优化表达和句式",
      };
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("升档失败:", error);
    return NextResponse.json(
      { error: `升档失败：${error.message}` },
      { status: 500 }
    );
  }
}

function extractJSON(text: string): string {
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}
