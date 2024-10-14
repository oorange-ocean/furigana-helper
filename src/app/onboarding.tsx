import { useRouter } from 'expo-router';
import React from 'react';

import { Cover } from '@/components/cover';
import { useIsFirstTime } from '@/core/hooks';
import { Button, FocusAwareStatusBar, SafeAreaView, Text, View } from '@/ui';
export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end ">
        <Text className="my-3 text-center text-5xl font-bold">
          Furigana Lyrics
        </Text>
        <Text className="mb-2 text-center text-lg text-gray-600">
          听歌学日语
        </Text>

        <Text className="my-1 pt-6 text-left text-lg">
          🚀 日语语法分析功能，自动划分结构并添加假名
        </Text>
        <Text className="my-1 text-left text-lg">
          🥷 点击单词，跳转到 moji 词典
        </Text>
        <Text className="my-1 text-left text-lg">
          🧩 机器识别不准确？长按单词进行编辑
        </Text>
        <Text className="my-1 text-left text-lg">
          💪 可调整偏差时间，适应不同音源
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Let's Get Started "
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/(app)');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
