# Altair Manual Part 3: OPERATION OF THE ALTAIR 8800

---

## $${\color{blue}The \space Front \space panel \space and \space swithces \space \space and \space LEDs}$$
### $${\color{red}Front \space Panel \space Switches}$$
**On-Off Switches**
- On is 1 (applies power)
- Off cuts off power and also erases memory


**Stop-Run Switches**
- Stop position stops program execution
- Run implements the program


**Single Step Switch**
- Only implements a single machine language instruction each time it is actuated


**Examine-Examine Next Switch**
- Examine position displays the contents of any specific memory address previously loaded in the DATA/ADDRESS Switches on the 8 data LEDs
- Examine Next toggles to the next sequential memory address
- Basically a history


**Deposit-Deposit Next Switch**
- Deposit poisition loads the data byte from the 8 DATA Switches to memory
- Deposit Next position laods the data byte in the 8 DATA Switches into the next sequential memory address


**Reset-CLR Switches**
- Reset sets the Program Counter to the first memory address (0 000 000 000 000 000).
- CLR is a clear command for external input/output equiptment


**Protect-Unprotect Switch**
- Protect prevents memory contents from being changes
- Unprotect allows memory to be altered


**AUX Switches**
- These switches will be used in conjunction with peripherals added to the basic machine


**Data/Address Switches**
- Data switches are those labeled 7-0 (binary)
- Address switches are those labeled 15-0 (hex)
- **Up = 1**
- Down = 0
- The Address switches designated 8-15 are not used and **should be set to 0 when and address is being entered**

<br>

### $${\color{red}Indicator \space LEDs}$$

|  LED  |  Definition  |
|-----|----------|
|  **ADDRESS**  |    Labeled A15-A0. The bit pattern shown denote the memory address being exmained or loaded with data     |
|  **DATA**  |    Labeled D7-D0. The bit pattern denotes the data in the specified memory address     |
|  **INTE**  |    An **Interrupt** has enabled when **LED is on**     |
|  **PROT**  |    The memory is **protected** when **LED is on**     |
|  **WAIT**  |    CPU is in **WAIT** state when **LED is on**     |
|  **HLDA**  |    A **hold** has been **acknowledged** when **LED is on**     |

### $${\color{red}Status \space LEDs}$$

|  LED  |  Definition  |
|-----|----------|
|  **MEMR**  |   The **memory** bus will be used for memory read data    |
|  **INP**  |   The address bus containing the address of an **input** device. The input data should be placed on the data bus when the bus is in input mode    |
|  **M1**  |   the CPU is processing the first machine cycle of instruction   |
|  **OUT**  |   The address contains the address of an **output** device and the data bus will contain the output data when the CPU is ready   |
| **HLTA** | A **halt** instruction had been executed and acknowledged |
| **STACK** | The address bus holds the **STACK POINTER's** push-down stack address|
| **WO** | Operation in the current machine cycle will be a **WRITE** memory or **OUTPUT** function. Otherwise a **READ** memory or **INPUT** operation will occur|
| **INT** | A **interupt** request has been acknowledged|

---

## $${\color{blue}Loading \space a \space Sample \space Program}$$
### $${\color{red}mnemonics}$$

<br>Each instruction is precise and specific. Each of the machine language instructions requires a single byte bit pattern aside from LDA and STA which require two additional bytes to provide teh necessary memory addresses.<br>

|  mnemonics  |  Bit Pattern  |  Explanation  |
|-----|----------|--------|
| **LDA**  |  00 111 010 10 000 000 00 000 000  | Load the accumulator with the contents of a specified memory address  |
| **MOV (A -> B)**  |  01 000 111  | Move the contents of the accumulator into register B  |
| **ADD (B + A)**  |  10 000 000  | Add the contents of register B to the contents of the accumulator and store the results in the accumulator  |
| **STA**  |  00 110 010 10 000 010 00 000 000  |Store the contents of the accumulator in a specified memory address  |
| **JMP**  |  11 000 011 00 000 000 00 000 000  | Jump to the first step in the program  |


| Step |  mnemonics  |  Bit Pattern  |  Octal  |
|------|-------------|---------------|---------|
|  0   | LDA         | 00 111 010    |  072    |
|  1   | (address)   | 10 000 000    |  200    |
|  2   | (address)   | 00 000 000    |  000    |
|  3   | MOV (A->B)  | 01 000 111    |  107    |
|  4   | LDA         | 00 111 010    |  072    |
|5|(address)|10 000 001|201|
|6|(address)|00 000 000|000|
|7|ADD (B+A)|10 000 000|200|
|8|STA|00 110 010|062|
|9|(address)|10 000 010|202|
|10|(address)|00 000 000|000|
etc


## $${\color{blue}Using \space The \space Memory}$$




## $${\color{blue}Vocab}$$
- **Data bus:** transfers data between a computer's memory and its CPU
- **mnemonics:** the study and development of systems for improving and assisting the memory.

