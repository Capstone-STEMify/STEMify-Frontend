"use client";

import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import "blockly/blocks";

import {
  initMicrobitBlocks,
  registerMicrobitGenerators,
  microbitToolbox,
} from "../libs/microbit-blocks";

interface BlocklyComponentProps {
  onCodeChange: (code: string) => void;
}

export default function BlocklyComponent({ onCodeChange }: BlocklyComponentProps) {
  const blocklyDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!blocklyDivRef.current) return;

    initMicrobitBlocks();
    registerMicrobitGenerators();

    const workspace = Blockly.inject(blocklyDivRef.current, {
      toolbox: microbitToolbox,
      grid: {
        spacing: 20,
        length: 3,
        colour: "#ccc",
        snap: true,
      },
    });
    console.log("Workspace injected:", workspace);

    const handleChange = () => {
  const code = javascriptGenerator.workspaceToCode(workspace as any);
  console.log("Generated JS code:", code);
  onCodeChange(code);
};

    workspace.addChangeListener(handleChange);

    return () => {
      workspace.removeChangeListener(handleChange);
      workspace.dispose();
    };
  }, [onCodeChange]);

  return <div ref={blocklyDivRef} className="w-full h-full" />;
}
