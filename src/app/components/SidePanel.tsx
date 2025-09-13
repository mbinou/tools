import { LocusSide } from "../page";
import { Color } from "./Color";
import { Num } from "./Num";
import { Section } from "./Section";
import { Toggle } from "./Toggle";

// const deg2rad = (d: number) => (d * Math.PI) / 180;

export const SidePanel = ({
  side,
  setSide,
  title,
}: {
  side: LocusSide;
  setSide: (s: LocusSide) => void;
  title: string;
}) => (
  <div className="grid md:grid-cols-2 gap-4">
    <Section title={`${title} / 物体`}>
      <Toggle
        label="原点"
        value={side.objectVisible.origin}
        onChange={(v) =>
          setSide({
            ...side,
            objectVisible: { ...side.objectVisible, origin: v },
          })
        }
      />
      <Toggle
        label="手"
        value={side.objectVisible.hand}
        onChange={(v) =>
          setSide({
            ...side,
            objectVisible: { ...side.objectVisible, hand: v },
          })
        }
      />
      <Toggle
        label="ポイ"
        value={side.objectVisible.poi}
        onChange={(v) =>
          setSide({
            ...side,
            objectVisible: { ...side.objectVisible, poi: v },
          })
        }
      />
      <Num
        label="原点サイズ"
        value={side.objectSize.origin}
        onChange={(v) =>
          setSide({ ...side, objectSize: { ...side.objectSize, origin: v } })
        }
      />
      <Num
        label="手サイズ"
        value={side.objectSize.hand}
        onChange={(v) =>
          setSide({ ...side, objectSize: { ...side.objectSize, hand: v } })
        }
      />
      <Num
        label="ポイサイズ"
        value={side.objectSize.poi}
        onChange={(v) =>
          setSide({ ...side, objectSize: { ...side.objectSize, poi: v } })
        }
      />
      <Color
        label="原点色"
        value={side.objectColor.origin}
        onChange={(v) =>
          setSide({
            ...side,
            objectColor: { ...side.objectColor, origin: v },
          })
        }
      />
      <Color
        label="手色"
        value={side.objectColor.hand}
        onChange={(v) =>
          setSide({ ...side, objectColor: { ...side.objectColor, hand: v } })
        }
      />
      <Color
        label="ポイ色"
        value={side.objectColor.poi}
        onChange={(v) =>
          setSide({ ...side, objectColor: { ...side.objectColor, poi: v } })
        }
      />
    </Section>
    <Section title={`${title} / 回転`}>
      <Num
        label="手半径"
        value={side.rotation.radiusHand}
        onChange={(v) =>
          setSide({ ...side, rotation: { ...side.rotation, radiusHand: v } })
        }
      />
      <Num
        label="ポイ半径"
        value={side.rotation.radiusPoi}
        onChange={(v) =>
          setSide({ ...side, rotation: { ...side.rotation, radiusPoi: v } })
        }
      />
      <Num
        label="手角速度(回/秒)"
        value={side.rotation.omegaHand}
        step={0.1}
        onChange={(v) =>
          setSide({
            ...side,
            rotation: { ...side.rotation, omegaHand: v },
          })
        }
      />
      <Num
        label="ポイ角速度(回/秒)"
        value={side.rotation.omegaPoi}
        step={0.1}
        onChange={(v) =>
          setSide({
            ...side,
            rotation: { ...side.rotation, omegaPoi: v },
          })
        }
      />
      <Num
        label="手初期角(°)"
        value={side.rotation.angleHand / (Math.PI / 180)}
        step={5}
        onChange={(v) =>
          setSide({
            ...side,
            rotation: { ...side.rotation, angleHand: v * (Math.PI / 180) },
          })
        }
      />
      <Num
        label="ポイ初期角(°)"
        value={side.rotation.anglePoi / (Math.PI / 180)}
        step={5}
        onChange={(v) =>
          setSide({
            ...side,
            rotation: { ...side.rotation, anglePoi: v * (Math.PI / 180) },
          })
        }
      />
      <Num
        label="原点X"
        value={side.rotation.originX}
        onChange={(v) =>
          setSide({ ...side, rotation: { ...side.rotation, originX: v } })
        }
      />
      <Num
        label="原点Y"
        value={side.rotation.originY}
        onChange={(v) =>
          setSide({ ...side, rotation: { ...side.rotation, originY: v } })
        }
      />
    </Section>
    <Section title={`${title} / 線分`}>
      <Toggle
        label="腕"
        value={side.segmentVisible.arm}
        onChange={(v) =>
          setSide({
            ...side,
            segmentVisible: { ...side.segmentVisible, arm: v },
          })
        }
      />
      <Toggle
        label="コード"
        value={side.segmentVisible.chain}
        onChange={(v) =>
          setSide({
            ...side,
            segmentVisible: { ...side.segmentVisible, chain: v },
          })
        }
      />
      <Num
        label="腕の太さ"
        value={side.segmentSize.arm}
        step={0.5}
        onChange={(v) =>
          setSide({ ...side, segmentSize: { ...side.segmentSize, arm: v } })
        }
      />
      <Num
        label="コードの太さ"
        value={side.segmentSize.chain}
        step={0.5}
        onChange={(v) =>
          setSide({ ...side, segmentSize: { ...side.segmentSize, chain: v } })
        }
      />
      <Color
        label="腕の色"
        value={side.segmentColor.arm}
        onChange={(v) =>
          setSide({ ...side, segmentColor: { ...side.segmentColor, arm: v } })
        }
      />
      <Color
        label="コードの色"
        value={side.segmentColor.chain}
        onChange={(v) =>
          setSide({
            ...side,
            segmentColor: { ...side.segmentColor, chain: v },
          })
        }
      />
    </Section>
  </div>
);
