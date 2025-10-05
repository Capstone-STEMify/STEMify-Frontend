import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

// Định nghĩa block JSON
const microbitDisplayShowHeart = {
  type: "microbit_display_show_heart",
  message0: "hiển thị hình trái tim",
  previousStatement: null,
  nextStatement: null,
  colour: 200,
  tooltip: "Hiển thị biểu tượng trái tim trên màn hình LED của Micro:bit.",
  helpUrl: "",
};

const microbitDisplayScrollText = {
  type: "microbit_display_scroll_text",
  message0: "hiển thị chữ chạy %1",
  args0: [
    {
      type: "input_value",
      name: "TEXT",
      check: "String",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip: "Hiển thị một dòng chữ chạy trên màn hình LED.",
  helpUrl: "",
};

// Khởi tạo block
export const initMicrobitBlocks = () => {
  Blockly.defineBlocksWithJsonArray([
    microbitDisplayShowHeart,
    microbitDisplayScrollText,
  ]);
};

// Đăng ký generator bằng API chính thức
export const registerMicrobitGenerators = () => {
  javascriptGenerator.forBlock["microbit_display_show_heart"] = function (
    block: Blockly.Block
  ) {
    return 'display.show("HEART");\n';
  };

  javascriptGenerator.forBlock["microbit_display_scroll_text"] = function (
    block: Blockly.Block
  ) {
    const text =
      javascriptGenerator.valueToCode(
        block,
        "TEXT",
        (javascriptGenerator as any).ORDER_ATOMIC // 👈 sửa thế này
      ) || "''";
    return `display.scroll(${text});\n`;
  };
};



// Toolbox
export const microbitToolbox = {
  kind: "flyoutToolbox",
  contents: [
    {
      kind: "block",
      type: "microbit_display_show_heart",
    },
    {
      kind: "block",
      type: "microbit_display_scroll_text",
      inputs: {
        TEXT: {
          shadow: {
            type: "text",
            fields: {
              TEXT: "Hello, World!",
            },
          },
        },
      },
    },
  ],
};
