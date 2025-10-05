// lib/simulator-engine.ts

// Hình ảnh 5x5 (độ sáng 0-9)
const PREDEFINED_IMAGES: { [key: string]: number[][] } = {
  HEART: [
    [0, 9, 0, 9, 0],
    [9, 9, 9, 9, 9],
    [9, 9, 9, 9, 9],
    [0, 9, 9, 9, 0],
    [0, 0, 9, 0, 0],
  ],
  HAPPY: [
    [0, 9, 0, 9, 0],
    [0, 9, 0, 9, 0],
    [0, 0, 0, 0, 0],
    [9, 0, 0, 0, 9],
    [0, 9, 9, 9, 0],
  ],
  SAD: [
    [0, 9, 0, 9, 0],
    [0, 9, 0, 9, 0],
    [0, 0, 0, 0, 0],
    [0, 9, 9, 9, 0],
    [9, 0, 0, 0, 9],
  ],
};

// Ma trận mặc định (tắt hết LED)
export const defaultMatrix = () => [
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0],
];

/**
 * Parse code JS để tìm lệnh display.show("XXX")
 * và trả về ma trận LED
 */
export function parseCodeForDisplay(code: string): number[][] | null {
  const match = code.match(/display\.show\("(\w+)"\)/);

  if (match && match[1]) {
    const imageName = match[1];
    if (PREDEFINED_IMAGES[imageName]) {
      return PREDEFINED_IMAGES[imageName];
    }
  }

  return null;
}
