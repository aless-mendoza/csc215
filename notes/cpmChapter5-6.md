# Chapter 5

## 1. Overview of CP/M
CP/M (Control Program for Microcomputers) separates **user programs**, **system software**, and **hardware** into layers.

- **User programs** never access hardware directly.
- They make service calls to **BDOS**, which handles disk and file management.
- **BDOS** communicates with **CBIOS**, which contains hardware-specific routines for input/output.
- Only CBIOS needs to be changed when porting CP/M to a new machine.

---

## 2. Disk and I/O Access Primitives
At power-on, a **loader program** in **PROM** runs automatically.  
It positions the disk head, reads the first sectors of the operating system, and loads CP/M into **RAM**.

These routines form the “primitive” hardware-level operations used later by the system for disk access.

---

## 3. Cold Start vs. Warm Start

### Cold Start (**BOOT**)
- Occurs at **power-up or reset**.  
- The PROM loader loads CP/M from disk.  
- Clears the **IOBYT** (device map) and **DRIVE** variables.  
- Initializes system vectors.  
- Displays the CP/M sign-on message.  
- Passes control to **CCP** to await user commands.

### Warm Start (**WBOOT**)
- Occurs when restarting CP/M without powering off (e.g., pressing **CTRL+C**).  
- Reloads the OS into memory.  
- **Preserves** the current drive and device mappings.  
- Rewrites vectors and returns to **CCP**.

➡️ *Cold start = full initialization*  
➡️ *Warm start = quick reload preserving settings*

---

## 4. CBIOS (Customized Basic Input/Output System)
The **CBIOS** manages communication between CP/M and physical devices.  
It contains jump vectors pointing to hardware-specific routines.

### Standard CBIOS Vectors
- `BOOT` / `WBOOT` – system startup
- `CONST` – test console input ready  
- `CONIN` / `CONOUT` – console read/write  
- `READ` / `WRITE` – disk read/write  
- `SELDSK`, `SETTRK`, `SETSEC`, etc. – disk control

Only these routines need rewriting when adapting CP/M to new hardware.

---

## 5. BDOS (Basic Disk Operating System)
BDOS acts as the interface between user software and CBIOS.

### Storage Units
- **Record** = 128 bytes  
- **Block** = 256 bytes (2 records)  
- **Group** = 1 KB (8 records)  

Minimum disk allocation = 1 KB per file.

### BDOS Responsibilities
- Search directories and locate files via **File Control Blocks (FCBs)**.  
- Manage **dynamic disk space allocation** (reuse space after file deletion).  
- Display error messages and allow limited recovery.  
- Handle disk reads/writes and sector addressing through CBIOS.

Common error messages:
- `BDOS ERR ON B: BAD SECTOR` – unreadable disk sector  
- `BDOS ERR ON R: SELECT` – invalid drive access  
- `BDOS ERR ON R/O` – attempting to write to write-protected disk

---

## 6. IOBYT (Input/Output Byte)
The **IOBYT** defines which physical devices are assigned to each logical device.  
It’s an 8-bit variable divided into four 2-bit fields:

| Logical Device | Example Physical Options |
|----------------|---------------------------|
| `CON:` (console) | TTY:, CRT:, BAT:, UC1: |
| `RDR:` (reader) | TTY:, PTR:, UR1:, UR2: |
| `PUN:` (punch) | TTY:, PTP:, UP1:, UP2: |
| `LST:` (list) | TTY:, CRT:, LPT:, UL1: |

You can view or change these with the **STAT** command (e.g., `STAT VAL:`).

---

## 7. CCP (Console Command Processor)
The **CCP** is the user’s interface with the system.  
It displays the current drive prompt (e.g., `A>`) and executes commands.

### Types of Commands
**Resident (built-in):**
- `DIR` – list directory  
- `ERA` – delete files  
- `REN` – rename files  
- `SAVE` – save memory as `.COM` file  
- `TYPE` – display file contents  

**Transient (loaded from disk):**
- `STAT` – show/change device assignments  
- `ED` – edit files  
- `ASM` – assemble source code  
- `LOAD` – convert `.HEX` → `.COM`  
- `SUBMIT` – run batch jobs  
- `SYSGEN` – generate a bootable CP/M disk  

CCP loads transient programs into the **TPA (Transient Program Area)**, prepares their **FCB** and **TBUFF**, and executes them.

---

## 8. User Programs and the TPA
Both transient commands and user-created `.COM` files run in the **TPA**.  
When they finish, CP/M performs a **warm start**, returning to the `A>` prompt.

---

## Acronym Definitions

- **CP/M** – Control Program for Microcomputers  
- **ROM** – Read-Only Memory  
- **RAM** – Random Access Memory  
- **PROM** – Programmable Read-Only Memory  
- **CCP** – Console Command Processor  
- **BDOS** – Basic Disk Operating System  
- **CBIOS** – Customized Basic Input/Output System  
- **IOBYT** – Input/Output Byte (device selector)  
- **TPA** – Transient Program Area  
- **FCB** – File Control Block  
- **TTY** – Teletype terminal  
- **CRT** – Cathode-Ray Tube display  
- **PTR** – Paper Tape Reader  
- **PTP** – Paper Tape Punch  
- **LPT** – Line Printer  
- **VAL** – Value (used in STAT command)  
- **COM file** – Command/executable file  
- **WBOOT** – Warm Boot routine  
- **BOOT** – Cold Boot routine

