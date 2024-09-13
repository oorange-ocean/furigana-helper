import type { Lyric, Song } from '@/types/lyrics';

export function parseLRC(lrcContent: string,song: Song): Song {
  console.log('开始解析LRC内容');
  const lines = lrcContent.split('\n');
  console.log(`LRC文件共有 ${lines.length} 行`);

  const metadata: { [key: string]: string } = {};
  let lyrics: Lyric[] = [];

  lines.forEach((line) => {
    // console.log(`处理第 ${index + 1} 行: ${line}`);
    if (line.startsWith('[') && line.includes(']')) {
      const parts = line.split(']');
      const timestamp = parts[0].substring(1);
      const content = parts.slice(1).join(']').trim();

      if (['ar', 'al', 'ti', 'au', 'length', 'by', 're', 've'].includes(timestamp)) {
        metadata[timestamp] = content;
        // console.log(`解析到元数据: ${timestamp} = ${content}`);
      } else if (timestamp.match(/^\d{2}:\d{2}\.\d{2,3}$/)) {
        // console.log(`解析到时间戳: ${timestamp}`);
        
        // 检查是否存在相同时间戳的歌词
        const existingLyricIndex = lyrics.findIndex(lyric => lyric.timestamp === timestamp);
        
        if (existingLyricIndex !== -1) {
          // 如果存在相同时间戳的歌词,则认为当前行是翻译
          lyrics = lyrics.map((lyric, i) => {
            if (i === existingLyricIndex) {
              return {
                ...lyric,
                translations: {
                  ...lyric.translations,
                  zh: content.replace(/^[""]|[""]$/g, '').trim()
                }
              };
            }
            return lyric;
          });
          // console.log('解析到翻译:', content.replace(/^[""]|[""]$/g, '').trim());
        } else {
          // 如果不存在相同时间戳的歌词,则创建新的歌词对象
          const newLyric: Lyric = {
            timestamp,
            words: [],
            translations: { en: '', zh: '' },
            original: content.replace(/^[""]|[""]$/g, '').trim(),
          };
          lyrics.push(newLyric);
          // console.log('创建新的歌词对象:', newLyric);
        }
      }
    } else if (line.includes('::')) {
      const [original, romaji, translation] = line.split('::').map(s => s.trim());
      if (lyrics.length > 0) {
        const lastLyric = lyrics[lyrics.length - 1];
        lyrics[lyrics.length - 1] = {
          ...lastLyric,
          original: original,
          romaji: romaji,
          translations: { ...lastLyric.translations, zh: translation }
        };
        // console.log('解析到带有假名和翻译的歌词:', { original, romaji, translation });
      }
    } else {
      console.error('无法解析的行:', line);
    }
  });

  // console.log(`解析完成。元数据数量: ${Object.keys(metadata).length}, 歌词行数: ${lyrics.length}`);

  const parsedSong: Song = {
    ...song,
    title: metadata.ti || song.title,
    artist: metadata.ar || song.artist,
    album: metadata.al || song.album,
    audioUri: song.audioUri, // 需要设置音频URI
    isLocalAudio: song.isLocalAudio, // 需要根据实际情况设置
    lyrics,
    metadata,
  };

  // console.log('生成的Song对象:', JSON.stringify(parsedSong, null, 2));

  return parsedSong;
}