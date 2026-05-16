import { NextRequest, NextResponse } from "next/server";
import { callDeepSeek } from "@/lib/deepseek";
import {
  SYSTEM_PROMPT,
  SCORING_PROMPT,
  GRAMMAR_PROMPT,
  buildScoringMessage,
  buildGrammarMessage,
} from "@/lib/prompts";
import type { GradeResult } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const essay = body.essay?.trim();
    const topic = body.topic?.trim();

    if (!essay) {
      return NextResponse.json(
        { error: "请提供作文内容" },
        { status: 400 }
      );
    }

    if (essay.length < 30) {
      return NextResponse.json(
        { error: "作文太短，至少需要30个词" },
        { status: 400 }
      );
    }

    // 并行调用两个 Prompt：评分 + 语法纠错
    const [scoringRaw, grammarRaw] = await Promise.all([
      callDeepSeek(
        SYSTEM_PROMPT + "\n\n" + SCORING_PROMPT,
        buildScoringMessage(essay, topic),
        0.3
      ),
      callDeepSeek(
        SYSTEM_PROMPT + "\n\n" + GRAMMAR_PROMPT,
        buildGrammarMessage(essay),
        0.3
      ),
    ]);

    // 解析 JSON 响应
    let scoringResult;
    let grammarResult;

    try {
      scoringResult = JSON.parse(extractJSON(scoringRaw));
    } catch {
      return NextResponse.json(
        { error: "评分解析失败，请重试", raw: scoringRaw },
        { status: 500 }
      );
    }

    try {
      grammarResult = JSON.parse(extractJSON(grammarRaw));
    } catch {
      grammarResult = { grammar_errors: [], advanced_expressions: [] };
    }

    // 合并结果
    const result: GradeResult = {
      score: scoringResult.score,
      band: scoringResult.band,
      distance_to_next_band: scoringResult.distance_to_next_band,
      overall_comment: scoringResult.overall_comment,
      dimension_scores: scoringResult.dimension_scores,
      grammar_errors: grammarResult.grammar_errors || [],
      advanced_expressions: grammarResult.advanced_expressions || [],
      structure_feedback: scoringResult.structure_feedback,
      improved_version_11: "",
      improved_version_14: "",
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("批改失败:", error);
    return NextResponse.json(
      { error: `批改失败：${error.message}` },
      { status: 500 }
    );
  }
}

// 从 AI 返回中提取 JSON（处理可能的 markdown 包裹）
function extractJSON(text: string): string {
  // 去掉 markdown 代码块
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  // 找到第一个 { 和最后一个 }
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }
  return cleaned;
}
