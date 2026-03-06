import { useState, useCallback, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface Floater {
  id: number;
  x: number;
  y: number;
  text: string;
  color: string; // Tailwind text color class
}

let nextId = 0;

/**
 * 管理浮動文字狀態的 hook。
 * 回傳 spawn（觸發函式）與 floaters（目前存活的浮動文字列表）。
 */
export function useClickEffect() {
  const [floaters, setFloaters] = useState<Floater[]>([]);

  const spawn = useCallback(
    (e: MouseEvent, text: string, color = 'text-yellow-300') => {
      const id = nextId++;
      setFloaters((prev) => [
        ...prev,
        { id, x: e.clientX, y: e.clientY, text, color },
      ]);
      // 動畫結束後清除（比動畫時長稍長以確保 exit 完成）
      setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== id));
      }, 1100);
    },
    [],
  );

  return { spawn, floaters };
}

/**
 * 渲染所有浮動文字的容器，掛載在 fixed 層，不攔截滑鼠事件。
 */
export function ClickEffectLayer({
  floaters,
}: {
  floaters: ReturnType<typeof useClickEffect>['floaters'];
}) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <AnimatePresence>
        {floaters.map((f) => (
          <motion.span
            key={f.id}
            className={`absolute select-none text-sm font-bold ${f.color}`}
            style={{ left: f.x, top: f.y }}
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            exit={{}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            {f.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
