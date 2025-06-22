"use client";
import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";

const BlocklyEditor = ({ onWorkspaceReady }) => {
  const blocklyDiv = useRef(null);

  const toolbox = {
    kind: "flyoutToolbox",
    contents: [
      { kind: "block", type: "move_right" },
      { kind: "block", type: "move_left" },
      { kind: "block", type: "jump" },
      { kind: "block", type: "shoot" }
    ]
  };

  const defineBlocks = () => {
    Blockly.Blocks["move_right"] = {
      init: function () {
        this.appendDummyInput().appendField("Di chuyển sang phải");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
    javascriptGenerator.forBlock["move_right"] = () => {
      return "player.setVelocityX(150);\n";
    };

    Blockly.Blocks["move_left"] = {
      init: function () {
        this.appendDummyInput().appendField("Di chuyển sang trái");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(160);
      },
    };
    javascriptGenerator.forBlock["move_left"] = () => {
      return "player.setVelocityX(-150);\n";
    };

    Blockly.Blocks["jump"] = {
      init: function () {
        this.appendDummyInput().appendField("Nhảy");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(210);
      },
    };
    javascriptGenerator.forBlock["jump"] = () => {
      return "player.setVelocityY(-300);\n";
    };

    Blockly.Blocks["shoot"] = {
      init: function () {
        this.appendDummyInput().appendField("Bắn đạn");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
      },
    };
    javascriptGenerator.forBlock["shoot"] = () => {
      return "shootBullet();\n";
    };
  };

  useEffect(() => {
    defineBlocks();
    const workspace = Blockly.inject(blocklyDiv.current, { toolbox });
    onWorkspaceReady(workspace);
  }, []);

  return <div ref={blocklyDiv} style={{ height: 300, width: "100%" }} />;
};

export default BlocklyEditor;
