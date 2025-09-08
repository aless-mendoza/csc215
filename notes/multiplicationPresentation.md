# Adding 3 Numbers

| Step |  mnemonics  |  Bit Pattern  |  Hex   | Explanation |
|------|-------------|---------------|--------|-------------|
|  0   | LDA B       | 00 111 010    |  3A    | Initiating Variable B in the A register |
|  1   | (address)   | 10 000 000    |  30    | Showing where to pull the data from (where does B get defined) |
|  2   | (address)   | 00 000 000    |  00    | Whole address is 0030 |
|  3   | MOV (A->B)  | 01 000 111    |  47    | Move the information into register B |
|  4   | LDA C       | 00 111 010    |  3A    | Initiating Variable C in the A register |
|  5   | (address)   | 10 000 001    |  40    | Showing where to pull the data from (where does C get defined) |
|  6   | (address)   | 00 000 000    |  00    | Whole address is 0040 |
|  7   | MOV (A->C)  | 01 000 111    |  4f    | Move the information into register C |
|  8   | LDA A       | 00 111 010    |  3A    | Initiating Variable A in the A register |
|  9   | (address)   | 10 000 001    |  20    | Showing where to pull the data from (where does A get defined) |
|  10  | (address)   | 00 000 000    |  00    | Whole address is 0020 |
|  11  | ADD (B+A)   | 10 000 000    |  80    | Adding values from register A and B |
|  12  | ADD (above+C)|10 000 001    |  81    | Adding the value above and register C |
|  13  | STA         | 00 110 010    |  32    | Storing the content in the accumulator |
|  14  | (address)   | 10 000 010    |  50    | Where is the output |
|  15  | (address)   | 00 000 000    |  00    | Whole address is 0050 |
|  16  | JMP         | 11 000 011    |  76    | Jump to first step in program |

## Instructions
1. Write in instructions above
2. Assign a value to register A (location 0020)
    1. Use the switches to input hex 20
    2. Toggle examine
    3. Use the switches to input your value
    4. Toggle deposit
3. Assign a value to register B (location 0030)
4. Assign a value to register C (location 0040)
5. Toggle reset
6. Toggle run
7. Toggle stop
8. See output in location 0050

