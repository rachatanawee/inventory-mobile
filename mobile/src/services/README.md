# WebViewBridgeService

Service for handling communication between React Native and Web Application.

## Features

- ✅ Send messages from React Native to Web Application
- ✅ Receive messages from Web Application to React Native
- ✅ Message validation (JSON format with type field)
- ✅ Type-safe message handlers
- ✅ Support for SCAN_RFID and STOP_SCAN message types
- ✅ Helper methods for RFID operations

## Requirements

Implements requirements:
- **12.1**: React Native sends messages to Web Application
- **12.2**: Web Application sends messages to React Native
- **12.3**: Handle message types (SCAN_RFID, STOP_SCAN)
- **12.4**: Validate message format (JSON with type field)

## Usage

### Basic Setup

```typescript
import { webViewBridge } from './src/services/WebViewBridgeService';
import { useRef, useEffect } from 'react';
import WebView from 'react-native-webview';

function App() {
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    // Initialize bridge with WebView reference
    webViewBridge.setWebViewRef(webViewRef);

    // Setup message handlers
    webViewBridge.handleScanRequest(() => {
      console.log('Start RFID scanning');
      // Start RFID scanner
    });

    webViewBridge.handleStopScanRequest(() => {
      console.log('Stop RFID scanning');
      // Stop RFID scanner
    });

    return () => {
      webViewBridge.cleanup();
    };
  }, []);

  return (
    <WebView
      ref={webViewRef}
      onMessage={(event) => webViewBridge.handleFromWeb(event)}
      // ... other props
    />
  );
}
```

### Sending Messages to Web

```typescript
// Send RFID scan result
webViewBridge.sendRFIDResult({
  epc: 'E2801170000002015F8C5B8A',
  tid: '123456789',
  rssi: -50,
  timestamp: Date.now(),
});

// Send RFID error
webViewBridge.sendRFIDError({
  code: 'SCAN_FAILED',
  message: 'Failed to read RFID tag',
});

// Send scanner status
webViewBridge.sendScannerStatus({
  isReady: true,
  isScanning: false,
});

// Send custom message
webViewBridge.sendToWeb({
  type: 'SCANNER_STATUS',
  payload: { isReady: true },
});
```

### Receiving Messages from Web

```typescript
// Register custom handler
webViewBridge.registerHandler('SCAN_RFID', (payload) => {
  console.log('Scan request received:', payload);
  // Handle scan request
});

// Or use convenience methods
webViewBridge.handleScanRequest(() => {
  // Start scanning
});

webViewBridge.handleStopScanRequest(() => {
  // Stop scanning
});

// Unregister handler
webViewBridge.unregisterHandler('SCAN_RFID');
```

## Message Types

### From Web to React Native

- `SCAN_RFID`: Request to start RFID scanning
- `STOP_SCAN`: Request to stop RFID scanning

### From React Native to Web

- `RFID_RESULT`: RFID scan result with tag data
- `RFID_ERROR`: RFID scan error
- `SCANNER_STATUS`: Scanner status update

## Message Format

All messages must follow this format:

```typescript
interface WebViewMessage {
  type: WebViewMessageType;
  payload?: any;
}
```

Example:

```json
{
  "type": "RFID_RESULT",
  "payload": {
    "epc": "E2801170000002015F8C5B8A",
    "tid": "123456789",
    "rssi": -50,
    "timestamp": 1234567890
  }
}
```

## Error Handling

The service includes built-in validation and error handling:

- Invalid message format is rejected and logged
- Missing WebView reference is handled gracefully
- JSON parse errors are caught and logged
- Unknown message types trigger a warning

## Testing

Run tests with:

```bash
bun test WebViewBridgeService.test.ts --run
```

## Integration with InventoryWebView

The `InventoryWebView` component automatically integrates with `WebViewBridgeService`:

```typescript
import { InventoryWebView } from './src/components/InventoryWebView';

<InventoryWebView
  url="http://localhost:3000"
  onMessage={(event) => {
    // Messages are automatically routed through WebViewBridge
  }}
/>
```

## Next Steps

This service will be integrated with:
- RFID Scanner Module (Task 11)
- RFID Scanner Service (Task 12)
- Web Application message handler (Task 9.2)
