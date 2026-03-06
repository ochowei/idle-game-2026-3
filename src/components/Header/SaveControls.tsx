import { STORAGE_KEY } from '../../utils/persistence';

export function SaveControls() {
  const handleReset = () => {
    if (window.confirm('確定要重設所有進度嗎？此操作無法復原。')) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="px-3 py-1 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white text-sm"
    >
      重設進度
    </button>
  );
}
