"use client";

import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";

import {
  initMicrobitBlocks,
  registerMicrobitGenerators,
  microbitToolbox,
} from "../libs/microbit-blocks"; // Sửa lại đường dẫn cho nhất quán

interface BlocklyComponentProps {
  onCodeChange: (code: string) => void;
}

export default function BlocklyComponent({ onCodeChange }: BlocklyComponentProps) {
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  // Sử dụng useEffect để khởi tạo và dọn dẹp workspace một cách an toàn
  useEffect(() => {
    // Chỉ thực thi trên client-side và khi div đã được render
    if (!blocklyDivRef.current) return;

    // Khởi tạo các khối và generator
    initMicrobitBlocks();
    registerMicrobitGenerators();

    // Gắn workspace vào div
    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: microbitToolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: "#ccc",
        snap: true,
      },
      trashcan: true, // Thêm thùng rác
    });

    // Hàm xử lý khi có thay đổi
    const handleChange = (event: Blockly.Events.Abstract) => {
      // Chỉ tạo code khi người dùng thực sự thay đổi cấu trúc khối (không phải chỉ click)
      if (event.type === Blockly.Events.UI || event.isUiEvent) {
        return;
      }
      const code = javascriptGenerator.workspaceToCode(workspace);
      onCodeChange(code);
    };

    // Thêm listener
    workspace.addChangeListener(handleChange);

    // Hàm dọn dẹp sẽ được gọi khi component unmount
    return () => {
      workspace.removeChangeListener(handleChange);
      workspace.dispose();
    };
  }, [onCodeChange]);

  return <div ref={blocklyDivRef} className="w-full h-full" />;
}

