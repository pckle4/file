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
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm mb-2 last:mb-0 hover:border-violet-200 dark:hover:border-violet-700 transition-colors">
      <div onClick={() => setIsExpanded(!isExpanded)} className="flex justify-between items-start cursor-pointer group select-none">
        <div className="flex flex-col gap-0.5 overflow-hidden">
           <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-200 break-all group-hover:text-violet-700 dark:group-hover:text-violet-400 transition-colors">{label}</div>
           <div className="text-[10px] text-slate-400 truncate font-mono">
              {!isExpanded && <span className="text-slate-500 dark:text-slate-400">{preview}</span>}
           </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
           {size !== undefined && <span className="text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-100 dark:border-slate-600">{formatFileSize(size)}</span>}
           <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isExpanded && "rotate-180")} />
        </div>
      </div>
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 -mx-3 -mb-3 px-3 py-3 rounded-b-xl overflow-x-auto custom-scrollbar">
           <pre className="font-mono text-[10px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
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
      { name: "IndexedDB", size: storageSizes.indexedDB, icon: Database, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/30" },
      { name: "LocalStorage", size: storageSizes.localStorage, icon: HardDrive, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/30" },
      { name: "SessionStorage", size: storageSizes.sessionStorage, icon: Clock, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/30" },
      { name: "Cookies", size: storageSizes.cookies, icon: Cookie, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/30" },
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
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30 rounded-2xl shadow-sm border border-violet-100 dark:border-violet-800">
                <Database className="h-8 w-8 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Storage Inspector</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1 font-medium">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  System Active • Updated {lastUpdateTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <Button size="sm" variant="secondary" onClick={analyzeStorage} disabled={isLoading} className="rounded-full px-4 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600">
                 <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                 Refresh
               </Button>
               <div className="px-4 py-2 bg-slate-900 dark:bg-violet-600 text-white rounded-full text-xs font-bold shadow-lg shadow-slate-900/20 dark:shadow-violet-900/20 flex items-center gap-2">
                 <Archive className="h-3 w-3" />
                 {formatFileSize(totalSize)} Total
               </div>
            </div>
          </div>

          {browserStorage.supported && (
            <div className="mb-8 p-6 bg-slate-50/80 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 uppercase tracking-wider">Browser Storage Quota</span>
                <div className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 shadow-sm bg-slate-100 dark:bg-slate-800")}>
                   {usagePercent < 90 ? <CheckCircle className="h-3 w-3 text-emerald-500" /> : <AlertCircle className="h-3 w-3 text-amber-500" />}
                   {usagePercent.toFixed(2)}% Used
                </div>
              </div>
              <div className="h-4 bg-white dark:bg-slate-800 rounded-full overflow-hidden mb-6 shadow-inner border border-slate-100 dark:border-slate-700 relative z-10">
                <div className={cn("h-full rounded-full transition-all duration-1000 ease-out shadow-sm bg-gradient-to-r from-emerald-400 to-emerald-500")} style={{ width: `${Math.max(usagePercent, 1)}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-4 relative z-10">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Used</span>
                  <div className="font-mono font-bold text-lg text-slate-800 dark:text-white mt-1">{formatFileSize(browserStorage.usage)}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total</span>
                  <div className="font-mono font-bold text-lg text-slate-800 dark:text-white mt-1">{formatFileSize(browserStorage.quota)}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Free</span>
                  <div className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400 mt-1">{formatFileSize(browserStorage.quota - browserStorage.usage)}</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl transition-transform group-hover:scale-110"><HeartPulse className="h-5 w-5" /></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">System Health</span>
                </div>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">100</span>
              </div>
              <span className="text-lg font-bold block text-emerald-600 dark:text-emerald-400">Excellent</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl transition-transform group-hover:scale-110"><Crown className="h-5 w-5" /></div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Top Consumer</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <Zap className="h-4 w-4 fill-amber-600 dark:fill-amber-400" />
                  <span className="text-xl">{formatFileSize(largestConsumers[0]?.size || 0)}</span>
                </div>
              </div>
              {largestConsumers[0] && (
                 <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-600">
                    <div className={cn("p-2 rounded-xl", largestConsumers[0].bg, largestConsumers[0].color)}>
                       {React.createElement(largestConsumers[0].icon, { className: "w-5 h-5" })}
                    </div>
                    <div>
                       <div className="font-bold text-slate-800 dark:text-white text-sm">{largestConsumers[0].name}</div>
                       <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{totalSize > 0 ? ((largestConsumers[0].size / totalSize) * 100).toFixed(1) : 0}% of total storage</div>
                    </div>
                 </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider ml-2 mb-2 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Data Breakdown</h4>
             {[
               { key: 'localStorage', label: 'Local Storage', icon: HardDrive, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', data: storageData.localStorage, size: storageSizes.localStorage },
               { key: 'sessionStorage', label: 'Session Storage', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', data: storageData.sessionStorage, size: storageSizes.sessionStorage },
               { key: 'cookies', label: 'Cookies', icon: Cookie, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30', data: storageData.cookies, size: storageSizes.cookies }
             ].map((item) => (
               <div key={item.key} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                  <button onClick={() => toggleExpanded(item.key)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors text-left group">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-2.5 rounded-xl transition-colors", item.bg, item.color)}><item.icon className="w-5 h-5" /></div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{Object.keys(item.data).length} items</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1 rounded-lg">{formatFileSize(item.size)}</span>
                      <div className={cn("p-1 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-400 transition-all duration-300", expandedItems.has(item.key) && "rotate-180 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200")}><ChevronDown className="w-4 h-4" /></div>
                    </div>
                  </button>
                  {expandedItems.has(item.key) && (
                    <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 p-4 animate-fade-in">
                      <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
                        {Object.entries(item.data).map(([k, v]) => <ExpandableJsonEntry key={k} label={k} value={v} size={typeof v === 'string' ? v.length : JSON.stringify(v).length} />)}
                        {Object.keys(item.data).length === 0 && <div className="text-center text-xs text-slate-400 py-4">No data found</div>}
                      </div>
                    </div>
                  )}
               </div>
             ))}
             <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm">
                <button onClick={() => toggleExpanded("indexedDB")} className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors text-left group">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl transition-colors"><Server className="w-5 h-5" /></div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">IndexedDB</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{storageData.indexedDB.databases.length} databases</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1 rounded-lg">{formatFileSize(storageSizes.indexedDB)}</span>
                    <div className={cn("p-1 rounded-full bg-slate-50 dark:bg-slate-700 text-slate-400 transition-all duration-300", expandedItems.has("indexedDB") && "rotate-180 bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200")}><ChevronDown className="w-4 h-4" /></div>
                  </div>
                </button>
                {expandedItems.has("indexedDB") && (
                  <div className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 p-4 animate-fade-in">
                    <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                      {storageData.indexedDB.databases.map((db) => (
                        <div key={db.name} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-50 dark:border-slate-700">
                            <div className="flex items-center gap-2"><Database className="w-3 h-3 text-purple-500" /><span className="font-bold text-xs text-purple-700 dark:text-purple-400 uppercase tracking-wider">{db.name}</span></div>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-700 px-2 py-0.5 rounded-full">v{db.version}</span>
                          </div>
                          {db.objectStores.map((store) => (
                            <div key={store.name} className="mb-3 last:mb-0 pl-3 border-l-2 border-purple-100 dark:border-purple-800">
                                <div className="flex justify-between items-center mb-2">
                                   <div className="flex items-center gap-2"><Package className="w-3 h-3 text-slate-400" /><span className="text-xs font-bold text-slate-700 dark:text-slate-300">{store.name}</span></div>
                                   <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{formatFileSize(store.totalSize)} • {store.itemCount} items</span>
                                </div>
                                {store.sampleData && store.sampleData.length > 0 && (
                                  <div className="mt-2 space-y-2">{store.sampleData.map((item, idx) => <ExpandableJsonEntry key={idx} label={`Record ${idx + 1}`} value={item.value} size={item.actualSize} />)}</div>
                                )}
                            </div>
                          ))}
                        </div>
                      ))}
                      {storageData.indexedDB.databases.length === 0 && <div className="text-center text-xs text-slate-400 py-4">No IndexedDB databases found</div>}
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
         <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl group-hover:scale-110 transition-transform"><Trash2 className="w-6 h-6" /></div>
            <div>
               <h4 className="font-bold text-slate-900 dark:text-white text-lg">Emergency Cleanup</h4>
               <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">Permanently delete all file data stored by NW in IndexedDB.</p>
            </div>
         </div>
         <Button variant="danger" onClick={onCleanup} className="whitespace-nowrap shadow-lg shadow-red-500/10 border-transparent bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all">Clear Storage</Button>
      </div>
    </div>
  );
};