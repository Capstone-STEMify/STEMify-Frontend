"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { javascriptGenerator } from "blockly/javascript";
import BlocklyEditor from "@/features/blockly-phaser/blockly/BlocklyEditor";

// Import PhaserGame bằng dynamic
const PhaserGame = dynamic(() => import("@/features/blockly-phaser/phaser/PhaserGame"), {
  ssr: false,
});

export default function HomePage() {
  const [workspace, setWorkspace] = useState(null);
  const [code, setCode] = useState("");

  const handleRun = () => {
    if (!workspace) return;
    const generatedCode = javascriptGenerator.workspaceToCode(workspace);
    setCode(generatedCode);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Học Lập Trình Qua Game</h1>

      <BlocklyEditor onWorkspaceReady={setWorkspace} />

      <button
        onClick={handleRun}
        style={{
          marginTop: 10,
          padding: "10px 20px",
          fontSize: 16,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer"
        }}
      >
        Chạy chương trình
      </button>

      <PhaserGame code={code} />
    </div>
  );
}
