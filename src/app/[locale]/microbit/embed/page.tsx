'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import 'blockly/blocks';
import type { WorkspaceSvg } from 'blockly';
import { pythonGenerator } from 'blockly/python';
import 'blockly/msg/vi'; // UI labels in Vietnamese

/** ----------------- Custom blocks ----------------- */
/** mb_led_set_pixel, mb_scroll_text, mb_forever */
function defineCustomBlocks() {
  // ----- Set Pixel -----
  Blockly.Blocks['mb_led_set_pixel'] = {
    init: function () {
      this.setColour(188);
      this.appendDummyInput().appendField('Bật LED');
      this.appendDummyInput().appendField('x').appendField(new Blockly.FieldNumber(2, 0, 4, 1), 'X');
      this.appendDummyInput().appendField('y').appendField(new Blockly.FieldNumber(2, 0, 4, 1), 'Y');
      this.appendDummyInput().appendField('độ sáng 0–9').appendField(new Blockly.FieldNumber(9, 0, 9, 1), 'B');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Turn on LED at (x, y) on the micro:bit 5×5 matrix');
    },
  };
  (pythonGenerator as any).forBlock['mb_led_set_pixel'] = function (block: Blockly.Block) {
    const x = block.getFieldValue('X') ?? '0';
    const y = block.getFieldValue('Y') ?? '0';
    const b = block.getFieldValue('B') ?? '9';
    return `display.set_pixel(${x}, ${y}, ${b})\n`;
  };

  // ----- Scroll Text -----
  Blockly.Blocks['mb_scroll_text'] = {
    init: function () {
      this.setColour(200);
      this.appendDummyInput().appendField('Cuộn chữ')
        .appendField(new Blockly.FieldTextInput('HELLO STEMIFY'), 'TEXT');
      this.appendDummyInput().appendField('tốc độ (ms/ký tự)')
        .appendField(new Blockly.FieldNumber(120, 10, 1000, 10), 'SPEED');
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setTooltip('Scroll a text across the display. Lower speed = faster scroll.');
    },
  };
  (pythonGenerator as any).forBlock['mb_scroll_text'] = function (block: Blockly.Block) {
    const raw = (block.getFieldValue('TEXT') ?? '').toString();
    const speed = block.getFieldValue('SPEED') ?? '120';
    const pyText = JSON.stringify(raw); // safe quoting
    return `display.scroll(${pyText}, delay=${speed})\n`;
  };

  // ----- Forever loop -----
  Blockly.Blocks['mb_forever'] = {
    init: function () {
      this.setColour(210);
      this.appendDummyInput().appendField('lặp mãi mãi');
      this.appendStatementInput('DO');
      this.setTooltip('Run the enclosed blocks forever (while True:).');
    },
  };
  (pythonGenerator as any).forBlock['mb_forever'] = function (block: Blockly.Block, gen: any) {
    const P = gen || pythonGenerator;
    const body = P.statementToCode(block, 'DO');
    return `while True:\n${body || '  pass\\n'}`;
  };
}

/** ----------------- Toolbox (JSON) ----------------- */
const TOOLBOX_JSON = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'LED 5x5',
      colour: '#5CA699',
      contents: [
        { kind: 'block', type: 'mb_led_set_pixel' },
        { kind: 'block', type: 'mb_scroll_text' },
        { kind: 'block', type: 'mb_forever' },
      ],
    },
    {
      kind: 'category',
      name: 'Logic',
      colour: '#5C81A6',
      contents: [
        { kind: 'block', type: 'controls_if' },
        { kind: 'block', type: 'logic_compare' },
      ],
    },
  ],
} as const;

/** ----------------- Page ----------------- */
export default function MicrobitBlocklyPage() {
  const [python, setPython] = useState('# Auto-generated MicroPython will appear here');
  const blocklyDivRef = useRef<HTMLDivElement | null>(null);
  const workspaceRef = useRef<WorkspaceSvg | null>(null);
  const didInitBlocks = useRef(false);

  // Starter XML: a ready-to-run scroll text block
  const initialXml = useMemo(
    () => `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="mb_scroll_text" x="30" y="30">
        <field name="TEXT">hello stemify</field>
        <field name="SPEED">120</field>
      </block>
    </xml>
  `,
    []
  );

  useEffect(() => {
    if (!blocklyDivRef.current) return;

    // Ensure custom blocks are registered BEFORE injecting the workspace
    if (!didInitBlocks.current) {
      defineCustomBlocks();
      didInitBlocks.current = true;
    }

    // Inject with JSON toolbox
    const workspace = Blockly.inject(blocklyDivRef.current, {
      renderer: 'thrasos',
      grid: { spacing: 20, length: 3, colour: '#ccc' },
      trashcan: true,
      toolbox: TOOLBOX_JSON as any,
      media: 'https://blockly-demo.appspot.com/static/media/',
    });
    workspaceRef.current = workspace;

    // Load initial program
    try {
      const dom = Blockly.utils.xml.textToDom(initialXml);
      Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
    } catch (e) {
      console.error('Load initial XML error:', e);
    }

    // Generate MicroPython on every change
    const onChange = () => {
      const body = pythonGenerator.workspaceToCode(workspace);
      const full = `from microbit import *\n${body || ''}`;
      setPython(full);
    };
    workspace.addChangeListener(onChange);
    onChange();

    return () => {
      workspace.removeChangeListener(onChange);
      workspace.dispose();
      workspaceRef.current = null;
    };
  }, [initialXml]);

  const downloadPy = () => {
    const blob = new Blob([python], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'main.py';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
      <div className="h-[70vh] rounded-xl overflow-hidden border">
        <div ref={blocklyDivRef} className="h-full w-full" />
      </div>

      <div className="h-[70vh] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">MicroPython (auto-generated)</h3>
          <button onClick={downloadPy} className="px-3 py-1.5 rounded-md bg-black text-white">
            Download main.py
          </button>
        </div>
        <textarea readOnly value={python} className="flex-1 w-full p-3 rounded-md border font-mono text-sm" />
        <div className="text-xs text-gray-500 mt-2">
          👉 Flash nhanh: mở <a className="underline" href="https://python.microbit.org/v/3" target="_blank">Python Editor</a>, dán code, rồi Download/Flash (WebUSB).
        </div>
      </div>
    </div>
  );
}
