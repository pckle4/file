
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Database,
  HardDrive,
  Cookie,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Server,
  Activity,
  Archive,
  ChevronDown,
  HeartPulse,
  Crown,
  AlertTriangle,
  Zap,
  Trash2,
  RefreshCw
} from "./Icons";
import { formatFileSize, cn } from "../utils";
import { Button } from "./Button";
import { StoredFile } from "../types";

interface StorageTabProps {
  files: StoredFile[];
  onCleanup: () => void;
}

interface StorageData {
  localStorage: { [key: string]: any };
  sessionStorage: { [key: string]: any };
  cookies: { [key: string]: string };
  indexedDB: {
    databases: Array<{
      name: string;
      version: number;
      objectStores: Array<{
        name: string;
        keyPath: string | string[];
        autoIncrement: boolean;
        itemCount: number;
        totalSize: number;
        sampleData?: any[];
      }>;
    }>;
  };
}

interface BrowserStorageEstimate {
  usage: number;
  quota: number;
  supported: boolean;
}

const ExpandableJsonEntry: React.FC<{ label: string; value: any; size?: number }> = ({ label, value, size }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isObject = typeof value === 'object' && value !== null;
  const preview = isObject ? (Array.isArray(value) ? `Array(${value.length})` : '{Object}') : String(value);
  
  return (
    <div className="bg-white dark:bg-dusk-800 border border-dusk-200 dark:border-dusk-700 rounded-xl p-3 shadow-sm mb-2 last:mb-0 hover:border-lavender-200 dark:hover:border-lavender-700 transition-colors">
      <div onClick={() => setIsExpanded(!isExpanded)} className="flex justify-between items-start cursor-pointer group select-none">
        <div className="flex flex-col gap-0.5 overflow-hidden">
           <div className="font-mono text-xs font-bold text-dusk-700 dark:text-dusk-200 break-all group-hover:text-lavender-700 dark:group-hover:text-lavender-400 transition-colors">{label}</div>
           <div className="text-[10px] text-dusk-400 truncate font-mono">
              {!isExpanded && <span className="text-dusk-500 dark:text-dusk-400">{preview}</span>}
           </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
           {size !== undefined && <span className="text-[9px] text-dusk-400 bg-dusk-50 dark:bg-dusk-700 px-1.5 py-0.5 rounded border border-dusk-100 dark:border-dusk-600">{formatFileSize(size)}</span>}
           <ChevronDown className={cn("w-3 h-3 text-dusk-400 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-dusk-50 dark:border-dusk-700 bg-dusk-50/50 dark:bg-dusk-900/30 -mx-3 -mb-3 px-3 py-3 rounded-b-xl overflow-x-auto custom-scrollbar">
           <pre className="font-mono text-[10px] text-dusk-600 dark:text-dusk-300 whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const getStorageSize = (obj: { [key: string]: any }): number => {
  return Object.entries(obj).reduce((total, [key, value]) => {
    const jsonString = typeof value === "string" ? value : JSON.stringify(value);
    return total + new Blob([key + jsonString]).size;
  }, 0);
};

const calculateActualFileSize = (item: any): number => {
  if (item && item.blob && item.blob instanceof Blob) {
    return item.blob.size;
  }
  if (item && typeof item.size === "number") {
    return item.size;
  }
  return new Blob([JSON.stringify(item)]).size;
};

const parseStorageValue = (value: string) => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const StorageTab: React.FC<StorageTabProps> = ({ onCleanup }) => {
  const [storageData, setStorageData] = useState<StorageData>({ localStorage: {}, sessionStorage: {}, cookies: {}, indexedDB: { databases: [] } });
  const [isLoading, setIsLoading] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [browserStorage, setBrowserStorage] = useState<BrowserStorageEstimate>({ usage: 0, quota: 0, supported: false });
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const isUpdatingRef = useRef<boolean>(false);

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(key)) newExpanded.delete(key); else newExpanded.add(key);
    setExpandedItems(newExpanded);
  };

  const getBrowserStorageEstimate = async (): Promise<BrowserStorageEstimate> => {
    try {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return { usage: estimate.usage || 0, quota: estimate.quota || 0, supported: true };
      }
    } catch (error) {}
    return { usage: 0, quota: 0, supported: false };
  };

  const storageSizes = useMemo(() => ({
      localStorage: getStorageSize(storageData.localStorage),
      sessionStorage: getStorageSize(storageData.sessionStorage),
      cookies: getStorageSize(storageData.cookies),
      indexedDB: storageData.indexedDB.databases.reduce((total, db) => total + db.objectStores.reduce((dbTotal, store) => dbTotal + store.totalSize, 0), 0),
    }), [storageData]);

  const totalSize = useMemo(() => storageSizes.localStorage + storageSizes.sessionStorage + storageSizes.cookies + storageSizes.indexedDB, [storageSizes]);

  const largestConsumers = useMemo(() => {
    const consumers = [
      { name: "IndexedDB", size: storageSizes.indexedDB, icon: Database, color: "text-lavender-600 dark:text-lavender-400", bg: "bg-lavender-50 dark:bg-lavender-900/30" },
      { name: "LocalStorage", size: storageSizes.localStorage, icon: HardDrive, color: "text-dusk-600 dark:text-dusk-400", bg: "bg-dusk-50 dark:bg-dusk-900/30" },
      { name: "SessionStorage", size: storageSizes.sessionStorage, icon: Clock, color: "text-rosewood-600 dark:text-rosewood-400", bg: "bg-rosewood-50 dark:bg-rosewood-900/30" },
      { name: "Cookies", size: storageSizes.cookies, icon: Cookie, color: "text-bronze-600 dark:text-bronze-400", bg: "bg-bronze-50 dark:bg-bronze-900/30" },
    ];
    return consumers.sort((a, b) => b.size - a.size);
  }, [storageSizes]);

  const analyzeStorage = async () => {
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;
    setIsLoading(true);
    try {
      const browserStorageEstimate = await getBrowserStorageEstimate();
      setBrowserStorage(browserStorageEstimate);

      const localStorageData: { [key: string]: any } = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key) localStorageData[key] = parseStorageValue(localStorage.getItem(key) || "");
        }
      } catch (e) {}

      const sessionStorageData: { [key: string]: any } = {};
      try {
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key) sessionStorageData[key] = parseStorageValue(sessionStorage.getItem(key) || "");
        }
      } catch (e) {}

      const cookiesData: { [key: string]: string } = {};
      try {
        document.cookie.split(";").forEach((cookie) => {
          const [name, value] = cookie.trim().split("=");
          if (name) cookiesData[name] = value ? decodeURIComponent(value) : "";
        });
      } catch (e) {}

      let indexedDBData = { databases: [] as any[] };
      try {
        if (window.indexedDB && window.indexedDB.databases) {
          const databases = await window.indexedDB.databases();
          indexedDBData.databases = await Promise.all(
            databases.map(async (dbInfo) => {
              if (!dbInfo.name) return null;
              try {
                const dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
                  const req = window.indexedDB.open(dbInfo.name!, dbInfo.version);
                  req.onsuccess = () => resolve(req.result);
                  req.onerror = () => reject(req.error);
                });
                const db = await dbPromise;
                const objectStores = await Promise.all(
                  Array.from(db.objectStoreNames).map(async (storeName) => {
                    const tx = db.transaction(storeName, "readonly");
                    const store = tx.objectStore(storeName);
                    const countReq = store.count();
                    const count = await new Promise<number>((resolve) => {
                      countReq.onsuccess = () => resolve(countReq.result);
                      countReq.onerror = () => resolve(0);
                    });
                    let totalSize = 0;
                    const items: any[] = [];
                    const cursorReq = store.openCursor();
                    await new Promise<void>((resolve) => {
                      cursorReq.onsuccess = (e) => {
                        const cursor = (e.target as IDBRequest).result;
                        if (cursor) {
                          const size = calculateActualFileSize(cursor.value);
                          totalSize += size;
                          if (items.length < 5) items.push({ value: cursor.value, actualSize: size });
                          cursor.continue();
                        } else {
                          resolve();
                        }
                      };
                      cursorReq.onerror = () => resolve();
                    });
                    return { name: storeName, keyPath: store.keyPath, autoIncrement: store.autoIncrement, itemCount: count, totalSize, sampleData: items };
                  })
                );
                db.close();
                return { name: dbInfo.name, version: dbInfo.version || 1, objectStores };
              } catch (e) {
                return { name: dbInfo.name, version: dbInfo.version || 1, objectStores: [] };
              }
            })
          );
          indexedDBData.databases = indexedDBData.databases.filter(Boolean);
        }
      } catch (e) {}

      setStorageData({ localStorage: localStorageData, sessionStorage: sessionStorageData, cookies: cookiesData, indexedDB: indexedDBData });
      setLastUpdateTime(new Date());
    } catch (error) {
    } finally {
      setIsLoading(false);
      isUpdatingRef.current = false;
    }
  };

  useEffect(() => {
    analyzeStorage();
    const interval = setInterval(() => { if (!document.hidden) analyzeStorage(); }, 10000);
    return () => clearInterval(interval);
  }, []);

  const usagePercent = browserStorage.supported && browserStorage.quota > 0 ? (browserStorage.usage / browserStorage.quota) * 100 : 0;

  return (
    <div className="space-y-6 animate-slide-up pb-8">
      <div className="bg-white dark:bg-dusk-900 border border-dusk-200 dark:border-dusk-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-lavender-100 to-dusk-50 dark:from-lavender-900/30 dark:to-dusk-900/30 rounded-2xl shadow-sm border border-lavender-100 dark:border-lavender-800 flex-shrink-0">
                <Database className="h-8 w-8 text-lavender-600 dark:text-lavender-400" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-black text-dusk-900 dark:text-white tracking-tight truncate">Storage Inspector</h3>
                <p className="text-xs text-dusk-500 dark:text-dusk-400 flex items-center gap-2 mt-1 font-medium truncate">
                  <Activity className="h-3 w-3 text-rosewood-500 flex-shrink-0" />
                  System Active • Updated {lastUpdateTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
               <Button size="sm" variant="secondary" onClick={analyzeStorage} disabled={isLoading} className="rounded-full px-4 bg-white dark:bg-dusk-700 text-dusk-700 dark:text-dusk-200 border-dusk-200 dark:border-dusk-600 w-full sm:w-auto">
                 <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                 Refresh
               </Button>
               <div className="px-4 py-2 bg-dusk-900 dark:bg-lavender-600 text-white rounded-full text-xs font-bold shadow-lg shadow-dusk-900/20 dark:shadow-lavender-900/20 flex items-center justify-center gap-2 w-full sm:w-auto">
                 <Archive className="h-3 w-3" />
                 {formatFileSize(totalSize)} Total
               </div>
            </div>
          </div>

          {browserStorage.supported && (
            <div className="mb-8 p-4 sm:p-6 bg-dusk-50/80 dark:bg-dusk-900/50 rounded-3xl border border-dusk-100 dark:border-dusk-700 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 relative z-10">
                <span className="font-bold text-sm text-dusk-700 dark:text-dusk-200 uppercase tracking-wider">Browser Storage Quota</span>
                <div className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm bg-dusk-100 dark:bg-dusk-800 w-fit")}>
                   {usagePercent < 90 ? <CheckCircle className="h-3 w-3 text-rosewood-500" /> : <AlertCircle className="h-3 w-3 text-bronze-500" />}
                   {usagePercent.toFixed(2)}% Used
                </div>
              </div>
              <div className="h-4 bg-white dark:bg-dusk-800 rounded-full overflow-hidden mb-6 shadow-inner border border-dusk-100 dark:border-dusk-700 relative z-10">
                <div className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-sm bg-gradient-to-r from-rosewood-400 to-rosewood-500")} style={{ width: `${Math.max(usagePercent, 1)}%` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                <div className="bg-white dark:bg-dusk-800 p-4 rounded-2xl border border-dusk-200/60 dark:border-dusk-700 shadow-sm flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center">
                  <span className="text-dusk-400 text-[10px] font-black uppercase tracking-widest">Used</span>
                  <div className="font-mono font-bold text-lg text-dusk-800 dark:text-white mt-0 sm:mt-1">{formatFileSize(browserStorage.usage)}</div>
                </div>
                <div className="bg-white dark:bg-dusk-800 p-4 rounded-2xl border border-dusk-200/60 dark:border-dusk-700 shadow-sm flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center">
                  <span className="text-dusk-400 text-[10px] font-black uppercase tracking-widest">Total</span>
                  <div className="font-mono font-bold text-lg text-dusk-800 dark:text-white mt-0 sm:mt-1">{formatFileSize(browserStorage.quota)}</div>
                </div>
                <div className="bg-white dark:bg-dusk-800 p-4 rounded-2xl border border-dusk-200/60 dark:border-dusk-700 shadow-sm flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center">
                  <span className="text-dusk-400 text-[10px] font-black uppercase tracking-widest">Free</span>
                  <div className="font-mono font-bold text-lg text-rosewood-600 dark:text-rosewood-400 mt-0 sm:mt-1">{formatFileSize(browserStorage.quota - browserStorage.usage)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-dusk-800 p-6 rounded-3xl border border-dusk-200 dark:border-dusk-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rosewood-100 dark:bg-rosewood-900/30 text-rosewood-700 dark:text-rosewood-300 rounded-xl transition-transform group-hover:scale-110"><HeartPulse className="h-5 w-5" /></div>
                  <span className="text-xs text-dusk-500 dark:text-dusk-400 font-bold uppercase tracking-wider">System Health</span>
                </div>
                <span className="text-3xl font-black text-rosewood-600 dark:text-rosewood-400">100</span>
              </div>
              <span className="text-lg font-bold block text-rosewood-600 dark:text-rosewood-400">Excellent</span>
            </div>

            <div className="bg-white dark:bg-dusk-800 p-6 rounded-3xl border border-dusk-200 dark:border-dusk-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-bronze-50 dark:bg-bronze-900/30 text-bronze-600 dark:text-bronze-400 rounded-xl transition-transform group-hover:scale-110"><Crown className="h-5 w-5" /></div>
                  <span className="text-xs text-dusk-500 dark:text-dusk-400 font-bold uppercase tracking-wider">Top Consumer</span>
                </div>
                <div className="flex items-center gap-1.5 text-bronze-600 dark:text-bronze-400 font-bold">
                  <Zap className="h-4 w-4 fill-bronze-600 dark:fill-bronze-400" />
                  <span className="text-xl">{formatFileSize(largestConsumers[0]?.size || 0)}</span>
                </div>
              </div>
              {largestConsumers[0] && (
                 <div className="flex items-center gap-4 p-3 bg-dusk-50 dark:bg-dusk-700 rounded-2xl border border-dusk-100 dark:border-dusk-600">
                    <div className={cn("p-2 rounded-xl flex-shrink-0", largestConsumers[0].bg, largestConsumers[0].color)}>
                       {React.createElement(largestConsumers[0].icon, { className: "w-5 h-5" })}
                    </div>
                    <div className="min-w-0">
                       <div className="font-bold text-dusk-800 dark:text-white text-sm truncate">{largestConsumers[0].name}</div>
                       <div className="text-[10px] text-dusk-500 dark:text-dusk-400 font-medium truncate">{totalSize > 0 ? ((largestConsumers[0].size / totalSize) * 100).toFixed(1) : 0}% of total storage</div>
                    </div>
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="text-sm font-black text-dusk-900 dark:text-white uppercase tracking-wider ml-2 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Data Breakdown</h4>
             {[
               { key: 'localStorage', label: 'Local Storage', icon: HardDrive, color: 'text-dusk-600 dark:text-dusk-400', bg: 'bg-dusk-50 dark:bg-dusk-900/30', data: storageData.localStorage, size: storageSizes.localStorage },
               { key: 'sessionStorage', label: 'Session Storage', icon: Clock, color: 'text-rosewood-600 dark:text-rosewood-400', bg: 'bg-rosewood-50 dark:bg-rosewood-900/30', data: storageData.sessionStorage, size: storageSizes.sessionStorage },
               { key: 'cookies', label: 'Cookies', icon: Cookie, color: 'text-bronze-600 dark:text-bronze-400', bg: 'bg-bronze-50 dark:bg-bronze-900/30', data: storageData.cookies, size: storageSizes.cookies }
             ].map((item) => (
               <div key={item.key} className="border border-dusk-200 dark:border-dusk-700 rounded-2xl overflow-hidden bg-white dark:bg-dusk-800 hover:border-dusk-300 dark:hover:border-dusk-600 transition-colors shadow-sm">
                  <button onClick={() => toggleExpanded(item.key)} className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-dusk-50/50 dark:hover:bg-dusk-700/30 transition-colors text-left group gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl transition-colors flex-shrink-0", item.bg, item.color)}><item.icon className="w-5 h-5" /></div>
                      <div>
                        <div className="text-sm font-bold text-dusk-800 dark:text-dusk-200 group-hover:text-dusk-900 dark:group-hover:text-white">{item.label}</div>
                        <div className="text-xs text-dusk-500 dark:text-dusk-400">{Object.keys(item.data).length} items</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
                      <span className="text-xs font-mono font-bold text-dusk-600 dark:text-dusk-300 bg-dusk-100 dark:bg-dusk-700 border border-dusk-200 dark:border-dusk-600 px-2.5 py-1 rounded-lg">{formatFileSize(item.size)}</span>
                      <div className={cn("p-1 rounded-full bg-dusk-50 dark:bg-dusk-700 text-dusk-400 transition-all duration-300", expandedItems.has(item.key) && "rotate-180 bg-dusk-200 dark:bg-dusk-600 text-dusk-600 dark:text-dusk-200")}><ChevronDown className="w-4 h-4" /></div>
                    </div>
                  </button>
                  {expandedItems.has(item.key) && (
                    <div className="border-t border-dusk-100 dark:border-dusk-700 bg-dusk-50/30 dark:bg-dusk-900/30 p-4 animate-fade-in">
                      <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
                        {Object.entries(item.data).map(([k, v]) => <ExpandableJsonEntry key={k} label={k} value={v} size={typeof v === 'string' ? v.length : JSON.stringify(v).length} />)}
                        {Object.keys(item.data).length === 0 && <div className="text-center text-xs text-dusk-400 py-4">No data found</div>}
                      </div>
                    </div>
                  )}
               </div>
             ))}
             <div className="border border-dusk-200 dark:border-dusk-700 rounded-2xl overflow-hidden bg-white dark:bg-dusk-800 hover:border-dusk-300 dark:hover:border-dusk-600 transition-colors shadow-sm">
                <button onClick={() => toggleExpanded("indexedDB")} className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-dusk-50/50 dark:hover:bg-dusk-700/30 transition-colors text-left group gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-lavender-50 dark:bg-lavender-900/30 text-lavender-600 dark:text-lavender-400 rounded-xl transition-colors flex-shrink-0"><Server className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-dusk-800 dark:text-dusk-200 group-hover:text-dusk-900 dark:group-hover:text-white">IndexedDB</div>
                      <div className="text-xs text-dusk-500 dark:text-dusk-400">{storageData.indexedDB.databases.length} databases</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 pl-14 sm:pl-0">
                    <span className="text-xs font-mono font-bold text-dusk-600 dark:text-dusk-300 bg-dusk-100 dark:bg-dusk-700 border border-dusk-200 dark:border-dusk-600 px-2.5 py-1 rounded-lg">{formatFileSize(storageSizes.indexedDB)}</span>
                    <div className={cn("p-1 rounded-full bg-dusk-50 dark:bg-dusk-700 text-dusk-400 transition-all duration-300", expandedItems.has("indexedDB") && "rotate-180 bg-dusk-200 dark:bg-dusk-600 text-dusk-600 dark:text-dusk-200")}><ChevronDown className="w-4 h-4" /></div>
                  </div>
                </button>
                {expandedItems.has("indexedDB") && (
                  <div className="border-t border-dusk-100 dark:border-dusk-700 bg-dusk-50/30 dark:bg-dusk-900/30 p-4 animate-fade-in">
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {storageData.indexedDB.databases.map((db) => (
                        <div key={db.name} className="bg-white dark:bg-dusk-800 border border-dusk-200 dark:border-dusk-700 rounded-2xl p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-dusk-50 dark:border-dusk-700">
                            <div className="flex items-center gap-2"><Database className="w-3 h-3 text-lavender-500" /><span className="font-bold text-xs text-lavender-700 dark:text-lavender-400 uppercase tracking-wider">{db.name}</span></div>
                            <span className="text-[10px] font-mono text-dusk-400 bg-dusk-50 dark:bg-dusk-700 px-2 py-0.5 rounded-full">v{db.version}</span>
                          </div>
                          {db.objectStores.map((store) => (
                            <div key={store.name} className="mb-3 last:mb-0 pl-3 border-l-2 border-lavender-100 dark:border-lavender-800">
                                <div className="flex justify-between items-center mb-2">
                                   <div className="flex items-center gap-2"><Package className="w-3 h-3 text-dusk-400" /><span className="text-xs font-bold text-dusk-700 dark:text-dusk-300">{store.name}</span></div>
                                   <span className="text-[10px] font-mono text-dusk-500 dark:text-dusk-400">{formatFileSize(store.totalSize)} • {store.itemCount} items</span>
                                </div>
                                {store.sampleData && store.sampleData.length > 0 && (
                                  <div className="mt-2 space-y-2">{store.sampleData.map((item, idx) => <ExpandableJsonEntry key={idx} label={`Record ${idx + 1}`} value={item.value} size={item.actualSize} />)}</div>
                                )}
                            </div>
                          ))}
                        </div>
                      ))}
                      {storageData.indexedDB.databases.length === 0 && <div className="text-center text-xs text-dusk-400 py-4">No IndexedDB databases found</div>}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-dusk-800 border border-lcoral-100 dark:border-lcoral-900/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-lcoral-500" />
         <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
            <div className="p-4 bg-lcoral-50 dark:bg-lcoral-900/20 text-lcoral-600 dark:text-lcoral-400 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0"><Trash2 className="w-6 h-6" /></div>
            <div>
               <h4 className="font-bold text-dusk-900 dark:text-white text-lg">Emergency Cleanup</h4>
               <p className="text-sm text-dusk-500 dark:text-dusk-400 max-w-md">Permanently delete all file data stored by NW in IndexedDB.</p>
            </div>
         </div>
         <Button variant="danger" onClick={onCleanup} className="w-full sm:w-auto whitespace-nowrap shadow-lg shadow-lcoral-500/10 border-transparent bg-lcoral-50 dark:bg-lcoral-900/20 text-lcoral-600 dark:text-lcoral-400 hover:bg-lcoral-600 hover:text-white transition-all">Clear Storage</Button>
      </div>
    </div>
  );
};
