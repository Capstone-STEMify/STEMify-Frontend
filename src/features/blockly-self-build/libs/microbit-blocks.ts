import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

// ==================================================================
// === CÁC KHỐI HIỆN CÓ CỦA BẠN ===
// ==================================================================

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

// ==================================================================
// === KHỐI MỚI: SỰ KIỆN NHẤN NÚT ===
// ==================================================================

const onButtonPressed = {
  "type": "on_button_pressed",
  "message0": "khi nút %1 được nhấn",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "BUTTON",
      // Giá trị (value) tương ứng với API JavaScript của MakeCode
      "options": [
        ["A", "Button.A"],
        ["B", "Button.B"],
        ["A+B", "Button.AB"]
      ]
    }
  ],
  "message1": "thực hiện %1",
  "args1": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "colour": 65, // Màu vàng cam cho sự kiện
  "tooltip": "Thực thi các khối lệnh bên trong khi một nút được nhấn.",
};


// ==================================================================
// === KHỐI MỚI: ĐIỀU KHIỂN SERVO ===
// ==================================================================

const servoWriteAngle = {
    "type": "servo_write_angle",
    "message0": "xoay servo ở chân %1 đến góc %2 độ",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "PIN",
            // Giá trị (value) tương ứng với API JavaScript của MakeCode
            "options": [
                ["P0", "AnalogPin.P0"],
                ["P1", "AnalogPin.P1"],
                ["P2", "AnalogPin.P2"]
            ]
        },
        {
            "type": "field_number",
            "name": "ANGLE",
            "value": 90,
            "min": 0,
            "max": 180
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": 150, // Màu xanh lá cho các khối điều khiển chân cắm
    "tooltip": "Xoay động cơ servo đến một góc cụ thể (0-180 độ).",
};


// Khởi tạo tất cả các block
export const initMicrobitBlocks = () => {
  Blockly.defineBlocksWithJsonArray([
    microbitDisplayShowHeart,
    microbitDisplayScrollText,
    onButtonPressed,      // Thêm khối mới
    servoWriteAngle       // Thêm khối mới
  ]);
};

// Đăng ký các bộ sinh mã JavaScript
export const registerMicrobitGenerators = () => {
  // --- Các generator cũ ---
  javascriptGenerator.forBlock["microbit_display_show_heart"] = function (
    block: Blockly.Block
  ) {
    // MakeCode JS thường dùng hàm basic.showLeds() hoặc basic.showIcon()
    return 'basic.showIcon(IconNames.Heart);\n';
  };

  javascriptGenerator.forBlock["microbit_display_scroll_text"] = function (
    block: Blockly.Block
  ) {
    const text =
      javascriptGenerator.valueToCode(
        block,
        "TEXT",
        (javascriptGenerator as any).ORDER_ATOMIC
      ) || "''";
    return `basic.showString(${text});\n`;
  };
  
  // --- Các generator mới ---
  javascriptGenerator.forBlock["on_button_pressed"] = function (
    block: Blockly.Block
  ) {
    const button = block.getFieldValue('BUTTON');
    const branch = javascriptGenerator.statementToCode(block, 'DO');
    return `input.onButtonPressed(${button}, function () {\n${branch}});\n`;
  };

  javascriptGenerator.forBlock["servo_write_angle"] = function (
    block: Blockly.Block
  ) {
    const pin = block.getFieldValue('PIN');
    const angle = block.getFieldValue('ANGLE');
    return `pins.servoWritePin(${pin}, ${angle});\n`;
  };
};

// Toolbox được cập nhật với các danh mục mới
export const microbitToolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Hiển thị',
      colour: '230',
      contents: [
        { kind: 'block', type: 'microbit_display_show_heart' },
        {
          kind: 'block',
          type: 'microbit_display_scroll_text',
          inputs: {
            TEXT: {
              shadow: {
                type: 'text',
                fields: { TEXT: 'Hello, World!' },
              },
            },
          },
        },
      ],
    },
    {
      kind: 'category',
      name: 'Sự kiện',
      colour: '65',
      contents: [
        { kind: 'block', type: 'on_button_pressed' },
      ],
    },
    {
      kind: 'category',
      name: 'Servo',
      colour: '150',
      contents: [
        { kind: 'block', type: 'servo_write_angle' },
      ],
    },
  ],
};