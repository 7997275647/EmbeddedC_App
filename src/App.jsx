import { useState, useCallback } from "react";

const LEVELS = [
  {
    id: 1,
    title: "Blink an LED with a Register",
    topic: "GPIO Bit Manipulation",
    description: "In embedded systems, you control hardware by writing to memory-mapped registers. Setting a bit to 1 turns on an output (LED ON), and 0 turns it off. The OR operator `|=` sets bits without disturbing others.",
    task: "Set bit 5 of PORTA register to turn on an LED. PORTA starts at 0x00.",
    hint: "Use PORTA |= (1 << 5); to set only bit 5 high while keeping other bits unchanged.",
    starterCode: `#include <stdint.h>

volatile uint8_t PORTA = 0x00;

void setup() {
    // Set bit 5 to turn on LED
    
}`,
    expectedOutput: "PORTA = 0x20",
    solution: `#include <stdint.h>

volatile uint8_t PORTA = 0x00;

void setup() {
    PORTA |= (1 << 5);
}`,
    explanation: "`1 << 5` creates the value 0b00100000 (0x20). Using `|=` sets only bit 5 without changing any other bits in PORTA.",
  },
  {
    id: 2,
    title: "Clear a GPIO Pin",
    topic: "Bitwise AND + NOT",
    description: "Clearing a bit means setting it to 0. You use the AND operator `&=` with a mask that has 0 in the bit position you want to clear and 1s everywhere else. The NOT operator `~` inverts all bits of a value.",
    task: "Clear bit 3 of PORTB (currently 0xFF) to turn off that pin.",
    hint: "Use PORTB &= ~(1 << 3); The ~ inverts the mask so only bit 3 becomes 0.",
    starterCode: `#include <stdint.h>

volatile uint8_t PORTB = 0xFF;

void clearPin() {
    // Clear bit 3
    
}`,
    expectedOutput: "PORTB = 0xF7",
    solution: `#include <stdint.h>

volatile uint8_t PORTB = 0xFF;

void clearPin() {
    PORTB &= ~(1 << 3);
}`,
    explanation: "`~(1 << 3)` = 0b11110111. AND-ing PORTB (0xFF) with this mask clears only bit 3, giving 0xF7.",
  },
  {
    id: 3,
    title: "Toggle an LED",
    topic: "XOR Operator",
    description: "Toggling a bit flips its state — 0 becomes 1, and 1 becomes 0. The XOR operator `^=` is perfect for this. XOR with 1 always flips the bit; XOR with 0 leaves it unchanged.",
    task: "Toggle bit 2 of PORTC (currently 0x00) to blink the LED.",
    hint: "Use PORTC ^= (1 << 2); to flip bit 2 each time the function is called.",
    starterCode: `#include <stdint.h>

volatile uint8_t PORTC = 0x00;

void toggleLED() {
    // Toggle bit 2
    
}`,
    expectedOutput: "PORTC = 0x04",
    solution: `#include <stdint.h>

volatile uint8_t PORTC = 0x00;

void toggleLED() {
    PORTC ^= (1 << 2);
}`,
    explanation: "`1 << 2` = 0b00000100 = 0x04. XOR with 0x00 sets the bit; calling again would clear it back to 0.",
  },
  {
    id: 4,
    title: "Read a Button State",
    topic: "Bit Testing",
    description: "To check if a specific bit is set (e.g., a button press), use AND with a mask. If the result is non-zero, the bit is set. This is called bit masking or bit testing.",
    task: "Read bit 0 of PIND and return 1 if the button is pressed, 0 otherwise.",
    hint: "Use return (PIND & (1 << 0)) ? 1 : 0; or equivalently (PIND & 0x01) != 0.",
    starterCode: `#include <stdint.h>

volatile uint8_t PIND = 0x01; // bit 0 is set

uint8_t readButton() {
    // Return 1 if bit 0 is set, 0 otherwise
    
}`,
    expectedOutput: "return 1",
    solution: `#include <stdint.h>

volatile uint8_t PIND = 0x01;

uint8_t readButton() {
    return (PIND & (1 << 0)) ? 1 : 0;
}`,
    explanation: "`PIND & (1 << 0)` masks all bits except bit 0. The ternary returns 1 if non-zero (button pressed) or 0 (released).",
  },
  {
    id: 5,
    title: "Configure Timer Prescaler",
    topic: "Multi-bit Field Manipulation",
    description: "Registers often contain multi-bit fields. To set a field without affecting other bits, you must first clear the field using a mask, then OR in the new value. This is the read-modify-write pattern.",
    task: "Set bits [2:1] (CS21 and CS20) of TCCR2B to 0b11 for prescaler /64. TCCR2B starts at 0x00.",
    hint: "First clear bits [2:1] with &= ~0x06, then set them with |= 0x06 (0b00000110).",
    starterCode: `#include <stdint.h>

volatile uint8_t TCCR2B = 0x00;

void setTimer() {
    // Set bits 2:1 to 0b11 (value 0x06)
    
}`,
    expectedOutput: "TCCR2B = 0x06",
    solution: `#include <stdint.h>

volatile uint8_t TCCR2B = 0x00;

void setTimer() {
    TCCR2B &= ~0x06;
    TCCR2B |= 0x06;
}`,
    explanation: "Clear the target bits first with `&= ~0x06`, then set them with `|= 0x06`. This read-modify-write pattern is essential for safe register configuration.",
  },
  {
    id: 6,
    title: "Simple Counter Variable",
    topic: "Variables & Data Types",
    description: "Embedded C uses specific integer types for efficiency. `uint8_t` is an 8-bit unsigned integer (0-255), perfect for small counters. Variables in embedded systems must be carefully sized to save RAM.",
    task: "Declare a uint8_t counter, initialize it to 0, and increment it 5 times using a loop.",
    hint: "Use uint8_t count = 0; then a for loop: for(uint8_t i = 0; i < 5; i++) { count++; }",
    starterCode: `#include <stdint.h>

uint8_t runCounter() {
    // Declare counter, increment 5 times, return it
    
}`,
    expectedOutput: "return 5",
    solution: `#include <stdint.h>

uint8_t runCounter() {
    uint8_t count = 0;
    for(uint8_t i = 0; i < 5; i++) {
        count++;
    }
    return count;
}`,
    explanation: "`uint8_t` is the correct type for small counters. The for loop iterates 5 times, each iteration adding 1 to count, resulting in 5.",
  },
  {
    id: 7,
    title: "Delay with a Loop",
    topic: "Software Delay",
    description: "Without an OS, embedded systems create delays by executing empty loops. A volatile counter prevents the compiler from optimizing away the loop. This is a simple but imprecise delay method.",
    task: "Create a delay function using a volatile loop counter that counts to 1000.",
    hint: "Use volatile uint16_t i; for(i = 0; i < 1000; i++); The volatile keyword prevents compiler optimization.",
    starterCode: `#include <stdint.h>

void delay_ms() {
    // Create a loop that counts to 1000
    
}`,
    expectedOutput: "loop count = 1000",
    solution: `#include <stdint.h>

void delay_ms() {
    volatile uint16_t i;
    for(i = 0; i < 1000; i++);
}`,
    explanation: "`volatile` tells the compiler this variable may change unexpectedly, preventing optimization. Without it, the compiler might eliminate the loop entirely as 'dead code'.",
  },
  {
    id: 8,
    title: "Write to UART Register",
    topic: "Serial Communication",
    description: "UART (Universal Asynchronous Receiver-Transmitter) sends data serially. You write a byte to the data register (UDR0) to transmit it. You must first check the UDRE0 bit in UCSR0A to ensure the buffer is empty.",
    task: "Wait for UDRE0 (bit 5 of UCSR0A) to be set, then write 'A' (0x41) to UDR0.",
    hint: "while(!(UCSR0A & (1<<5))); then UDR0 = 0x41;",
    starterCode: `#include <stdint.h>

volatile uint8_t UCSR0A = 0x20; // UDRE0 already set
volatile uint8_t UDR0 = 0x00;

void sendChar() {
    // Wait for buffer empty (bit 5), then send 'A'
    
}`,
    expectedOutput: "UDR0 = 0x41",
    solution: `#include <stdint.h>

volatile uint8_t UCSR0A = 0x20;
volatile uint8_t UDR0 = 0x00;

void sendChar() {
    while(!(UCSR0A & (1 << 5)));
    UDR0 = 0x41;
}`,
    explanation: "The while loop polls UDRE0 (bit 5) until it's 1, meaning the transmit buffer is ready. Then 0x41 ('A' in ASCII) is written to UDR0 for transmission.",
  },
  {
    id: 9,
    title: "ADC Read Function",
    topic: "Analog-to-Digital Conversion",
    description: "ADCs convert analog voltages to digital values. On AVR microcontrollers, you start conversion by setting the ADSC bit, then poll until ADSC clears (conversion complete), then read ADCW.",
    task: "Start ADC conversion (set bit 6 of ADCSRA), wait for it to complete (ADSC clears), then return ADCW.",
    hint: "ADCSRA |= (1<<6); while(ADCSRA & (1<<6)); return ADCW;",
    starterCode: `#include <stdint.h>

volatile uint8_t ADCSRA = 0x00;
volatile uint16_t ADCW = 512; // simulated result

uint16_t readADC() {
    // Start conversion, wait, return result
    
}`,
    expectedOutput: "return 512",
    solution: `#include <stdint.h>

volatile uint8_t ADCSRA = 0x00;
volatile uint16_t ADCW = 512;

uint16_t readADC() {
    ADCSRA |= (1 << 6);
    while(ADCSRA & (1 << 6));
    return ADCW;
}`,
    explanation: "Setting ADSC (bit 6) starts the conversion. The while loop waits until hardware clears ADSC upon completion. ADCW holds the 10-bit result as a 16-bit value.",
  },
  {
    id: 10,
    title: "Write a Function with Pointer",
    topic: "Pointers & Pass by Reference",
    description: "In Embedded C, pointers are essential for passing hardware addresses and modifying variables in-place. A pointer stores the memory address of another variable. Dereferencing with `*` accesses the value at that address.",
    task: "Write a function that takes a uint8_t pointer and doubles the value at that address.",
    hint: "void doubleVal(uint8_t *p) { *p = *p * 2; } — use *p to dereference.",
    starterCode: `#include <stdint.h>

void doubleValue(uint8_t *val) {
    // Double the value at the pointer address
    
}`,
    expectedOutput: "*val = 2x original",
    solution: `#include <stdint.h>

void doubleValue(uint8_t *val) {
    *val = (*val) * 2;
}`,
    explanation: "`*val` dereferences the pointer to access the actual value. Multiplying by 2 and storing back modifies the original variable in the caller's scope — essential for embedded register manipulation.",
  },
  {
    id: 11,
    title: "Array of Sensor Readings",
    topic: "Arrays",
    description: "Arrays store multiple values of the same type in contiguous memory — perfect for buffering sensor data. In embedded systems, fixed-size arrays are preferred since dynamic allocation (`malloc`) is often avoided.",
    task: "Fill a 5-element uint16_t array with values 100, 200, 300, 400, 500 and return the sum.",
    hint: "Declare uint16_t data[5] = {100,200,300,400,500}; then loop to sum with a uint32_t accumulator.",
    starterCode: `#include <stdint.h>

uint32_t sumReadings() {
    // Declare array, populate it, return sum
    
}`,
    expectedOutput: "return 1500",
    solution: `#include <stdint.h>

uint32_t sumReadings() {
    uint16_t data[5] = {100, 200, 300, 400, 500};
    uint32_t sum = 0;
    for(uint8_t i = 0; i < 5; i++) {
        sum += data[i];
    }
    return sum;
}`,
    explanation: "The array initializer sets all 5 values at once. A `uint32_t` accumulator prevents overflow (5 × 500 = 2500, fits in uint16_t, but larger datasets could overflow). Always size your accumulator appropriately.",
  },
  {
    id: 12,
    title: "Struct for Sensor Data",
    topic: "Structures",
    description: "Structs group related data into a single type. In embedded systems, structs model hardware peripherals, sensor readings, or communication packets. They improve code readability and organization.",
    task: "Define a struct `Sensor` with uint8_t id and uint16_t value. Create an instance, set id=1 and value=350, return value.",
    hint: "typedef struct { uint8_t id; uint16_t value; } Sensor; then Sensor s; s.id=1; s.value=350;",
    starterCode: `#include <stdint.h>

// Define Sensor struct here

uint16_t getSensorValue() {
    // Create instance, set id=1, value=350, return value
    
}`,
    expectedOutput: "return 350",
    solution: `#include <stdint.h>

typedef struct {
    uint8_t id;
    uint16_t value;
} Sensor;

uint16_t getSensorValue() {
    Sensor s;
    s.id = 1;
    s.value = 350;
    return s.value;
}`,
    explanation: "`typedef struct` creates a named type. Member access uses dot notation. In embedded systems, structs are also used to overlay on memory-mapped registers for cleaner register access.",
  },
  {
    id: 13,
    title: "Interrupt Service Routine",
    topic: "ISR & Volatile Globals",
    description: "Interrupts allow hardware events to interrupt normal program flow. ISRs must be fast. Variables shared between an ISR and main code must be `volatile` to prevent compiler caching. In AVR, use ISR(VECTOR) macro.",
    task: "Declare a volatile global flag, write an ISR-style function that sets it to 1.",
    hint: "volatile uint8_t flag = 0; void INT0_handler() { flag = 1; } — volatile ensures main() sees the update.",
    starterCode: `#include <stdint.h>

// Declare volatile flag here

void INT0_handler() {
    // Set the flag to 1 (simulating an ISR)
    
}`,
    expectedOutput: "flag = 1",
    solution: `#include <stdint.h>

volatile uint8_t flag = 0;

void INT0_handler() {
    flag = 1;
}`,
    explanation: "`volatile` forces the compiler to always read from memory, never cache the value in a register. Without it, main() might never see the flag change made by the ISR.",
  },
  {
    id: 14,
    title: "Enum for State Machine",
    topic: "Enumerations & State Machines",
    description: "Enums define named integer constants, making state machines readable. Finite state machines (FSMs) are fundamental in embedded software for controlling system behavior — traffic lights, communication protocols, device modes.",
    task: "Define an enum with states IDLE, RUNNING, ERROR. Write a function that transitions from IDLE to RUNNING and returns the new state.",
    hint: "typedef enum { IDLE=0, RUNNING, ERROR } State; State next = IDLE; if(next==IDLE) next=RUNNING;",
    starterCode: `#include <stdint.h>

// Define State enum here

int transition() {
    // Start at IDLE, move to RUNNING, return state as int
    
}`,
    expectedOutput: "return 1 (RUNNING)",
    solution: `#include <stdint.h>

typedef enum {
    IDLE = 0,
    RUNNING,
    ERROR
} State;

int transition() {
    State state = IDLE;
    if(state == IDLE) {
        state = RUNNING;
    }
    return (int)state;
}`,
    explanation: "Enum values default to sequential integers (IDLE=0, RUNNING=1, ERROR=2). State machines check the current state and transition based on events — the backbone of real-time embedded control.",
  },
  {
    id: 15,
    title: "Circular Buffer Implementation",
    topic: "Data Structures — Ring Buffer",
    description: "A circular buffer (ring buffer) is a fixed-size FIFO buffer widely used in embedded systems for UART receive buffers, data logging, and event queues. When the pointer reaches the end, it wraps around using modulo arithmetic.",
    task: "Write a push function for a circular buffer of size 4. Use head index and modulo to wrap around.",
    hint: "buf[head] = data; head = (head + 1) % BUF_SIZE; Modulo keeps head within bounds.",
    starterCode: `#include <stdint.h>
#define BUF_SIZE 4

uint8_t buffer[BUF_SIZE];
uint8_t head = 0;

void pushByte(uint8_t data) {
    // Store data at head, advance head with wrap-around
    
}`,
    expectedOutput: "buffer[head] set, head wraps",
    solution: `#include <stdint.h>
#define BUF_SIZE 4

uint8_t buffer[BUF_SIZE];
uint8_t head = 0;

void pushByte(uint8_t data) {
    buffer[head] = data;
    head = (head + 1) % BUF_SIZE;
}`,
    explanation: "`head = (head + 1) % BUF_SIZE` wraps head back to 0 after reaching BUF_SIZE-1. This creates the 'circular' effect without bounds checking. Used in virtually every UART driver in the embedded world.",
  },
];

