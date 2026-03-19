/**
 * Code Validation Module
 * Strict validation for each level - checks code structure and logic
 */

class CodeValidator {
  /**
   * Remove comments and normalize whitespace for validation
   */
  static normalize(code) {
    // Remove single-line comments
    code = code.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    return code;
  }

  /**
   * Level 1: Hello, Embedded World
   */
  static validateLevel1(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /\#include\s*<stdio\.h>/i,
      /int\s+main\s*\(/i,
      /printf\s*\(.*Hello.*Embedded.*World.*\\n/i,
      /return\s+0/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 2: Set a Bit
   */
  static validateLevel2(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /unsigned\s+char\s+reg\s*=\s*0/i,
      /\|=.*1.*<<.*3/i,
      /printf/i,
      /return\s+0/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 3: Clear a Bit
   */
  static validateLevel3(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /unsigned\s+char\s+reg\s*=\s*0xFF/i,
      /&=.*~.*1.*<<.*5|&=.*\(.*~.*1.*<<.*5/i,
      /printf/i,
      /return\s+0/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 4: Toggle a Bit
   */
  static validateLevel4(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /0b00001010|10/,
      /\^=.*1.*<<.*1/i,
      /printf/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 5: Check a Bit
   */
  static validateLevel5(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /0b00110100|52/,
      /if\s*\(.*&.*1.*<<.*2/i,
      /Bit\s+is\s+SET/i,
      /Bit\s+is\s+CLEAR/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 6: Variables & Data Types
   */
  static validateLevel6(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /#include\s*<stdint\.h>/i,
      /uint8_t/i,
      /uint16_t/i,
      /uint32_t/i,
      /255/,
      /1000/,
      /100000/,
      /printf/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 7: Control Flow if/else
   */
  static validateLevel7(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /int\s+temp\s*=\s*85/i,
      /if\s*\(.*temp.*>=.*80/i,
      /OVERHEAT\s+WARNING/i,
      /else\s+if/i,
      /WARM/i,
      /NORMAL/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 8: For Loop
   */
  static validateLevel8(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /for\s*\(/i,
      /i\s*<=\s*5/i,
      /printf/i,
      /i\s*\*\s*i|i\*i/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 9: Arrays
   */
  static validateLevel9(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /int\s+sensors.*\[.*5.*\]\s*=.*23.*45.*12.*67.*34/i,
      /max/i,
      /for/i,
      /printf/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 10: Functions
   */
  static validateLevel10(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /clamp\s*\(/i,
      /return\s+min/i,
      /return\s+max/i,
      /clamp\s*\(.*150.*0.*100/i,
      /printf/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 11: Pointers
   */
  static validateLevel11(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /int\s+x\s*=\s*42/i,
      /int\s*\*\s*ptr\s*=\s*&\s*x/i,
      /\*ptr\s*=\s*100/i,
      /printf.*%d.*x/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 12: Structs
   */
  static validateLevel12(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /struct\s+Sensor/i,
      /int\s+id/i,
      /int\s+value/i,
      /int\s+active/i,
      /struct\s+Sensor\s+s/i,
      /s\.\s*id/i,
      /s\.\s*value/i,
      /ACTIVE|INACTIVE/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 13: Volatile
   */
  static validateLevel13(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /volatile\s+unsigned\s+int\s+status_reg\s*=\s*0xAB/i,
      /printf.*%x/i,
      /status_reg\s*\|=\s*\(.*1.*<<.*4/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 14: Enums
   */
  static validateLevel14(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /enum\s+State/i,
      /IDLE/i,
      /RUNNING/i,
      /ERROR/i,
      /state\s*=\s*RUNNING/i,
      /printf/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Level 15: Static Variables
   */
  static validateLevel15(code) {
    const normalized = this.normalize(code);
    const requirements = [
      /int\s+counter\s*\(/i,
      /static\s+int\s+count\s*=\s*0/i,
      /count\s*\+\+|\+\+\s*count/i,
      /return\s+count/i,
      /for/i,
      /counter\s*\(/i,
      /printf/i
    ];
    return requirements.every(req => req.test(normalized));
  }

  /**
   * Validate code for a specific level
   */
  static validate(levelId, code) {
    const validatorMethod = `validateLevel${levelId}`;
    if (this[validatorMethod]) {
      return this[validatorMethod](code);
    }
    // Fallback - should not reach here
    return false;
  }
}
