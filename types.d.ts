type staticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemory: number;
};
interface Window {
  electron: {
    subscribeStatistics: (callback: (statistics: statistics) => void) => void;
    getStaticData: () => Promise<staticData>;
  };
}
