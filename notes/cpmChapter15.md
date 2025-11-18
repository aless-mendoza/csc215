# Chapter 15: The File Control Block (FCB)


## What the Program in This Chapter Does

The chapter’s example program, **TESTC15**, demonstrates how to display the filename, file type, and drive stored in the **Transient File Control Block (TFCB)**. When you run:

```
TESTC15 B:NAME.TYP
```

CP/M automatically fills the TFCB with the drive, filename, and file type before loading TESTC15. The program then:

1. Sets up its own stack and saves CP/M’s original stack pointer.
2. Prints blank lines.
3. Calls **SHOFN**, which displays:
   - the drive letter  
   - the filename  
   - the file type  
4. Restores CP/M’s original stack pointer and returns cleanly to the command prompt.

This chapter also has you split your large CPMIO.ASM file into smaller `.LIB` components, and then merge them with PIP when assembling larger programs.

---

## Understanding the FCB

The **File Control Block (FCB)** is a 33-byte RAM structure CP/M uses for all named file operations. Because the 8080 CPU doesn’t have enough registers to pass all file data directly, programs place filename information into the FCB, and CP/M reads from it.

The default one CP/M sets up for the running program is the:

- **TFCB** (Transient File Control Block) at memory `005Ch–007Ch`.

The FCB contains:
- drive number  
- 8-byte filename  
- 3-byte file type  
- extent number (`ex`)  
- system-use bytes (`s1`, `s2`)  
- record count (`rc`)  
- allocation group table (`d0`–`dF`)  
- current record pointer (`cr`)

All bytes except the drive and filename/type are workspace CP/M updates automatically.

---

## How CP/M Uses the FCB

- Filenames are padded with spaces.
- File types are three characters, also space-padded.
- Wildcards use `?` (ASCII 3Fh).
- Disk space is allocated in **1 KB groups** (8 × 128-byte records).
- Each FCB can describe up to **16 KB** of data (one “extent”).
- Larger files produce multiple directory entries as CP/M increments the `ex` field.
- When a file is closed, CP/M writes the first 32 bytes of the FCB into the disk directory as the file’s directory entry.

Erased files are marked with **E5h** in the first byte of their directory entry, allowing the space to be reused dynamically.

---

## Disk Directory Behavior

Each directory entry mirrors the first 32 bytes of the FCB. The directory keeps track of:

- filename  
- type  
- drive  
- extent  
- allocation groups  
- record count  

Extended files occupy multiple directory entries. Deleted files have an E5h marker and are reused automatically.

---

## The SHOFN Subroutine

**SHOFN** prints the filename, type, and drive from the TFCB. It works by:

1. Saving registers.
2. Temporarily writing zero terminators into the filename and type fields.
3. Converting the drive number into ASCII (`@`, `A`, `B`, etc.).
4. Printing:
   - the drive  
   - the filename  
   - a period  
   - the file type  
5. Restoring saved values and returning.

It relies on COMSG (string output) and CO (character output) from the CPMIO routines.

---

## Building `.LIB` Files

This chapter guides you through reorganizing your code into reusable components:

- **IOEQU.LIB** – ASCII constants & I/O equates  
- **DISKEQU.LIB** – disk-related equates  
- **SHOFN.LIB** – SHOFN subroutine  
- **CPMIO.LIB** – console I/O routines  
- additional `.LIB` files for GET, PUT, COPY, and disk utilities  

Using PIP, multiple `.LIB` files can be merged into a final `.ASM` for assembly.

---

# Acronyms Defined

### CP/M  
Control Program for Microcomputers

### FCB  
File Control Block

### TFCB  
Transient File Control Block

### TPA  
Transient Program Area

### BDOS  
Basic Disk Operating System

### CCP  
Console Command Processor

### DMA  
Direct Memory Access

### ASCII  
American Standard Code for Information Interchange

### ORG  
Assembler directive to set an origin address

### EQU  
Assembler directive defining a constant

### LIB  
Library file of reusable routines

### DDT  
Dynamic Debugging Tool



