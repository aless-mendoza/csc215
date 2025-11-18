# **Chapter 15: The File Control Block (FCB)**

## **Understanding the FCB**

CP/M and disk I/O CP/M manages low-level disk storage — tracks and sectors — while presenting files as named abstractions that programs can work with.

Programs access disks through the BDOS entry point at address 5, but many BDOS services require more than a single function code (for example, WCONF or an RBUFF buffer size). Those additional parameters are passed via a File Control Block (FCB), a small RAM structure that describes the file and provides workspace for CP/M. For our purposes we’ll use the transient FCB (TFCB) that CP/M reserves at memory locations 005CH–007CH.

Using the TFCB The TFCB tells CP/M how to locate a file for a disk I/O operation and contains temporary working fields CP/M uses during the operation. When you run a .COM program with a filename on the command line (for example, A:ASM C:FILENAME.TYP), CP/M loads A:ASM.COM into the transient program area (TPA) and automatically populates the TFCB with the filename information before starting the program.

---

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

### **Byte 0 — `dr` (Drive Number)**
- `0` = use currently selected drive  
- `1` = A:  
- `2` = B:  
- etc.  
When written into the directory, CP/M forces this to `0`.

---

### **Bytes 1–8 — `f1` to `f8` (Filename)**
- Eight ASCII bytes  
- If shorter than 8 characters → padded with spaces (`20h`)  
- Cannot include a period  
- `"?"` (3Fh) allowed for wildcard search

---

### **Bytes 9–11 — `t1` to `t3` (File Type)**
- Three ASCII bytes  
- Also padded with spaces  
- `"?"` allowed for wildcard search  
- Stored **without** the dot

---

### **Byte 12 — `ex` (Extent Number)**
- Which 16 KB “slice” of the file this FCB describes  
- Starts at 0  
- Increases as the file grows past 16 KB  
- Used by CP/M to index multiple directory entries for large files

---

### **Byte 13 — `s1` (System Byte 1)**
- Used internally by CP/M  
- Programmer should not modify  
- Helps BDOS track file state during find/search operations

---

### **Byte 14 — `s2` (System Byte 2)**
- Also internal  
- Used for extended files  
- Helps BDOS keep track of extents beyond limit of `ex`

---

### **Byte 15 — `rc` (Record Count)**
- Number of **128-byte records** used *in this extent*  
- Maximum is 128 records (16 KB) per extent  
- This is the closest thing CP/M has to a "file size" for this block of the file

---

### **Bytes 16–31 — `d0` through `dF`**
- Sixteen **1-byte allocation group numbers**  
- Each entry is an **8-bit block number**  
- Each block = **1 KB** of disk space (8 × 128-byte records)  
- Maps where the file’s data is located on disk  
- CP/M fills these in as the file grows

**Notes:**
- These DO NOT contain file size  
- They tell BDOS which 1 KB blocks on the disk hold the data  
- If fewer than 16 groups are needed, unused entries contain `00h`

---

### **Byte 32 — `cr` (Current Record)**
- Used by BDOS for sequential read/write  
- Tracks position inside the extent  
- Programmer generally does not modify it manually

---

# **Quick Visual Layout**

```
Offset  Meaning
------  -------------------------------------------
0       dr      (drive code)
1-8     f1–f8   (filename)
9-11    t1–t3   (file type)
12      ex      (extent)
13      s1      (system use)
14      s2      (system use)
15      rc      (record count)
16-31   d0–dF   (allocation blocks, 1 KB each)
32      cr      (current record)
```

---

# **What Fields You Actually Control**

You only set:
- `dr`  
- `f1–f8`  
- `t1–t3`

CP/M manages the rest:
- `ex`, `s1`, `s2`, `rc`, `d0–dF`, `cr`


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

stored in the FCB.

It works by:

1. Temporarily inserting zero terminators after the filename and type  
2. Converting the drive number into an ASCII character (`@`, `A`, `B`, etc.)
    - Return the `@` when the output is in the same disk
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

