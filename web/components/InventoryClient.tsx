/**
 * Inventory Client Component
 * Handles client-side interactions with server actions
 * Requirements: 5.4, 6.1, 6.2, 10.2, 12.1, 12.2
 */

'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Product, ProductInput, RFIDScanResult } from '@/lib/types/product';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import {
  addProductAction,
  updateProductAction,
  deleteProductAction,
  increaseQuantityAction,
  decreaseQuantityAction,
  handleRFIDScanAction,
} from '@/lib/actions/products';
import { webViewMessageHandler } from '@/lib/services/WebViewMessageHandler';
import RFIDScanner from './RFIDScanner';

interface InventoryClientProps {
  initialProducts: Product[];
}

export default function InventoryClient({ initialProducts }: InventoryClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const productsRef = useRef<Product[]>(initialProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [scannerAvailable, setScannerAvailable] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTag, setLastScannedTag] = useState<string | undefined>(undefined);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Check for search query parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const search = params.get('search');
      if (search) {
        setSearchQuery(search);
        // Clear the URL parameter
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.rfidTag?.toLowerCase().includes(query) ||
      product.id.toLowerCase().includes(query)
    );
  });

  // Update ref when products change
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // Initialize WebView message handler
  // Requirement 12.1, 12.2: Setup message communication
  useEffect(() => {
    webViewMessageHandler.initialize();

    // Handle RFID scan results
    // Requirement 10.2: Receive RFID_RESULT from React Native
    webViewMessageHandler.onRFIDResult(handleRFIDScanResult);

    // Handle RFID errors
    // Requirement 10.2: Receive RFID_ERROR from React Native
    webViewMessageHandler.onRFIDError(handleRFIDError);

    // Handle scanner status updates
    // Requirement 10.2: Receive scanner status from React Native
    webViewMessageHandler.onScannerStatus(handleScannerStatus);

    return () => {
      webViewMessageHandler.cleanup();
    };
  }, []); // Remove products dependency - use productsRef.current in handlers instead

  // Pull-to-refresh functionality
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        setPullStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (pullStartY > 0 && window.scrollY === 0) {
        const currentY = e.touches[0].clientY;
        const distance = currentY - pullStartY;
        
        if (distance > 0 && distance < 150) {
          setPullDistance(distance);
        }
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 80) {
        handleRefresh();
      }
      setPullStartY(0);
      setPullDistance(0);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullStartY, pullDistance]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Reload page to fetch fresh data
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Handle RFID scan result
  const handleRFIDScanResult = async (result: RFIDScanResult) => {
    console.log('RFID scan result:', result);
    
    // Update last scanned tag
    setLastScannedTag(result.epc);
    setScannerError(null);
    
    // Use server action to handle RFID scan
    // Requirement 10.3: Search for product with RFID tag
    startTransition(async () => {
      const response = await handleRFIDScanAction(result);
      
      if (response.success) {
        if (response.found && response.data) {
          // Requirement 10.4: Product exists - quantity increased automatically
          const updatedProduct = convertProduct(response.data);
          setProducts(
            productsRef.current.map((p) =>
              p.id === updatedProduct.id ? updatedProduct : p
            )
          );
          
          // Show success message
          setError(null);
          // Optional: Show toast notification
          console.log(response.message);
        } else if (!response.found && response.rfidTag) {
          // Requirement 10.5: Product doesn't exist - show form with RFID tag pre-filled
          setEditingProduct({
            id: '',
            name: '',
            quantity: 1,
            rfidTag: response.rfidTag,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          } as Product);
          setShowForm(true);
        }
      } else {
        setError(response.error || 'เกิดข้อผิดพลาดในการประมวลผลการสแกน');
      }
    });
  };

  // Handle RFID error
  const handleRFIDError = (error: { message: string; code?: string }) => {
    console.error('RFID error:', error);
    
    // Handle empty error object or missing message
    const errorMessage = error?.message || 'เกิดข้อผิดพลาดในการสแกน RFID';
    
    setScannerError(errorMessage);
    setIsScanning(false);
  };

  // Handle scanner status update
  const handleScannerStatus = (status: { available: boolean; scanning: boolean }) => {
    console.log('Scanner status:', status);
    setScannerAvailable(status.available);
    setIsScanning(status.scanning);
  };

  // Start RFID scanning
  // Requirement 12.1: Send SCAN_RFID message to React Native
  const startRFIDScan = () => {
    webViewMessageHandler.startRFIDScan();
    setIsScanning(true);
    setScannerError(null);
  };

  // Stop RFID scanning
  // Requirement 12.1: Send STOP_SCAN message to React Native
  const stopRFIDScan = () => {
    webViewMessageHandler.stopRFIDScan();
    setIsScanning(false);
  };

  // Convert database product to client product format
  const convertProduct = (dbProduct: {
    id: string;
    name: string;
    quantity: number;
    rfidTag: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Product => ({
    id: dbProduct.id,
    name: dbProduct.name,
    quantity: dbProduct.quantity,
    rfidTag: dbProduct.rfidTag || undefined,
    createdAt: new Date(dbProduct.createdAt).getTime(),
    updatedAt: new Date(dbProduct.updatedAt).getTime(),
  });

  // Add new product
  const addProduct = async (input: ProductInput) => {
    setError(null);
    setFormError(null);
    startTransition(async () => {
      const result = await addProductAction(input);
      
      if (result.success && result.data) {
        setProducts([...productsRef.current, convertProduct(result.data)]);
        setShowForm(false);
      } else {
        setFormError(result.error || 'เกิดข้อผิดพลาด');
      }
    });
  };

  // Update existing product
  const updateProduct = async (input: ProductInput) => {
    if (!editingProduct) return;
    
    setError(null);
    setFormError(null);
    startTransition(async () => {
      const result = await updateProductAction(editingProduct.id, input);
      
      if (result.success && result.data) {
        setProducts(
          productsRef.current.map((p) =>
            p.id === editingProduct.id ? convertProduct(result.data) : p
          )
        );
        setEditingProduct(null);
        setShowForm(false);
      } else {
        setFormError(result.error || 'เกิดข้อผิดพลาด');
      }
    });
  };

  // Delete product
  const deleteProduct = async (id: string) => {
    if (!confirm('คุณต้องการลบสินค้านี้หรือไม่?')) return;
    
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(id);
      
      if (result.success) {
        setProducts(productsRef.current.filter((p) => p.id !== id));
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด');
      }
    });
  };

  // Increase quantity
  const increaseQuantity = async (id: string, amount: number) => {
    setError(null);
    startTransition(async () => {
      const result = await increaseQuantityAction(id, amount);
      
      if (result.success && result.data) {
        setProducts(
          productsRef.current.map((p) =>
            p.id === id && result.data ? convertProduct(result.data) : p
          )
        );
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด');
      }
    });
  };

  // Decrease quantity
  const decreaseQuantity = async (id: string, amount: number) => {
    setError(null);
    startTransition(async () => {
      const result = await decreaseQuantityAction(id, amount);
      
      if (result.success && result.data) {
        setProducts(
          productsRef.current.map((p) =>
            p.id === id && result.data ? convertProduct(result.data) : p
          )
        );
      } else {
        setError(result.error || 'เกิดข้อผิดพลาด');
        alert(result.error);
      }
    });
  };

  // Handle edit button click
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle form cancel
  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
    setError(null);
    setFormError(null);
  };

  // Handle form submit
  const handleSubmit = (input: ProductInput) => {
    if (editingProduct) {
      updateProduct(input);
    } else {
      addProduct(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#BBE1FA]">
      {/* Pull-to-refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 flex justify-center items-center bg-[#3282B8] text-white transition-all z-40"
          style={{ 
            height: `${Math.min(pullDistance, 80)}px`,
            opacity: pullDistance / 80 
          }}
        >
          <div className="flex items-center gap-2">
            {pullDistance > 80 ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">ปล่อยเพื่อรีเฟรช...</span>
              </>
            ) : (
              <span className="text-sm font-medium">ลากลงเพื่อรีเฟรช...</span>
            )}
          </div>
        </div>
      )}

      {/* Refreshing indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 flex justify-center items-center bg-[#3282B8] text-white h-16 z-40">
          <div className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">กำลังรีเฟรช...</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1B262C] mb-2">
            Inventory System
          </h1>
          <p className="text-[#0F4C75]">
            จัดการสินค้า เพิ่ม ลด แก้ไข และลบสินค้า
          </p>
        </div>

        {/* Fixed Loading Indicator - ไม่ทำให้หน้าจอเลื่อน */}
        {isPending && (
          <div className="fixed top-4 right-4 z-50 px-4 py-2 bg-[#3282B8] text-white rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">กำลังดำเนินการ...</span>
          </div>
        )}

        {/* Error Message - แสดงแบบ toast ด้านบน */}
        {error && (
          <div className="fixed top-4 right-4 z-50 max-w-md px-4 py-3 bg-red-500 text-white rounded-lg shadow-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Add Product Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-3 bg-[#3282B8] text-white rounded-lg hover:bg-[#0F4C75] active:bg-[#1B262C] font-medium transition-colors touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + เพิ่มสินค้าใหม่
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า (ชื่อ, RFID, ID)..."
              className="w-full px-4 py-3 pl-12 bg-white border-2 border-[#BBE1FA] rounded-lg focus:outline-none focus:border-[#3282B8] transition-colors text-[#1B262C] text-base placeholder:text-gray-400"
              style={{ WebkitTextFillColor: '#1B262C', opacity: 1 }}
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#0F4C75]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0F4C75] hover:text-[#1B262C]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-[#0F4C75]">
              พบ {filteredProducts.length} รายการจาก {products.length} รายการทั้งหมด
            </p>
          )}
        </div>

        {/* RFID Scanner Component */}
        <div className="mb-6">
          <RFIDScanner
            scannerAvailable={scannerAvailable}
            isScanning={isScanning}
            onStartScan={startRFIDScan}
            onStopScan={stopRFIDScan}
            lastScannedTag={lastScannedTag}
            error={scannerError}
          />
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-6">
            <ProductForm
              initialProduct={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              serverError={formError}
            />
          </div>
        )}

        {/* Product List */}
        <ProductList
          products={filteredProducts}
          onEdit={handleEdit}
          onDelete={deleteProduct}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
        />
      </div>
    </div>
  );
}
