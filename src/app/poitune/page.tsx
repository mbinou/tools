"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Section } from "../components/Section";
import { Toggle } from "../components/Toggle";
import { clamp, Num } from "../components/Num";
import { Color } from "../components/Color";
import { LocusSide, RotationParams, SidePanel } from "../components/SidePanel";

export type CommonParams = {
  fps: number; // 目標FPS（内部では requestAnimationFrame 優先）
  afterimage: number; // 0..1（背景の透過塗りで残像表現）
  speedRate: number; // 再生速度倍率（0.1〜10 想定）
  scale: number; // 全体スケール（0.1〜10）
  numberOfLocus: 1 | 2; // 1=左のみ / 2=両方
  backgroundColor: string; // 背景色
  grid: { show: boolean; color: string };
};

const defaultCommon: CommonParams = {
  fps: 30,
  afterimage: 0.8,
  speedRate: 1,
  scale: 1,
  numberOfLocus: 2,
  backgroundColor: "#000000",
  grid: { show: true, color: "#333333" },
};

export const defaultSide = (
  radiusHand: number,
  radiusPoi: number,
  omegaHand: number,
  omegaPoi: number,
  angleHand: number,
  anglePoi: number
): LocusSide => ({
  objectVisible: { origin: true, hand: true, poi: true },
  objectSize: { origin: 2, hand: 4, poi: 10 },
  objectColor: { origin: "#888888", hand: "#00ffcc", poi: "#ffcc00" },
  rotation: {
    radiusHand,
    radiusPoi,
    omegaHand,
    omegaPoi,
    angleHand,
    anglePoi,
    originX: 320,
    originY: 170,
  },
  segmentVisible: { arm: true, chain: true },
  segmentSize: { arm: 2, chain: 2 },
  segmentColor: { arm: "#ffffff", chain: "#999999" },
});

export const EXAMPLES: Record<
  string,
  () => { left: LocusSide; right: LocusSide; common?: Partial<CommonParams> }
