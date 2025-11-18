# **Chapter 15: The File Control Block (FCB)**

## **Understanding the FCB**

CP/M stores all file-access information in a 33-byte structure called the **File Control Block (FCB)**. Because the 8080 registers cannot hold enough data to describe a file, CP/M relies on this RAM block to store:

- drive number  
- 8-byte filename  
- 3-byte file type  
- extent number for files larger than 16 KB  
- record count  
- the list of disk allocation groups (each 1 KB)  
- the current record pointer  

The default one CP/M creates for a running program is the **TFCB**, located at `005Ch–007Ch`. Whenever CP/M loads a program with a command like:

```
MYPROG B:EXAMPLE.TXT
```

the TFCB is filled with the drive and filename before the program even begins executing.

---

## **How CP/M Uses the FCB**

Bytes are numbered from 0 to 32 (33 bytes total). Common layout:

- 0 — Drive (1 byte)
- 1–8 — Filename (8 bytes; space-padded)
- 9–11 — File type (3 bytes; space-padded)
- 12 — Extent number (ex)
- 13 — System-use byte s1
- 14 — System-use byte s2
- 15 — Record count (rc)
- 16–31 — Allocation groups (d0..dF) — 16 bytes (each entry is a group number)
- 32 — Current record pointer (cr) — usually used as temporary workspace

When a program reads or writes a file, CP/M handles nearly all the complexity:

- Disk space is allocated in **1 KB groups**, each containing eight 128-byte records.  
- As a file grows beyond 16 KB, CP/M automatically creates **additional extents**, each represented by a new FCB-style directory entry.  
- When the file is closed, the first 32 bytes of the FCB are written directly into the disk directory.  
- When a file is erased, the directory entry’s first byte is set to **E5h**, signaling the space can be reused.

The programmer never needs to worry about track/sector locations. CP/M translates group numbers into physical disk addresses behind the scenes.

---

## **The SHOFN Subroutine**

A new routine called **SHOFN** is introduced to display:

- the drive  
- the filename  
- the file type  

stored in the TFCB.

It works by:

1. Temporarily inserting zero terminators after the filename and type  
2. Converting the drive number into an ASCII character (`@`, `A`, `B`, etc.)
     2.1 Return the `@` when the output is in the same disk
3. Printing the drive, name, and type using console routines from CPMIO  
4. Restoring the original FCB bytes before returning

This routine demonstrates how to read structured data from CP/M and output it cleanly to the console.

---

## **What the Program in This Chapter Does**

The example program, **TESTC15**, is a small diagnostic used to test SHOFN. When run with:

```
TESTC15 B:FILENAME.TYP
```

CP/M automatically fills in the TFCB with:

- drive = B  
- filename = FILENAME  
- type = TYP  

Inside, the program:

- saves CP/M’s original stack pointer  
- sets up its own stack  
- prints spacing  
- calls SHOFN to display the filename CP/M placed in the TFCB  
- restores the original stack pointer and returns cleanly to the command prompt  

Because of the stack-saving technique, the program exits quickly and safely back to CP/M without rebooting.

---

## **Breaking Code Into Library Files**

The chapter also introduces the idea of splitting code into `.LIB` modules for easier reuse. Examples include:

- `IOEQU.LIB` – console I/O equates  
- `DISKEQU.LIB` – disk functions and constants  
- `SHOFN.LIB` – the filename-display routine  
- `CPMIO.LIB` – general input/output subroutines  

These can be merged using PIP to build complete `.ASM` files without manually copying everything.

