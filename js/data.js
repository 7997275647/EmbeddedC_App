/**
 * Course Data Module
 * Contains all lesson levels and their metadata
 */

const LEVELS = [
  {
    id: 1, title: "Hello, Embedded World",
    tag: "Basics", category: "basics",
    desc: "Every journey begins with a single output. In Embedded C, we often communicate through serial output or register writes. Let's start by printing a simple message.",
    concept: "The <code>printf</code> function outputs formatted text. In embedded systems, this typically maps to a UART serial interface. The <code>#include &lt;stdio.h&gt;</code> header provides this function.",
    task: "Write a complete C program that prints exactly: Hello, Embedded World!",
    hint: "Use <code>printf(\"Hello, Embedded World!\\n\");</code> inside your <code>main()</code> function. Don't forget to <code>#include &lt;stdio.h&gt;</code> at the top.",
    expected: `#include <stdio.h>
int main() {
    printf("Hello, Embedded World!\\n");
    return 0;
}`,
    validate: (code) => code.includes('printf') && code.includes("Hello, Embedded World!") && code.includes('main'),
    explanation: "Your program needs <code>#include &lt;stdio.h&gt;</code> for printf, a <code>main()</code> function as the entry point, and <code>printf(\"Hello, Embedded World!\\n\");</code> to produce the output.",
    badge: { emoji: "🌟", title: "First Boot!", sub: "Completed Level 1" }
  },
  {
    id: 2, title: "Bit Manipulation: Set a Bit",
    tag: "Bit Ops", category: "bits",
    desc: "In embedded systems, hardware registers are controlled by setting individual bits. This is fundamental to toggling LEDs, enabling peripherals, and configuring hardware.",
    concept: "The bitwise OR operator <code>|</code> sets specific bits without affecting others. To set bit N: <code>reg = reg | (1 &lt;&lt; N);</code>. This is also written as <code>reg |= (1 &lt;&lt; N);</code>.",
    task: "Declare an unsigned char variable 'reg' set to 0. Set bit 3 of 'reg' using bitwise OR, then print the result. Expected output: 8",
    hint: "Bit 3 has value 2³ = 8. Use: <code>unsigned char reg = 0; reg |= (1 &lt;&lt; 3); printf(\"%d\\n\", reg);</code>",
    expected: `#include <stdio.h>
int main() {
    unsigned char reg = 0;
    reg |= (1 << 3);
    printf("%d\\n", reg);
    return 0;
}`,
    validate: (code) => code.includes('|=') && code.includes('1 << 3') || code.includes('1<<3') && code.includes('printf'),
    explanation: "Setting bit 3 means OR-ing with <code>(1 &lt;&lt; 3)</code> which equals 8 in decimal. The output should be <code>8</code>.",
    badge: { emoji: "⚡", title: "Bit Wizard", sub: "Mastered bit setting" }
  },
  {
    id: 3, title: "Bit Manipulation: Clear a Bit",
    tag: "Bit Ops", category: "bits",
    desc: "Clearing a bit is equally important — turning off an LED, disabling an interrupt, or resetting a flag in a status register.",
    concept: "To clear bit N: use AND with the complement: <code>reg &amp;= ~(1 &lt;&lt; N);</code>. The <code>~</code> operator flips all bits, and <code>&amp;</code> masks out the target bit.",
    task: "Start with reg = 0xFF (all bits set). Clear bit 5, then print the result. Expected output: 223",
    hint: "0xFF = 255. Clearing bit 5 (value 32) gives 255 - 32 = 223. Use: <code>reg &amp;= ~(1 &lt;&lt; 5);</code>",
    expected: `#include <stdio.h>
int main() {
    unsigned char reg = 0xFF;
    reg &= ~(1 << 5);
    printf("%d\\n", reg);
    return 0;
}`,
    validate: (code) => code.includes('&=') && (code.includes('~(1 << 5)') || code.includes('~(1<<5)')) && code.includes('0xFF'),
    explanation: "0xFF = 255. Bit 5 = 32. After clearing: 255 - 32 = 223. The expression <code>~(1 &lt;&lt; 5)</code> creates a mask with all bits set except bit 5.",
    badge: { emoji: "🎯", title: "Bit Eraser", sub: "Mastered bit clearing" }
  },
  {
    id: 4, title: "Bit Manipulation: Toggle a Bit",
    tag: "Bit Ops", category: "bits",
    desc: "Toggling flips a bit's state — the foundation of blinking LEDs and toggle switches in embedded systems.",
    concept: "XOR operator <code>^</code> toggles bits: <code>reg ^= (1 &lt;&lt; N);</code>. XOR with 1 flips the bit; XOR with 0 leaves it unchanged.",
    task: "Start with reg = 0b00001010 (decimal 10). Toggle bit 1, then print the result. Expected output: 8",
    hint: "0b00001010 = 10. Bit 1 is set (value 2). Toggling clears it: 10 - 2 = 8. Use: <code>reg ^= (1 &lt;&lt; 1);</code>",
    expected: `#include <stdio.h>
int main() {
    unsigned char reg = 0b00001010;
    reg ^= (1 << 1);
    printf("%d\\n", reg);
    return 0;
}`,
    validate: (code) => code.includes('^=') && (code.includes('1 << 1') || code.includes('1<<1')) && code.includes('printf'),
    explanation: "0b00001010 = 10 decimal. Bit 1 = 2. XOR toggles it off: 10 XOR 2 = 8. Result is 8.",
    badge: { emoji: "🔄", title: "Toggle King", sub: "Mastered XOR toggling" }
  },
  {
    id: 5, title: "Check a Bit (Read Status)",
    tag: "Bit Ops", category: "bits",
    desc: "Before acting, embedded systems must check hardware status flags — is the UART buffer ready? Is a button pressed?",
    concept: "To check if bit N is set: <code>if (reg &amp; (1 &lt;&lt; N))</code>. This masks all other bits; the result is non-zero if the bit is set.",
    task: "Create reg = 0b00110100. Check if bit 2 is set. Print 'Bit is SET' if true, 'Bit is CLEAR' if false.",
    hint: "0b00110100 = 52. Bit 2 = 4. 52 & 4 = 4 (non-zero = true). Use <code>if (reg &amp; (1 &lt;&lt; 2))</code>.",
    expected: `#include <stdio.h>
int main() {
    unsigned char reg = 0b00110100;
    if (reg & (1 << 2)) {
        printf("Bit is SET\\n");
    } else {
        printf("Bit is CLEAR\\n");
    }
    return 0;
}`,
    validate: (code) => code.includes('& (1 << 2)') || code.includes('&(1<<2)') || code.includes('& (1<<2)'),
    explanation: "0b00110100 = 52. Bit 2 has value 4. 52 & 4 = 4 (non-zero), so the condition is true and we print 'Bit is SET'.",
    badge: { emoji: "🔍", title: "Status Reader", sub: "Mastered bit checking" }
  },
  {
    id: 6, title: "Variables & Data Types",
    tag: "Fundamentals", category: "basics",
    desc: "Embedded C programmers carefully choose data types to match hardware register widths and conserve precious RAM.",
    concept: "Common embedded types: <code>uint8_t</code> (1 byte), <code>uint16_t</code> (2 bytes), <code>uint32_t</code> (4 bytes) from <code>&lt;stdint.h&gt;</code>. These have guaranteed sizes unlike <code>int</code>.",
    task: "Using stdint.h types, declare a uint8_t with value 255, uint16_t with value 1000, and uint32_t with value 100000. Print all three on separate lines.",
    hint: "Include <code>&lt;stdint.h&gt;</code> and use format specifiers: <code>%u</code> for uint8_t/uint16_t, <code>%lu</code> for uint32_t.",
    expected: `#include <stdio.h>
#include <stdint.h>
int main() {
    uint8_t a = 255;
    uint16_t b = 1000;
    uint32_t c = 100000;
    printf("%u\\n", a);
    printf("%u\\n", b);
    printf("%lu\\n", c);
    return 0;
}`,
    validate: (code) => code.includes('uint8_t') && code.includes('uint16_t') && code.includes('uint32_t') && code.includes('stdint.h'),
    explanation: "Always use fixed-width types from <code>&lt;stdint.h&gt;</code> in embedded code. <code>uint8_t</code> is always 8 bits, <code>uint16_t</code> always 16 bits, <code>uint32_t</code> always 32 bits.",
    badge: { emoji: "📦", title: "Type Safe", sub: "Mastered fixed-width types" }
  },
  {
    id: 7, title: "Control Flow: if/else",
    tag: "Control", category: "control",
    desc: "Conditional logic drives embedded behavior — if temperature exceeds threshold, activate fan; else keep idle.",
    concept: "Standard C <code>if/else</code> works identically in embedded C. However, be cautious of floating-point comparisons and ensure conditions avoid undefined behavior.",
    task: "Read an integer variable 'temp' set to 85. If temp >= 80, print 'OVERHEAT WARNING'. If temp >= 60, print 'WARM'. Otherwise print 'NORMAL'.",
    hint: "Use chained if/else if/else. Check the highest threshold first (>=80), then middle (>=60), then the else case.",
    expected: `#include <stdio.h>
int main() {
    int temp = 85;
    if (temp >= 80) {
        printf("OVERHEAT WARNING\\n");
    } else if (temp >= 60) {
        printf("WARM\\n");
    } else {
        printf("NORMAL\\n");
    }
    return 0;
}`,
    validate: (code) => code.includes('temp') && code.includes('>= 80') && code.includes('OVERHEAT WARNING') && code.includes('else'),
    explanation: "With temp = 85, the first condition <code>temp >= 80</code> is true, so 'OVERHEAT WARNING' is printed. The else-if and else branches are skipped.",
    badge: { emoji: "🌡️", title: "Decision Maker", sub: "Mastered conditionals" }
  },
  {
    id: 8, title: "Loops: for Loop Basics",
    tag: "Control", category: "control",
    desc: "Loops are essential in embedded programming — scanning ADC channels, initializing memory buffers, or polling registers.",
    concept: "A <code>for</code> loop: <code>for (init; condition; update)</code>. In embedded systems, loops often scan hardware registers or iterate over fixed-size arrays.",
    task: "Use a for loop to print the squares of numbers 1 through 5, one per line. Output: 1, 4, 9, 16, 25",
    hint: "Use <code>for (int i = 1; i &lt;= 5; i++)</code> and print <code>i * i</code> in each iteration.",
    expected: `#include <stdio.h>
int main() {
    for (int i = 1; i <= 5; i++) {
        printf("%d\\n", i * i);
    }
    return 0;
}`,
    validate: (code) => code.includes('for') && code.includes('i * i') || code.includes('i*i'),
    explanation: "The loop runs from i=1 to i=5. Each iteration prints i*i: 1, 4, 9, 16, 25.",
    badge: { emoji: "🔁", title: "Loop Master", sub: "Mastered for loops" }
  },
  {
    id: 9, title: "Arrays & Memory Buffers",
    tag: "Arrays", category: "arrays",
    desc: "Arrays are memory buffers — they hold ADC readings, UART receive buffers, lookup tables, and sensor data in embedded systems.",
    concept: "An array is a contiguous block of memory: <code>uint8_t buffer[8];</code>. Access elements with index: <code>buffer[0]</code> through <code>buffer[7]</code>. Index starts at 0.",
    task: "Declare an integer array of 5 sensor readings: {23, 45, 12, 67, 34}. Find and print the maximum value. Expected output: 67",
    hint: "Initialize max to arr[0], then loop through arr[1] to arr[4], updating max if arr[i] > max.",
    expected: `#include <stdio.h>
int main() {
    int sensors[5] = {23, 45, 12, 67, 34};
    int max = sensors[0];
    for (int i = 1; i < 5; i++) {
        if (sensors[i] > max) max = sensors[i];
    }
    printf("%d\\n", max);
    return 0;
}`,
    validate: (code) => code.includes('{23') && code.includes('67') && (code.includes('max') || code.includes('MAX')),
    explanation: "Iterate through the array tracking the maximum value seen. Starting with 23, we update max at 45, then 67 (final max). Output: 67.",
    badge: { emoji: "📊", title: "Buffer Boss", sub: "Mastered arrays" }
  },
  {
    id: 10, title: "Functions: Modular Code",
    tag: "Functions", category: "functions",
    desc: "Embedded firmware is organized into functions for readability and reuse — ISR handlers, initialization routines, and drivers.",
    concept: "Functions in C: <code>return_type function_name(parameters) { body }</code>. Functions can return values and accept arguments. Prototype declarations precede main if needed.",
    task: "Write a function 'clamp(int val, int min, int max)' that returns val clamped between min and max. Test: clamp(150, 0, 100) → print 100",
    hint: "If val < min return min; if val > max return max; else return val. Call with clamp(150, 0, 100) and print the result.",
    expected: `#include <stdio.h>
int clamp(int val, int min, int max) {
    if (val < min) return min;
    if (val > max) return max;
    return val;
}
int main() {
    printf("%d\\n", clamp(150, 0, 100));
    return 0;
}`,
    validate: (code) => code.includes('clamp') && code.includes('150') && code.includes('return') && code.includes('min') && code.includes('max'),
    explanation: "The clamp function limits val to [min, max]. With clamp(150, 0, 100): 150 > 100, so it returns 100.",
    badge: { emoji: "🧩", title: "Function Factory", sub: "Mastered functions" }
  },
  {
    id: 11, title: "Pointers: Memory Addresses",
    tag: "Pointers", category: "pointers",
    desc: "Pointers are the heart of embedded C — hardware registers ARE memory addresses. Memory-mapped I/O means writing to a pointer IS controlling hardware.",
    concept: "A pointer stores a memory address: <code>int *ptr = &amp;var;</code>. Dereference with <code>*ptr</code> to read/write the value. In embedded: <code>volatile uint32_t *GPIO = (uint32_t*)0x40020000;</code>",
    task: "Declare int x = 42. Create a pointer to x. Through the pointer, change x to 100. Print x (not *ptr). Expected: 100",
    hint: "Use <code>int *ptr = &amp;x;</code> then <code>*ptr = 100;</code>. Now x itself is changed. Print with <code>printf(\"%d\\n\", x);</code>",
    expected: `#include <stdio.h>
int main() {
    int x = 42;
    int *ptr = &x;
    *ptr = 100;
    printf("%d\\n", x);
    return 0;
}`,
    validate: (code) => code.includes('*ptr') && code.includes('&x') && code.includes('100') && code.includes('printf'),
    explanation: "ptr holds the address of x. Writing <code>*ptr = 100</code> modifies the value at that address — which IS x. So printing x gives 100.",
    badge: { emoji: "👉", title: "Pointer Pro", sub: "Mastered pointers" }
  },
  {
    id: 12, title: "Structs: Grouping Hardware Data",
    tag: "Structs", category: "structs",
    desc: "Structs model hardware registers and sensor data. A struct can represent a GPIO port configuration or a CAN message frame.",
    concept: "A struct groups related data: <code>struct Sensor { uint8_t id; int16_t value; uint8_t status; };</code>. Access with dot notation: <code>s.value</code> or via pointer: <code>s-&gt;value</code>.",
    task: "Define a struct 'Sensor' with fields: id (int), value (int), active (int). Create one with id=1, value=250, active=1. Print: Sensor 1: 250 [ACTIVE]",
    hint: "Define the struct before main. Create: <code>struct Sensor s = {1, 250, 1};</code>. Print using s.id, s.value, and a ternary/if for status.",
    expected: `#include <stdio.h>
struct Sensor {
    int id;
    int value;
    int active;
};
int main() {
    struct Sensor s = {1, 250, 1};
    printf("Sensor %d: %d [%s]\\n", s.id, s.value, s.active ? "ACTIVE" : "INACTIVE");
    return 0;
}`,
    validate: (code) => code.includes('struct') && code.includes('id') && code.includes('value') && code.includes('active') && code.includes('Sensor'),
    explanation: "Structs bundle related fields together. We access fields with dot notation and use a ternary operator to print ACTIVE/INACTIVE based on the active flag.",
    badge: { emoji: "🏗️", title: "Data Architect", sub: "Mastered structs" }
  },
  {
    id: 13, title: "Volatile Keyword",
    tag: "Advanced", category: "advanced",
    desc: "The 'volatile' keyword is critical in embedded C — it prevents compiler optimizations that would break hardware register access and interrupt handlers.",
    concept: "<code>volatile</code> tells the compiler: 'this variable may change outside program control'. Without it, the compiler might cache register reads in CPU registers, missing hardware updates.",
    task: "Declare a volatile unsigned int 'status_reg' = 0xAB. Print its value in hex. Then set bit 4 using a volatile pointer approach. Print again. Output: ab, then bb",
    hint: "Use <code>volatile unsigned int status_reg = 0xAB;</code>, print with <code>%x</code>. Set bit 4: <code>status_reg |= (1 &lt;&lt; 4);</code> (adds 0x10). Print again.",
    expected: `#include <stdio.h>
int main() {
    volatile unsigned int status_reg = 0xAB;
    printf("%x\\n", status_reg);
    status_reg |= (1 << 4);
    printf("%x\\n", status_reg);
    return 0;
}`,
    validate: (code) => code.includes('volatile') && code.includes('0xAB') && code.includes('%x'),
    explanation: "0xAB = 10101011. Setting bit 4 (0x10 = 00010000): 10101011 | 00010000 = 10111011 = 0xBB. volatile ensures the compiler always reads/writes memory.",
    badge: { emoji: "⚠️", title: "Volatile Veteran", sub: "Mastered volatile" }
  },
  {
    id: 14, title: "Enums & #define Constants",
    tag: "Advanced", category: "advanced",
    desc: "Named constants improve firmware readability. Instead of magic numbers, use enums or #defines to represent hardware states, pin numbers, and modes.",
    concept: "<code>#define LED_PIN 5</code> creates a preprocessor constant. <code>enum State { IDLE, RUNNING, ERROR };</code> creates named integer constants. Both eliminate magic numbers.",
    task: "Define an enum with states: IDLE=0, RUNNING=1, ERROR=2. Create variable 'state' set to RUNNING. Print: State: 1 (RUNNING)",
    hint: "Use <code>enum State { IDLE=0, RUNNING=1, ERROR=2 };</code>. Then <code>enum State state = RUNNING;</code> and print state value with the name.",
    expected: `#include <stdio.h>
enum State { IDLE=0, RUNNING=1, ERROR=2 };
int main() {
    enum State state = RUNNING;
    printf("State: %d (RUNNING)\\n", state);
    return 0;
}`,
    validate: (code) => code.includes('enum') && code.includes('RUNNING') && code.includes('IDLE') && code.includes('ERROR'),
    explanation: "Enums map names to integers. RUNNING = 1, so printing <code>state</code> gives 1. This is far more readable than 'state = 1' scattered through code.",
    badge: { emoji: "📋", title: "Constants Guru", sub: "Mastered enums" }
  },
  {
    id: 15, title: "Memory: Stack vs Heap Awareness",
    tag: "Advanced", category: "advanced",
    desc: "Embedded systems often have kilobytes of RAM. Understanding stack allocation, avoiding dynamic allocation, and using static variables is crucial for reliable firmware.",
    concept: "Local variables live on the stack (fast, auto-freed). <code>static</code> local vars persist between calls. In embedded systems, avoid malloc/free — prefer static allocation to prevent heap fragmentation.",
    task: "Write a function 'counter()' using a static local variable that increments each call. Call it 5 times and print each result: 1, 2, 3, 4, 5",
    hint: "Inside counter(): <code>static int count = 0; count++; return count;</code>. The static variable retains its value between calls.",
    expected: `#include <stdio.h>
int counter() {
    static int count = 0;
    count++;
    return count;
}
int main() {
    for (int i = 0; i < 5; i++) {
        printf("%d\\n", counter());
    }
    return 0;
}`,
    validate: (code) => code.includes('static') && code.includes('count') && code.includes('counter') && code.includes('for'),
    explanation: "A static local variable is initialized once and persists between function calls. Each call to counter() increments count from 1 to 5. This is a common pattern for event counting in ISRs.",
    badge: { emoji: "🧠", title: "Memory Master", sub: "Completed all 15 levels!" }
  }
];
