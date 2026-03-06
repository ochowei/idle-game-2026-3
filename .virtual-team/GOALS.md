# Project Goals

---

## MVP 範圍 (Phase 1)

Phase 1 專注於以下任務（達成後即為 MVP 可交付）：

- Task 1.1.1：建立遊戲核心狀態機 (GameState)
- Task 1.2.1：實作自動資源產出邏輯 (Tick System)
- Task 1.2.2：實作建築購買與價格遞增公式
- Task 1.3.1：建立本地端存檔與讀取機制 (LocalStorage)
- Task 2.1.1：實作「首航里程碑」解鎖系統
- Task 2.2.1：實作點擊特效與數值跳動動畫

MVP 驗收標準：
- [ ] 核心循環：使用者可點擊收集資源、購買建築，且資源會隨時間自動增長。
- [ ] 里程碑回饋：當資源首次達到特定門檻（如 100 能源）時，彈出視覺獎勵或新描述。
- [ ] 存檔完整性：關閉頁面後重新打開，所有資源、建築與已達成里程碑皆能正確恢復。

---

## Epic 1：核心引擎與資源系統

### Feature 1.1：遊戲狀態管理

- [x] `[DONE]` Task 1.1.1：建立遊戲核心狀態機 (GameState)
  - 目標：定義全域資源、建築等級、玩家進度等核心數據結構。
  - 產出：`src/store/useGameStore.ts`。
- [x] `[DONE]` Task 1.1.2：實作數值格式化工具
  - 目標：將大數字轉換為科學計數法或簡寫（如 1.2k, 1.5M）。
  - 產出：`src/utils/formatters.ts`。

### Feature 1.2：經濟循環系統

- [x] `[DONE]` Task 1.2.1：實作自動資源產出邏輯 (Tick System)
  - 目標：建立每秒執行一次的循環，計算所有建築產生的資源總和。
  - 產出：`src/hooks/useGameLoop.ts`。
- [x] `[DONE]` Task 1.2.2：實作建築購買與價格遞增公式
  - 目標：確保購買建築後價格按指數增長，並判斷餘額是否充足。
  - 產出：`src/components/Store/BuildingItem.tsx`。

---

## Epic 2：體驗增強與成就感 (MVP 亮點)

### Feature 2.1：里程碑與進度感

- [x] `[DONE]` Task 2.1.1：實作「里程碑」監聽器
  - 目標：當玩家達到特定成就（如：擁有 10 座採礦場）時觸發通知。
  - 產出：`src/data/milestones.ts` 與對應的檢測邏輯。
- [x] `[DONE]` Task 2.1.2：動態解鎖 UI 元件
  - 目標：初始隱藏高級建築，直到達成特定條件才在商店顯示。
  - 產出：`src/components/Store/StorePanel.tsx` 的過濾邏輯。

### Feature 2.2：視覺回饋優化

- [x] `[DONE]` Task 2.2.1：實作點擊位置浮動文字 (Floating Text)
  - 目標：使用者點擊收集按鈕時，在滑鼠位置顯示「+1」的動畫回饋。
  - 產出：`src/components/Effects/ClickEffect.tsx`。
- [ ] `[IN PROGRESS]` Task 2.2.2：實作資源條成長動畫
  - 目標：當資源增加時，數值以滾動動畫呈現而非瞬間跳變。
  - 產出：`src/components/Dashboard/ResourceDisplay.tsx`。

---

## Epic 3：資料持久化

### Feature 3.1：LocalStorage 整合

- [ ] `[TODO]` Task 3.1.1：實作存檔與自動讀取機制
  - 目標：利用 Zustand Middleware 或原生 LocalStorage 儲存 JSON 狀態。
  - 產出：`src/utils/persistence.ts`。
- [ ] `[TODO]` Task 3.1.2：實作「重設進度」功能
  - 目標：提供清除緩存按鈕供測試使用。
  - 產出：`src/components/Header/SaveControls.tsx`。

---

## Phase 2（未來規劃）
- Epic 4：科技樹研發系統（永久性 Buff）
- Epic 5：離線收益計算（讓玩家離開後仍有產出）
