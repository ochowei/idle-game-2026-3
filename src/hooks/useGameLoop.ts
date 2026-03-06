import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

/**
 * useGameLoop
 * 使用 requestAnimationFrame 驅動遊戲主循環。
 * 每幀計算 delta（秒），並呼叫 store 的 tick(delta) 方法。
 * 在元件卸載時自動清除。
 */
export function useGameLoop(): void {
  const tick = useGameStore((s) => s.tick);
  const lastTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number>(0);

  useEffect(() => {
    function loop(timestamp: number) {
      if (lastTimeRef.current !== null) {
        const delta = (timestamp - lastTimeRef.current) / 1000; // 轉換為秒
        tick(delta);
      }
      lastTimeRef.current = timestamp;
      rafIdRef.current = requestAnimationFrame(loop);
    }

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [tick]);
}