const BADGE_ICONS = {
  5:  "◈",
  10: "◉",
  15: "★",
};

function normalizeCode(code) {
  return code.replace(/\s+/g, " ").replace(/\/\/.*$/gm, "").trim().toLowerCase();
}

function checkSolution(userCode, level) {
  const norm = normalizeCode(userCode);
  const sol = normalizeCode(level.solution);
  if (norm === sol) return true;
  const keywords = level.solution
    .match(/[|&^~<>=!]+\s*\(?\s*1\s*<<\s*\d|0x[0-9a-fA-F]+|\*\w+|\w+\s*\[|\w+\s*%\s*\w+|->|typedef|volatile|for\s*\(|while\s*\(/g) || [];
  const matched = keywords.filter(kw => norm.includes(normalizeCode(kw)));
  return matched.length >= Math.ceil(keywords.length * 0.7);
}

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [completedLevels, setCompletedLevels] = useState(new Set());
  const [userCode, setUserCode] = useState(LEVELS[0].starterCode);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [animateBadge, setAnimateBadge] = useState(false);

  const level = LEVELS[currentLevel];
  const progress = (completedLevels.size / LEVELS.length) * 100;

  const handleSubmit = useCallback(() => {
    const correct = checkSolution(userCode, level);
    if (correct) {
      const newCompleted = new Set(completedLevels);
      newCompleted.add(level.id);
      setCompletedLevels(newCompleted);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (BADGE_ICONS[newCompleted.size]) setAnimateBadge(true);
      setFeedback({ type: "success", message: "Correct! Well done." });
      setTimeout(() => setAnimateBadge(false), 1000);
    } else {
      setStreak(0);
      setFeedback({ type: "error", message: "Not quite right. Check the expected output and try again." });
    }
    setShowSolution(false);
    setShowHint(false);
  }, [userCode, level, completedLevels, streak]);

  const handleLevelChange = (idx) => {
    setCurrentLevel(idx);
    setUserCode(LEVELS[idx].starterCode);
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
    setShowLevelSelect(false);
  };

  const handleReset = () => {
    setUserCode(level.starterCode);
    setFeedback(null);
    setShowHint(false);
    setShowSolution(false);
  };

  const badges = [];
  if (completedLevels.size >= 5) badges.push({ icon: "◈", label: "Bit Flipper", at: 5 });
  if (completedLevels.size >= 10) badges.push({ icon: "◉", label: "Register Master", at: 10 });
  if (completedLevels.size >= 15) badges.push({ icon: "★", label: "Embedded Pro", at: 15 });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0f2347 50%, #0a1628 100%)",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
      color: "#e2e8f0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0a1628; }
        ::-webkit-scrollbar-thumb { background: #1e4080; border-radius: 3px; }
        .code-area {
          width: 100%; min-height: 200px; background: #050d1a;
          color: #93c5fd; border: 1px solid #1e3a6e; border-radius: 8px;
          padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 13px;
          line-height: 1.7; resize: vertical; outline: none;
          transition: border-color 0.2s;
        }
        .code-area:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.15); }
        .btn { 
          padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer;
          font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600;
          transition: all 0.15s; letter-spacing: 0.03em;
        }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-ghost { background: transparent; color: #93c5fd; border: 1px solid #1e3a6e; }
        .btn-ghost:hover { background: #0f2347; border-color: #3b82f6; }
        .btn-danger { background: transparent; color: #f87171; border: 1px solid #7f1d1d; }
        .btn-danger:hover { background: rgba(248,113,113,0.1); }
        .level-pill {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 6px; cursor: pointer;
          font-size: 11px; font-weight: 600; transition: all 0.15s;
          border: 1px solid transparent;
        }
        .level-pill:hover { transform: translateY(-1px); }
        .badge-pop { animation: badgePop 0.6s ease; }
        @keyframes badgePop {
          0% { transform: scale(1); }
          40% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        .pulse { animation: pulseGlow 2s infinite; }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50% { box-shadow: 0 0 0 6px rgba(59,130,246,0); }
        }
        .slide-in { animation: slideIn 0.3s ease; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .progress-bar-inner {
          height: 100%; background: linear-gradient(90deg, #2563eb, #38bdf8);
          border-radius: 4px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>

      {/* Header */}
      <header style={{
        background: "rgba(5,13,26,0.9)", borderBottom: "1px solid #1e3a6e",
        backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 32, height: 32, background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16,
              }}>⟨/⟩</div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 18, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
                EmbeddedC
              </span>
              <span style={{ fontSize: 11, color: "#64748b", background: "#0f1e35", padding: "2px 8px", borderRadius: 4, border: "1px solid #1e3a6e" }}>
                LEARN
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              {streak > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#0f2347", padding: "4px 10px", borderRadius: 6, border: "1px solid #1e4080" }}>
                  <span style={{ fontSize: 14 }}>🔥</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fb923c" }}>{streak}</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                {badges.map(b => (
                  <div key={b.at} className={animateBadge ? "badge-pop" : ""} title={b.label} style={{
                    width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "linear-gradient(135deg,#1e40af,#0ea5e9)", borderRadius: 6, fontSize: 14, cursor: "default",
                  }}>{b.icon}</div>
                ))}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>
                  {completedLevels.size}/{LEVELS.length} complete
                </div>
                <div style={{ width: 120, height: 4, background: "#0f2347", borderRadius: 4, overflow: "hidden" }}>
                  <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>

        {/* Left sidebar: level navigator */}
        <aside>
          <div style={{ background: "rgba(5,13,26,0.8)", border: "1px solid #1e3a6e", borderRadius: 12, padding: 16, position: "sticky", top: 76 }}>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.1em", marginBottom: 12 }}>
              CURRICULUM
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {LEVELS.map((lvl, idx) => {
                const done = completedLevels.has(lvl.id);
                const active = idx === currentLevel;
                return (
                  <button key={lvl.id} onClick={() => handleLevelChange(idx)} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    background: active ? "rgba(37,99,235,0.2)" : "transparent",
                    border: active ? "1px solid #2563eb" : "1px solid transparent",
                    borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    color: done ? "#38bdf8" : active ? "#93c5fd" : "#475569",
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 5, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? "rgba(56,189,248,0.15)" : active ? "rgba(37,99,235,0.25)" : "rgba(15,32,71,0.8)",
                      border: `1px solid ${done ? "#0ea5e9" : active ? "#2563eb" : "#1e3a6e"}`,
                      fontSize: 10, fontWeight: 700, color: done ? "#38bdf8" : active ? "#93c5fd" : "#475569",
                    }}>
                      {done ? "✓" : lvl.id}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "inherit" }}>
                        {lvl.title}
                      </div>
                      <div style={{ fontSize: 10, color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {lvl.topic}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Badges section */}
            {badges.length > 0 && (
              <div style={{ marginTop: 20, borderTop: "1px solid #1e3a6e", paddingTop: 16 }}>
                <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 11, fontWeight: 600, color: "#64748b", letterSpacing: "0.1em", marginBottom: 10 }}>
                  ACHIEVEMENTS
                </div>
                {badges.map(b => (
                  <div key={b.at} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{b.icon}</span>
                    <span style={{ fontSize: 12, color: "#93c5fd" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <div style={{ minWidth: 0 }}>
          {/* Level header */}
          <div style={{ background: "rgba(5,13,26,0.8)", border: "1px solid #1e3a6e", borderRadius: 12, padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", background: "rgba(37,99,235,0.15)", padding: "3px 10px", borderRadius: 4, border: "1px solid rgba(37,99,235,0.3)", letterSpacing: "0.05em" }}>
                    LEVEL {level.id}
                  </span>
                  <span style={{ fontSize: 11, color: "#64748b", background: "#0f1e35", padding: "3px 10px", borderRadius: 4, border: "1px solid #1e3a6e" }}>
                    {level.topic}
                  </span>
                  {completedLevels.has(level.id) && (
                    <span style={{ fontSize: 11, color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "3px 10px", borderRadius: 4, border: "1px solid rgba(56,189,248,0.3)" }}>
                      ✓ Complete
                    </span>
                  )}
                </div>
                <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 600, color: "#e2e8f0", letterSpacing: "-0.02em" }}>
                  {level.title}
                </h1>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 12 }}>
              {level.description}
            </p>
            <div style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, padding: "12px 16px" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.05em" }}>TASK  </span>
              <span style={{ fontSize: 13, color: "#bfdbfe" }}>{level.task}</span>
            </div>
          </div>

          {/* Code editor */}
          <div style={{ background: "rgba(5,13,26,0.8)", border: "1px solid #1e3a6e", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #1e3a6e", background: "rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
                ))}
                <span style={{ marginLeft: 8, fontSize: 11, color: "#475569" }}>main.c</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#475569" }}>Expected: </span>
                <code style={{ fontSize: 11, color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "1px 8px", borderRadius: 4 }}>
                  {level.expectedOutput}
                </code>
              </div>
            </div>
            <div style={{ padding: 16 }}>
              <textarea
                className="code-area"
                value={userCode}
                onChange={e => setUserCode(e.target.value)}
                spellCheck={false}
                rows={Math.max(12, userCode.split('\n').length + 2)}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderTop: "1px solid #1e3a6e", background: "rgba(0,0,0,0.2)", flexWrap: "wrap" }}>
              <button className={`btn btn-primary pulse`} onClick={handleSubmit}>
                ▶ Run &amp; Check
              </button>
              <button className="btn btn-ghost" onClick={() => setShowHint(!showHint)}>
                {showHint ? "Hide Hint" : "💡 Hint"}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowSolution(!showSolution)}>
                {showSolution ? "Hide Solution" : "⟨/⟩ Solution"}
              </button>
              <button className="btn btn-danger" onClick={handleReset}>
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Hint */}
          {showHint && (
            <div className="slide-in" style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.25)", borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#eab308", letterSpacing: "0.05em", marginBottom: 6 }}>HINT</div>
              <p style={{ fontSize: 13, color: "#fde68a", fontFamily: "'JetBrains Mono',monospace" }}>{level.hint}</p>
            </div>
          )}

          {/* Solution */}
          {showSolution && (
            <div className="slide-in" style={{ background: "rgba(5,13,26,0.8)", border: "1px solid #334155", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ padding: "10px 16px", background: "rgba(0,0,0,0.3)", borderBottom: "1px solid #1e3a6e", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.05em" }}>
                SOLUTION
              </div>
              <pre style={{ padding: 16, margin: 0, fontSize: 12, color: "#93c5fd", overflowX: "auto", lineHeight: 1.7 }}>
                <code>{level.solution}</code>
              </pre>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className="slide-in" style={{
              background: feedback.type === "success" ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
              border: `1px solid ${feedback.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              borderRadius: 10, padding: "16px 20px", marginBottom: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: feedback.type === "error" ? 12 : 0 }}>
                <span style={{ fontSize: 18 }}>{feedback.type === "success" ? "✓" : "✗"}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: feedback.type === "success" ? "#4ade80" : "#f87171" }}>
                  {feedback.message}
                </span>
              </div>
              {feedback.type === "success" && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", letterSpacing: "0.05em", marginBottom: 6 }}>EXPLANATION</div>
                  <p style={{ fontSize: 13, color: "#86efac", lineHeight: 1.7 }}>{level.explanation}</p>
                  {currentLevel < LEVELS.length - 1 && (
                    <button className="btn btn-primary" onClick={() => handleLevelChange(currentLevel + 1)} style={{ marginTop: 12 }}>
                      Next Level →
                    </button>
                  )}
                  {currentLevel === LEVELS.length - 1 && completedLevels.size === LEVELS.length && (
                    <div style={{ marginTop: 12, fontSize: 14, color: "#38bdf8" }}>
                      🎉 You've completed all 15 levels! You're an Embedded C Pro!
                    </div>
                  )}
                </div>
              )}
              {feedback.type === "error" && (
                <div>
                  <p style={{ fontSize: 13, color: "#fca5a5", marginBottom: 10 }}>
                    Expected output: <code style={{ background: "rgba(239,68,68,0.15)", padding: "1px 8px", borderRadius: 4 }}>{level.expectedOutput}</code>
                  </p>
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>{level.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Progress stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 8 }}>
            {[
              { label: "Completed", value: completedLevels.size, total: LEVELS.length, color: "#38bdf8" },
              { label: "Current Streak", value: streak, suffix: " 🔥", color: "#fb923c" },
              { label: "Progress", value: Math.round(progress), suffix: "%", color: "#a78bfa" },
            ].map(stat => (
              <div key={stat.label} style={{ background: "rgba(5,13,26,0.8)", border: "1px solid #1e3a6e", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#475569", marginBottom: 4, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "0.05em" }}>
                  {stat.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>
                  {stat.value}{stat.suffix || ""}{stat.total ? <span style={{ fontSize: 14, color: "#475569" }}>/{stat.total}</span> : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}