import { useCallback,useEffect, useState } from 'react';

function measureLyricHeight(): Promise<number> {
  console.log('开始测量歌词高度');
  return new Promise((resolve) => {
    setTimeout(() => {
      const height = 30; // 假设测量结果为 30
      console.log('歌词高度测量完成:', height);
      resolve(height);
    }, 100);
  });
}

export function useLyricHeight() {
  const [lyricHeight, setLyricHeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLyricHeight = useCallback(async () => {
    if (lyricHeight === null && !isLoading) {
      setIsLoading(true);
      try {
        const height = await measureLyricHeight();
        setLyricHeight(height);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [lyricHeight, isLoading]);

  useEffect(() => {
    console.log('useLyricHeight effect 运行');
    fetchLyricHeight();

    return () => {
      // 清理函数
    };
  }, [fetchLyricHeight]);

  if (error) {
    console.error('useLyricHeight 抛出错误:', error);
    throw error;
  }

  if (lyricHeight === null) {
    console.log('lyricHeight 为 null，抛出 Promise');
    throw fetchLyricHeight();
  }

  console.log('返回 lyricHeight:', lyricHeight);
  return lyricHeight;
}