export type LedMatrix = number[][];

export const defaultMatrix = (): LedMatrix =>
  Array.from({ length: 5 }, () => Array(5).fill(0));

// Ví dụ icon trái tim 5x5
const PREDEFINED_IMAGES: Record<string, LedMatrix> = {
  HEART: [
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
};

// Font 5x5 cho chữ cái (thêm dần)
const FONT: Record<string, LedMatrix> = {
  H: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  E: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
  ],
  O: [
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  " ": [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
};

function textToMatrix(text: string): LedMatrix {
  const chars = text.toUpperCase().split("");
  const rows: number[][] = Array.from({ length: 5 }, () => []);
  chars.forEach((ch) => {
    const font = FONT[ch] || FONT[" "];
    for (let r = 0; r < 5; r++) {
      rows[r].push(...font[r], 0); // thêm 1 cột trống
    }
  });
  return rows;
}

// Hàm parse code
export function parseCodeForDisplay(
  code: string,
  onFrame?: (matrix: LedMatrix) => void
): LedMatrix | null {
  // 👉 Case 1: hiển thị hình ảnh có sẵn
  const matchImage = code.match(/display\.show\(["'](\w+)["']\)/);
  if (matchImage && matchImage[1]) {
    const imageName = matchImage[1].toUpperCase();
    if (PREDEFINED_IMAGES[imageName]) {
      const frame = PREDEFINED_IMAGES[imageName];
      if (onFrame) onFrame(frame);
      return frame;
    }
  }

  // 👉 Case 2: hiển thị chữ chạy
  const matchScroll = code.match(/display\.scroll\(['"](.+?)['"]\)/);
  if (matchScroll && matchScroll[1]) {
    const text = matchScroll[1];
    const bigMatrix = textToMatrix(text);

    let offset = 0;
    const interval = setInterval(() => {
      if (offset > bigMatrix[0].length - 5) {
        clearInterval(interval);
        return;
      }
      const frame: LedMatrix = Array.from({ length: 5 }, (_, r) =>
        bigMatrix[r].slice(offset, offset + 5)
      );
      if (onFrame) onFrame(frame);
      offset++;
    }, 300);

    return defaultMatrix();
  }

  return null;
}
