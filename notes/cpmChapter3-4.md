# Notes on CP/M (Chapters 3–4)

---

## Chapter 3: The CP/M-Based Computer

### Logical Names and Physical Entities
- CP/M distinguishes between **logical device names** (software identifiers) and **physical devices** (actual hardware).
- Example:
    - **CRT:** → Physical video display terminal + keyboard.
    - **CON:** → Logical device for the operator's console (mapped to CRT:).
- Other physical devices in the minimal system:
    - **LPT:** Line printer.
    - Disk drives 0 and 1 (mapped logically to **A:** and **B:**).
- Logical and physical device mapping:
    - Disk drives: one-to-one mapping.
    - I/O devices: multiple physical devices may map to one logical name.

### Input/Output Device Mapping (IOBYT)
- CP/M uses the **IOBYT** byte to select physical devices for each logical device.
- Logical devices:
    - **CON:** Console (bi-directional).
    - **LST:** List device (printer, from LPT:).
    - **RDR:** Reader device (input source, e.g., card reader, tape reader, modem Rx).
    - **PUN:** Punch device (output, e.g., tape punch, modem Tx).
- Each logical device can map to one of four possible physical devices.
- Selection can be done:
    - By operator through CON: interface.
    - By programs, dynamically.

---

## Chapter 4: The CP/M Operating System

### What the Operating System Provides
- Hardware services are straightforward; software services (OS functions) are less visible.
- CP/M mediates access between programs and hardware.
- Users interact with CP/M through **built-in commands** and **transient commands**.
- Functions include:
    - File management.
    - Device access.
    - Editing and command execution.

### Named File Handling
- Files are named using the format: **FILENAME.TYP**
    - Up to 8 characters for name.
    - 3 characters for type.
- Standard file types:
    - `.COM` → Binary command program.
    - `.ASM` → Assembly source.
    - `.HEX` → Assembler output (hexadecimal).
    - `.PRN` → Assembler listing (print).
    - `.BAK` → Backup file.
    - `.SUB` → Submit command file.
    - `.BAS` → BASIC program.
    - `.DAT` → Data file.
- Users can also define custom file types.
- Example command:
    - `SAVE 0 B:-WORK.001` → Creates empty file as disk label.

### Wildcards in File Names
- `*` → Matches any sequence of characters.
- `?` → Matches any single character.
- Examples:
    - `DIR *.COM` → Lists all files of type `.COM`.
    - `DIR L*.ASM` → Lists all assembly files beginning with L.
    - `PIP B:=A:*.*` → Copies all files from A: to B:.

### Logical Unit Access
- Logical units provide simplified access to physical devices.
- Example:
    - `PIP PUN:=FILENAME.TYP` → Sends file to the device mapped as PUN:.
- Both operator and programs can reassign logical devices.

### Line Editing
- CP/M supports basic line editing at the console.
- Editing commands:
    - `DEL` / `BS` / `RUBOUT` → Delete last character.
    - `CTRL R` → Re-display the current command line.
    - `CTRL U` or `CTRL X` → Cancel entire line and restart.
- These controls are available both to operators and to user programs.

---

# Acronyms and Meanings

- **CP/M** → Control Program for Microcomputers 
- **CRT** → Cathode Ray Tube (terminal display) 
- **CON:** → Console logical device (operator’s terminal) 
- **LPT:** → Line Printer (physical) 
- **LST:** → Logical List Device (mapped to LPT:) 
- **RDR:** → Reader device (input source) 
- **PUN:** → Punch device (output) 
- **PTR:** → Paper Tape Reader (older physical input) 
- **PTP:** → Paper Tape Punch (older physical output) 
- **Rx** → Receive (signal input from modem) 
- **Tx** → Transmit (signal output from modem) 
- **IOBYT** → Input/Output Byte (CP/M device selector) 
- **CBIOS** → Customized Basic Input Output System 
- **BDOS** → Basic Disk Operating System 
- **PROM** → Programmable Read-Only Memory 
- **DIR** → Directory command (lists files on a disk) 
- **PIP** → Peripheral Interchange Program (file copy utility) 
- **CTRL** → Control key on keyboard 

## Jake

### Chapter 3

#### Ports - logical devices
- logical devices (ports)
    - CON: - terminal (monitor and keyboard)
    - LST: - list device (line printer)
    - RDR: - general input
    - PUN: - general output
    - A: / B: / C: / etc - Disk drive
- Each port can have 4 decives hooked up & can be toggled with a byte (IOBYT)
- If a physical device has an input and an output in needs to be hooked up to the general input & output
- The only bidirectional port in CON:

#### Physical Devices
- Devices
    - CRT: - old kind of monitor
    - LPT: - Line printer
    - PTR: - Paper Tape Reader
    - PTP: - Paper Tape Punch

### Chapter 4

#### Files
- A file in a computer is like one in a file cabinet. It can contain just about any sort of information, right or wrong, and the contents of a file can be identified by a label.
- Files can have a max of 8 characters for name and 3 characters for file extensions
    - file extension is the .whatever (.png, .pdf)
- DIR does same thing as ls
- .asm - assembly source program
    - like .py - where code is
- .com - the executable
    - you can just run it and it do things

#### Stuff and wild cards
- Name your disk responsibly 
- and * is a wild card
    - it fills in the blank
    - DIR \*.com gives every file with .com extension
- PIP - how you write things to the logical devices
    - how you send things
- PIP B:=A:\*.\*
    - copies everything from A into B

#### Line editing
- sometimes when you hit the delete or backslash key, it doesn't always delete, it just repeats the key to signify that it was deleted (does get deleted but doesn't display that way)
- CTRL + R - view command line
- CTRL + U/X - same as CTRL + C (resets line, aborts your entry)
