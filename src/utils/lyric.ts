// 解析歌词
export function parseLyric(text: string) {
    const lines = text.split("\n");
    const pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
    const result = [];

    // 对于歌词格式不对的特殊处理
    if (!/\[.+\]/.test(text)) {
        return [text];
    }
    for (const item of lines) {
        if (pattern.test(item)) {
            const value = item.replace(pattern, ""); // 存歌词
            result.push(value);
        }
    }
    return result;
}