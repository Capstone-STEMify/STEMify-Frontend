'use client'
import React, { useEffect, useRef } from 'react'
import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

const BlocklyEditor = ({ onWorkspaceReady }) => {
  const blocklyDiv = useRef(null)

  const toolbox = {
    kind: 'flyoutToolbox',
    contents: [
      { kind: 'block', type: 'move_right' },
      { kind: 'block', type: 'move_left' },
      { kind: 'block', type: 'jump' },
      { kind: 'block', type: 'shoot' },
      { kind: 'block', type: 'repeat_times' },
      { kind: 'block', type: 'if_block' },
      { kind: 'block', type: 'say_block' }
    ]
  }

  const defineBlocks = () => {
    Blockly.Blocks['move_right'] = {
      init: function () {
        this.appendDummyInput().appendField('Di chuyển sang phải')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(160)
      }
    }
    javascriptGenerator.forBlock['move_right'] = () => {
      return 'player.setVelocityX(150);\n'
    }

    Blockly.Blocks['move_left'] = {
      init: function () {
        this.appendDummyInput().appendField('Di chuyển sang trái')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(160)
      }
    }
    javascriptGenerator.forBlock['move_left'] = () => {
      return 'player.setVelocityX(-150);\n'
    }

    Blockly.Blocks['jump'] = {
      init: function () {
        this.appendDummyInput().appendField('Nhảy')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(210)
      }
    }
    javascriptGenerator.forBlock['jump'] = () => {
      return 'player.setVelocityY(-300);\n'
    }

    Blockly.Blocks['shoot'] = {
      init: function () {
        this.appendDummyInput().appendField('Bắn đạn')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(60)
      }
    }
    javascriptGenerator.forBlock['shoot'] = () => {
      return 'shootBullet();\n'
    }
    // 🔁 Repeat block
    Blockly.Blocks['repeat_times'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('Lặp lại')
          .appendField(new Blockly.FieldNumber(3, 1), 'TIMES')
          .appendField('lần')
        this.appendStatementInput('DO').setCheck(null).appendField('thực hiện')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(120)
      }
    }
    javascriptGenerator.forBlock['repeat_times'] = function (block) {
      const times = block.getFieldValue('TIMES')
      const statements = javascriptGenerator.statementToCode(block, 'DO')
      return `for (let i = 0; i < ${times}; i++) {\n${statements}}\n`
    }

    // ❓ If block
    Blockly.Blocks['if_block'] = {
      init: function () {
        this.appendDummyInput()
          .appendField('Nếu')
          .appendField(
            new Blockly.FieldDropdown([
              ['đang ở bên trái', 'LEFT'],
              ['đang ở bên phải', 'RIGHT']
            ]),
            'COND'
          )
        this.appendStatementInput('DO').setCheck(null).appendField('thực hiện')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(0)
      }
    }
    javascriptGenerator.forBlock['if_block'] = function (block) {
      const cond = block.getFieldValue('COND')
      const statements = javascriptGenerator.statementToCode(block, 'DO')
      const jsCond = cond === 'LEFT' ? 'player.x < 400' : 'player.x >= 400'
      return `if (${jsCond}) {\n${statements}}\n`
    }

    // 📢 Say/console log block
    Blockly.Blocks['say_block'] = {
      init: function () {
        this.appendDummyInput().appendField('In ra').appendField(new Blockly.FieldTextInput('Hello'), 'TEXT')
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(290)
      }
    }
    javascriptGenerator.forBlock['say_block'] = function (block) {
      const text = block.getFieldValue('TEXT')
      return `console.log("${text}");\n`
    }
  }

  useEffect(() => {
    defineBlocks()
    const workspace = Blockly.inject(blocklyDiv.current, { toolbox })
    onWorkspaceReady(workspace)
  }, [])

  return <div ref={blocklyDiv} style={{ height: 300, width: '100%' }} />
}

export default BlocklyEditor
