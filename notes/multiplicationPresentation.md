# Adding 3 Numbers

| Step |  mnemonics  |  Bit Pattern  |  Hex   | Explanation |
|------|-------------|---------------|--------|-------------|
|  0   | LDA B       | 00 111 010    |  3A    | (multiplicand) Initiating Variable B in the A register |
|  1   | (address)   | 10 000 000    |  30    | Showing where to pull the data from (where does B get defined) |
|  2   | (address)   | 00 000 000    |  00    | Whole address is 0030 |
|  0   | LDA E       | 00 111 010    |  3A    | Initiating Variable E in the A register (equal to B)|
|  1   | (address)   | 10 000 000    |  30    | Showing where to pull the data from (where does B get defined) |
|  2   | (address)   | 00 000 000    |  00    | Whole address is 0030 |
|  3   | MOV (A->E)  | 01 000 111    |  47    | Move the information into register D |
|  3   | MOV (A->B)  | 01 000 111    |  47    | Move the information into register B |
|  4   | LDA C       | 00 111 010    |  3A    | Initiating Variable C in the A register |
|  5   | (address)   | 10 000 001    |  40    | Showing where to pull the data from (where does C get defined) |
|  6   | (address)   | 00 000 000    |  00    | Whole address is 0040 |
|  7   | MOV (A->C)  | 01 000 111    |  4f    | Move the information into register C |
|  0   | LDA D       | 00 111 010    |  3A    | (mulitplicator) Initiating Variable D in the A register |
|  1   | (address)   | 10 000 000    |  50    | Showing where to pull the data from (where does B get defined) |
|  2   | (address)   | 00 000 000    |  00    | Whole address is 0050 |
|  3   | MOV (A->D)  | 01 000 111    |  47    | Move the information into register D |
|  3   | MOV (A->A)  | 01 000 111    |  47    | **Loop starts here** |
|  3   | SUB (D-C)   | 01 000 111    |  47    | Subtracting D from C (c = 1). This is how we decrement |
|  3   | JZ          | 01 000 111    |  47    | If the result is zero, jump away (to a halt) |
|  5   | (address)   | 10 000 001    |  40    | Showing where the HLT is |
|  6   | (address)   | 00 000 000    |  00    | Whole address is 1C in the memory |
|  3   | MOV (A->D)  | 01 000 111    |  47    |  |
|  3   | MOV (E->A)  | 01 000 111    |  47    |  |
|  3   | ADD (A+B)   | 01 000 111    |  47    |  |
|  3   | MOV (A->E)  | 01 000 111    |  47    |  |
|  3   | JMP         | 01 000 111    |  47    | Restart Loop |
|  5   | (address)   | 10 000 001    |  40    |  |
|  6   | (address)   | 00 000 000    |  00    | |
|  6   | HLT         | 00 000 000    |  00    | |

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

