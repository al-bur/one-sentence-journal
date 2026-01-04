export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔧</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          서비스 점검 중
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          더 나은 서비스를 위해 점검 중입니다.
          <br />
          잠시 후 다시 방문해주세요.
        </p>
        <div className="text-sm text-gray-400">
          하루 한 문장
        </div>
      </div>
    </div>
  )
}
