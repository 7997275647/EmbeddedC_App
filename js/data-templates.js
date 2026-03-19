/**
 * Template generator for all levels
 * Provides starter code for each level (not the solution)
 */

const LEVEL_TEMPLATES = {
  1: `#include <stdio.h>

int main() {
    // Write your code here

    return 0;
}`,
  
  2: `#include <stdio.h>

int main() {
    unsigned char reg = 0;
    // Your code here

    return 0;
}`,
  
  3: `#include <stdio.h>

int main() {
    unsigned char reg = 0xFF;
    // Your code here

    return 0;
}`,
  
  4: `#include <stdio.h>

int main() {
    unsigned char reg = 0b00001010;
    // Your code here

    return 0;
}`,
  
  5: `#include <stdio.h>

int main() {
    unsigned char reg = 0b00110100;
    // Write your if/else here

    return 0;
}`,
  
  6: `#include <stdio.h>
#include <stdint.h>

int main() {
    // Declare your variables here

    return 0;
}`,
  
  7: `#include <stdio.h>

int main() {
    int temp = 85;
    // Write your if/else logic here

    return 0;
}`,
  
  8: `#include <stdio.h>

int main() {
    // Write your for loop here

    return 0;
}`,
  
  9: `#include <stdio.h>

int main() {
    int sensors[5] = {23, 45, 12, 67, 34};
    // Find and print the maximum here

    return 0;
}`,
  
  10: `#include <stdio.h>

// Write your clamp function here

int main() {
    // Test your function

    return 0;
}`,
  
  11: `#include <stdio.h>

int main() {
    int x = 42;
    // Work with pointers here

    return 0;
}`,
  
  12: `#include <stdio.h>

struct Sensor {
    // Define your fields here
};

int main() {
    // Create and print your struct

    return 0;
}`,
  
  13: `#include <stdio.h>

int main() {
    volatile unsigned int status_reg = 0xAB;
    // Your code here

    return 0;
}`,
  
  14: `#include <stdio.h>

// Define your enum here

int main() {
    // Create and use your enum

    return 0;
}`,
  
  15: `#include <stdio.h>

int counter() {
    // Implement your counter function

}

int main() {
    // Call your function 5 times

    return 0;
}`
};

/**
 * Get template for a level by ID
 */
function getTemplateFoLevel(levelId) {
  return LEVEL_TEMPLATES[levelId] || `#include <stdio.h>

int main() {
    // Your code here

    return 0;
}`;
}
