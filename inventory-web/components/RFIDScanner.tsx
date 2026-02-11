/**
 * RFID Scanner Component
 * Displays RFID scanner controls and status
 * 
 * Requirements: 10.1, 10.6, 11.3
 */

'use client';

interface RFIDScannerProps {
  scannerAvailable: boolean;
  isScanning: boolean;
  onStartScan: () => void;
  onStopScan: () => void;
  lastScannedTag?: string;
  error?: string | null;
}

export default function RFIDScanner({
  scannerAvailable,
  isScanning,
  onStartScan,
  onStopScan,
  lastScannedTag,
  error,
}: RFIDScannerProps) {
  // Requirement 11.3: Hide button when RFID scanner is not available
  if (!scannerAvailable) {
    return null;
  }

  // Determine status text and color
  const getStatusDisplay = () => {
    if (error) {
      return {
        text: 'ข้อผิดพลาด',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: '❌',
      };
    }
    
    if (isScanning) {
      return {
        text: 'กำลังสแกน...',
        color: 'text-[#3282B8]',
        bgColor: 'bg-[#BBE1FA]',
        icon: '📡',
      };
    }
    
    return {
      text: 'พร้อมใช้งาน',
      color: 'text-[#0F4C75]',
      bgColor: 'bg-[#BBE1FA]',
      icon: '✓',
    };
  };

  const status = getStatusDisplay();

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-[#3282B8]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1B262C]">
          RFID Scanner
        </h3>
        
        {/* Status Badge - Requirement 10.1: Show scanning status */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.bgColor}`}>
          <span className="text-sm">{status.icon}</span>
          <span className={`text-sm font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* Error Message - Requirement 10.1: Show error status */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Last Scanned Tag - Requirement 10.1: Show last scanned RFID tag */}
      {lastScannedTag && (
        <div className="mb-4 p-3 bg-[#BBE1FA] border border-[#3282B8] rounded-lg">
          <p className="text-xs text-[#0F4C75] mb-1">แท็กล่าสุด:</p>
          <p className="text-sm font-mono text-[#1B262C] break-all">
            {lastScannedTag}
          </p>
        </div>
      )}

      {/* Scan Control Button - Requirement 10.1: Start/Stop scan button */}
      <button
        onClick={isScanning ? onStopScan : onStartScan}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors touch-manipulation flex items-center justify-center gap-2 ${
          isScanning
            ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
            : 'bg-[#3282B8] text-white hover:bg-[#0F4C75] active:bg-[#1B262C]'
        }`}
      >
        {isScanning ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>หยุดสแกน RFID</span>
          </>
        ) : (
          <>
            <span className="text-xl">📡</span>
            <span>เริ่มสแกน RFID</span>
          </>
        )}
      </button>

      {/* Scanning Animation */}
      {isScanning && (
        <div className="mt-3 flex justify-center">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[#3282B8] rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#3282B8] rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#3282B8] rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
