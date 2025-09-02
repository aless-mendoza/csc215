# Altair Manual Part 3: OPERATION OF THE ALTAIR 8800

---

## $${\color{blue}The Front panel and swithces and LEDs}$$
### $${\color{red}Front Panel Switches}$$
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

### $${\color{red}Indicator LEDs}$$

|  LED  |  Definition  |
|-----|----------|
|  **ADDRESS**  |    Labeled A15-A0. The bit pattern shown denote the memory address being exmained or loaded with data     |
|  **DATA**  |    Labeled D7-D0. The bit pattern denotes the data in the specified memory address     |
|  **INTE**  |    An **Interrupt** has enabled when **LED is on**     |
|  **PROT**  |    The memory is **protected** when **LED is on**     |
|  **WAIT**  |    CPU is in **WAIT** state when **LED is on**     |
|  **HLDA**  |    A **hold** has been **acknowledged** when **LED is on**     |

### $${\color{red}Status LEDs}$$

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

## $${\color{blue}Loading a Sample Program}$$




## $${\color{blue}Vocab}$$
- **Data bus:** transfers data between a computer's memory and its CPU
- **mnemonics:** the study and development of systems for improving and assisting the memory.