> = {
  Clover: () => {
    return {
      left: defaultSide(70, 70, 1, -3, 0, 0),
      right: defaultSide(70, 70, 1, -3, Math.PI, Math.PI),
    };
  },
  "Negative Clover": () => {
    return {
      left: defaultSide(70, 70, 3, -1, 0, 0),
      right: defaultSide(70, 70, 3, -1, Math.PI, Math.PI),
    };
  },
  Pentagram: () => {
    return {
      left: defaultSide(70, 70, 1, -4, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
      right: defaultSide(
        70,
        70,
        1,
        -4,
        (Math.PI / 180) * 126,
        (Math.PI / 180) * 126
      ),
    };
  },
  "Clear Pentagram": () => {
    return {
      left: defaultSide(70, 70, 2, -3, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
      right: defaultSide(
        70,
        70,
        2,
        -3,
        (Math.PI / 180) * 126,
        (Math.PI / 180) * 126
      ),
    };
  },
  Hexagram: () => {
    return {
      left: defaultSide(70, 70, 1, -5, Math.PI / 2, Math.PI / 2),
      right: defaultSide(70, 70, 1, -5, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  "Clear Hexagram": () => {
    return {
      left: defaultSide(70, 70, 1, -2, Math.PI / 2, Math.PI / 2),
      right: defaultSide(70, 70, 1, -2, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  "Cat Eye": () => {
    return {
      left: defaultSide(50, 100, 1, -1, Math.PI / 2, Math.PI / 2),
      right: defaultSide(50, 100, 1, -1, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  "Linear Cat Eye": () => {
    return {
      left: defaultSide(70, 70, 1, -1, Math.PI / 2, Math.PI / 2),
      right: defaultSide(70, 70, 1, -1, (Math.PI / 2) * 3, (Math.PI / 2) * 3),
    };
  },
  Isolation: () => {
    return {
      left: defaultSide(70, 140, 1, 1, 0, Math.PI),
      right: defaultSide(70, 140, 1, 1, Math.PI, 2 * Math.PI),
    };
  },
};

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [w, h] = [640, 340];

  const [common, setCommon] = useState<CommonParams>(defaultCommon);
  const [left, setLeft] = useState<LocusSide>(() =>
    defaultSide(70, 70, 1, -3, 0, 0)
  );
  const [right, setRight] = useState<LocusSide>(() =>
    defaultSide(70, 70, 1, -3, Math.PI, Math.PI)
  );

  const [syncLR, setSyncLR] = useState(false); // L-R同期
  const [activeTab, setActiveTab] = useState<
    "general" | "left" | "right" | "examples"
  >("general");

  // L-R同期: Left を編集したら Right に反映（初期角のみ +180°規則）
  const applySyncFromLeft = (nextLeft: LocusSide) => {
    setLeft(nextLeft);
    if (syncLR) {
      const l = nextLeft.rotation;
      const rRot: RotationParams = {
        ...l,
        angleHand: l.angleHand + Math.PI,
        anglePoi: l.anglePoi + Math.PI,
      };
      setRight({ ...nextLeft, rotation: rRot });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let prev = performance.now();

    const drawGrid = () => {
      if (!common.grid.show) return;
      ctx.save();
      ctx.strokeStyle = common.grid.color;
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    };

    // 状態をローカルコピー（パフォ&一貫性向上）
    const l = structuredClone(left);
    const r = structuredClone(right);

    const render = () => {
      const now = performance.now();
      const dt = ((now - prev) / 500) * common.speedRate; // 秒
      prev = now;

      // 残像: 背景色を透過で塗る
      ctx.globalAlpha = 1 - clamp(common.afterimage, 0, 1);
      ctx.fillStyle = common.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      ctx.globalAlpha = 1;

      // グリッド（背景の上）
      drawGrid();

      const sides: LocusSide[] = common.numberOfLocus === 2 ? [l, r] : [l];

      for (const side of sides) {
        const {
          rotation,
          objectVisible,
          objectSize,
          objectColor,
          segmentVisible,
          segmentSize,
          segmentColor,
        } = side;

        // 角度更新
        rotation.angleHand += rotation.omegaHand * dt;
        rotation.anglePoi += rotation.omegaPoi * dt;

        // 座標計算
        const hx =
          rotation.originX +
          Math.cos(rotation.angleHand) * rotation.radiusHand * common.scale;
        const hy =
          rotation.originY +
          Math.sin(rotation.angleHand) * rotation.radiusHand * common.scale;
        const px =
          hx + Math.cos(rotation.anglePoi) * rotation.radiusPoi * common.scale;
        const py =
          hy + Math.sin(rotation.anglePoi) * rotation.radiusPoi * common.scale;

        // セグメント（線）
        if (segmentVisible.chain) {
          ctx.strokeStyle = segmentColor.chain;
          ctx.lineWidth = segmentSize.chain;
          ctx.beginPath();
          ctx.moveTo(rotation.originX, rotation.originY);
          ctx.lineTo(hx, hy);
          ctx.stroke();
        }
        if (segmentVisible.arm) {
          ctx.strokeStyle = segmentColor.arm;
          ctx.lineWidth = segmentSize.arm;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        // オブジェクト
        const drawDot = (x: number, y: number, size: number, color: string) => {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        };
        if (objectVisible.origin)
          drawDot(
            rotation.originX,
            rotation.originY,
            objectSize.origin,
            objectColor.origin
          );
        if (objectVisible.hand)
          drawDot(hx, hy, objectSize.hand, objectColor.hand);
        if (objectVisible.poi) drawDot(px, py, objectSize.poi, objectColor.poi);
      }

      animId = requestAnimationFrame(render);
    };

    // 初期クリア
    ctx.fillStyle = common.backgroundColor;
    ctx.fillRect(0, 0, w, h);
    drawGrid();

    prev = performance.now();
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [common, left, right, w, h]);

  const applyExample = (key: string) => {
    const fn = EXAMPLES[key];
    if (!fn) return;
    const { left: l, right: r, common: c } = fn();
    if (syncLR) setSyncLR(false);
    setLeft(l);
    setRight(r);
    if (c) setCommon({ ...common, ...c });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100">
      <div className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-bold tracking-wide">Poitune</div>
          <div className="flex items-center gap-2 text-sm opacity-80">
            Poi flowers simulator.
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Poitune</h1>
            <p className="opacity-80">ポイ軌道シミュレーター</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-3 py-2 rounded-xl border ${
                syncLR ? "bg-white text-black" : "bg-transparent"
              }`}
              onClick={() => setSyncLR((v) => !v)}
            >
              Sync L-R {syncLR ? "ON" : "OFF"}
            </button>
            <button
              className="px-3 py-2 rounded-xl border"
              onClick={() => {
                setCommon(defaultCommon);
                const l = defaultSide(70, 70, 1, -3, 0, 0);
                const r = defaultSide(70, 70, 1, -3, Math.PI, Math.PI);
                setLeft(l);
                setRight(r);
                setSyncLR(false);
              }}
            >
              リセット
            </button>
          </div>
        </header>

        <div className="flex gap-2 text-sm">
          {(["general", "left", "right", "examples"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-2 rounded-full border ${
                activeTab === t ? "bg-white text-black" : "bg-transparent"
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border p-3 bg-black">
          <div className="border rounded-xl overflow-hidden bg-black">
            <canvas
              ref={canvasRef}
              width={w}
              height={h}
              className="mx-auto block"
            />
          </div>
        </div>

        {activeTab === "general" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Section title="共通設定">
              <Num
                label="FPS"
                value={common.fps}
                min={1}
                max={240}
                onChange={(v) => setCommon({ ...common, fps: v })}
              />
              <Num
                label="残像(0..1)"
                value={common.afterimage}
                step={0.05}
                min={0}
                max={1}
                onChange={(v) => setCommon({ ...common, afterimage: v })}
              />
              <Num
                label="速度率"
                value={common.speedRate}
                step={0.1}
                min={0.1}
                max={10}
                onChange={(v) => setCommon({ ...common, speedRate: v })}
              />
              <Num
                label="拡大率"
                value={common.scale}
                step={0.1}
                min={0.1}
                max={10}
                onChange={(v) => setCommon({ ...common, scale: v })}
              />
              <label className="flex items-center gap-2 text-sm">
                <span className="w-36 shrink-0">表示数</span>
                <select
                  className="border rounded px-2 py-1"
                  value={common.numberOfLocus}
                  onChange={(e) =>
                    setCommon({
                      ...common,
                      numberOfLocus: Number(e.target.value) as 1 | 2,
                    })
                  }
                >
                  <option value={2}>両方</option>
                  <option value={1}>片方（Left）</option>
                </select>
              </label>
              <Color
                label="背景色"
                value={common.backgroundColor}
                onChange={(v) => setCommon({ ...common, backgroundColor: v })}
              />
            </Section>
            <Section title="グリッド">
              <Toggle
                label="表示"
                value={common.grid.show}
                onChange={(v) =>
                  setCommon({ ...common, grid: { ...common.grid, show: v } })
                }
              />
              <Color
                label="カラー"
                value={common.grid.color}
                onChange={(v) =>
                  setCommon({ ...common, grid: { ...common.grid, color: v } })
                }
              />
            </Section>
          </div>
        )}

        {activeTab === "left" && (
          <SidePanel
            title="Left"
            side={left}
            setSide={(s) => (syncLR ? applySyncFromLeft(s) : setLeft(s))}
          />
        )}

        {activeTab === "right" && (
          <SidePanel title="Right" side={right} setSide={setRight} />
        )}

        {activeTab === "examples" && (
          <div className="grid md:grid-cols-2 gap-4">
            <Section title="Examples">
              <div className="flex flex-wrap gap-2">
                {Object.keys(EXAMPLES).map((k) => (
                  <button
                    key={k}
                    className="px-3 py-2 rounded-xl border"
                    onClick={() => applyExample(k)}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <p className="text-sm opacity-80 mt-2">
                例をクリックするとパラメータが上書きされます。Sync L-R
                は自動でOFFになります。
              </p>
            </Section>
            <Section title="ヒント">
              <ul className="list-disc pl-5 text-sm space-y-1 opacity-90">
                <li>半径比・角速度比で花弁の形が変化します</li>
                <li>初期角の相対差で上下/左右対称が変わります</li>
                <li>残像を上げると軌跡が残り、分析に便利です</li>
                <li>グリッド＋低速度でパターンの分解がしやすいです</li>
              </ul>
            </Section>
          </div>
        )}

        <footer className="opacity-70 text-sm text-center py-8">
          © Poitune (Next.js ver.) — rebuilt by mbino.
        </footer>
      </main>
    </div>
  );
}
