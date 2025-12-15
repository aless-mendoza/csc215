; CSC215
; ADD THREE DIGIT NUMBERS
; BY ALESSANDRA MENDOZA AND DYLAN CHEN

; HUGE THANKS TO NIKITA AND BLU

; ASCII CHARACTERS
CR      EQU     0DH             
LF      EQU     0AH             
CTRLZ   EQU     1AH             

; CP/M BDOS FUNCTIONS
RCONF   EQU     1               ; READ CON: INTO (A)
WCONF   EQU     2               ; WRITE (A) TO CON:
RBUFF   EQU     10              ; READ A CONSOLE LINE

; CP/M DISK ACCESS FUNCTIONS
INITF   EQU     13              ; INITIALIZE BDOS FUNCTION
OPENF   EQU     15              ; OPEN FILE FUNCTION
CLOSF   EQU     16              ; CLOSE FILE FUNCTION
FINDF   EQU     17              ; FIND FILE FUNCTION
DELEF   EQU     19              ; DELETE A FILE FUNCTION
READF   EQU     20              ; READ ONE RECORD FUNCTION
WRTF    EQU     21              ; WRITE ONE RECORD FUNCTION
MAKEF   EQU     22              ; CREATE FILE FUNCTION
SDMAF   EQU     26              ; SET DMA FUNCTION

; CP/M ADDRESSES
RBOOT   EQU     0               
DRIVE   EQU     4               
BDOS    EQU     5               
MEMAX   EQU     7               

TFCB    EQU     5CH             ; TRANSIENT FILE CONTROL BLOCK
FCBTY   EQU     TFCB+9          ; FILE TYPE IN FCB
FCBEX   EQU     TFCB+12         ; FILE EXTENT IN FCB
FCBS2   EQU     TFCB+14         ; SYSTEM USE IN FCB
FCBRC   EQU     TFCB+15         ; RECORD COUNT IN FCB
FCBCR   EQU     TFCB+32         ; CURRENT RECORD IN FCB
TBUFF   EQU     80H             ; TRANSIENT BUFFER
TPA     EQU     100H            ; TRANSIENT PROGRAM AREA

; CP/M FLAGS
BDAOK   EQU     0               ; BDOS RETURN FOR ALL OK
BDER1   EQU     1               ; BDOS RETURN ONE
BDER2   EQU     2               ; BDOS RETURN TWO
BDERR   EQU     255             ; BDOS RETURN ERROR FLAG

        ORG     TPA             ; ASSEMBLE PROGRAM FOR TPA

START:  LXI     SP,STAK         ; SET UP USER'S STACK
        LDA     DRIVE           ; SAVE INITIAL DRIVE SELECTED
        STA     DRSAV
        
        CALL    CCRLF           ; START A NEW LINE
        LXI     H,SINON         ; WITH SIGN-ON MESSAGE
        CALL    COMSG
        
        ; READ FILE INTO BUFFER
        CALL    GET             ; GET THE NAMED FILE
        
        ; NOW PARSE THE BUFFER AND ADD NUMBERS
        CALL    CCRLF
        CALL    SPMSG
        DB      'PROCESSING FILE...',0
        CALL    CCRLF

        ; BUILD OUTPUT IN OUTBUF
        LXI     H,OUTBUF        ; POINT TO OUTPUT BUFFER
        SHLD    OUTPTR          ; SAVE POINTER

        ; START PROCESSING LINES FROM BUFFER
        LXI     H,BUFFR         ; START OF BUFFER
        SHLD    LINEPTR         ; SAVE AS LINE POINTER

NXTLIN: LHLD    LINEPTR         ; GET CURRENT LINE POINTER

        ; CHECK FOR END OF FILE (CTRL-Z)
        MOV     A,M
        CPI     CTRLZ           ; END OF FILE?
        JZ      ENDPRC          ; YES, DONE PROCESSING
        CPI     0               ; NULL TERMINATOR?
        JZ      ENDPRC          ; YES, DONE

        ; SKIP ANY LEADING WHITESPACE
        CALL    SKIPWS          ; SKIP WHITESPACE, HL updated

        ; CHECK AGAIN AFTER SKIPPING WHITESPACE
        MOV     A,M
        CPI     CTRLZ           ; END OF FILE?
        JZ      ENDPRC          ; YES, DONE PROCESSING
        CPI     0               ; NULL TERMINATOR?
        JZ      ENDPRC          ; YES, DONE
        CPI     '0'             ; IS IT A DIGIT?
        JC      SKPLIN          ; NO, SKIP THIS LINE
        CPI     '9'+1
        JNC     SKPLIN          ; NO, SKIP THIS LINE

        ; PARSE FIRST NUMBER FROM CURRENT LINE
        CALL    PRSNUM          ; PARSE NUMBER FROM BUFFER
        ; Returns: HL = number value, DE = updated pointer
        SHLD    NUM1            ; SAVE FIRST NUMBER

        ; SKIP WHITESPACE - pointer is in DE
        XCHG                    ; Move pointer from DE to HL
        CALL    SKIPWS          ; SKIP WHITESPACE, HL updated

        ; CHECK IF WE HAVE A SECOND NUMBER
        MOV     A,M
        CPI     '0'             ; IS IT A DIGIT?
        JC      SKPLIN          ; NO, SKIP REST OF LINE
        CPI     '9'+1
        JNC     SKPLIN          ; NO, SKIP REST OF LINE

        ; PARSE SECOND NUMBER - pointer is in HL
        CALL    PRSNUM          ; PARSE SECOND NUMBER
        ; Returns: HL = number value, DE = updated pointer
        SHLD    NUM2            ; SAVE SECOND NUMBER

        ; SAVE POSITION FOR NEXT LINE
        XCHG                    ; Move pointer from DE to HL

        ; ADD THE NUMBERS (HL = NUM1 + NUM2)
        PUSH    H               ; SAVE LINE POINTER
        LHLD    NUM1            ; LOAD FIRST NUMBER
        XCHG                    ; MOVE TO DE
        LHLD    NUM2            ; LOAD SECOND NUMBER
        DAD     D               ; HL = HL + DE (ADD THEM)
        SHLD    RESULT          ; SAVE RESULT

        ; WRITE "NUMBER 1: "
        LXI     D,MSG1
        CALL    CPYSTR

        ; WRITE FIRST NUMBER
        LHLD    NUM1
        CALL    NUMSTR

        ; WRITE CR/LF
        CALL    ADDCR

        ; WRITE "NUMBER 2: "
        LXI     D,MSG2
        CALL    CPYSTR

        ; WRITE SECOND NUMBER
        LHLD    NUM2
        CALL    NUMSTR

        ; WRITE CR/LF
        CALL    ADDCR

        ; WRITE "SUM: "
        LXI     D,MSG3
        CALL    CPYSTR

        ; WRITE RESULT
        LHLD    RESULT
        CALL    NUMSTR

        ; WRITE CR/LF
        CALL    ADDCR
        CALL    ADDCR           ; ADD BLANK LINE BETWEEN RESULTS

        ; DISPLAY RESULTS TO CONSOLE TOO
        CALL    CCRLF
        CALL    SPMSG
        DB      'NUMBER 1: ',0
        LHLD    NUM1
        CALL    PRTNUM

        CALL    CCRLF
        CALL    SPMSG
        DB      'NUMBER 2: ',0
        LHLD    NUM2
        CALL    PRTNUM

        CALL    CCRLF
        CALL    SPMSG
        DB      'SUM: ',0
        LHLD    RESULT
        CALL    PRTNUM

        CALL    CCRLF

        ; RESTORE LINE POINTER AND FIND NEXT LINE
        POP     H               ; RESTORE POSITION AFTER NUMBERS

SKPLIN: ; SKIP TO END OF CURRENT LINE
        MOV     A,M             ; GET CHARACTER
        CPI     CTRLZ           ; END OF FILE?
        JZ      ENDPRC
        CPI     0               ; NULL?
        JZ      ENDPRC
        CPI     CR              ; CARRIAGE RETURN?
        JZ      FNDLF           ; LOOK FOR LINE FEED
        CPI     LF              ; LINE FEED?
        JZ      NXTCH           ; MOVE TO NEXT LINE
        INX     H               ; NEXT CHARACTER
        JMP     SKPLIN

FNDLF:  INX     H               ; SKIP CR
        MOV     A,M             ; CHECK NEXT
        CPI     LF              ; IS IT LF?
        JNZ     SVLIN           ; NO, SAVE POSITION
NXTCH:  INX     H               ; SKIP LF
SVLIN:  SHLD    LINEPTR         ; SAVE FOR NEXT LINE
        JMP     NXTLIN          ; PROCESS NEXT LINE

ENDPRC: ; DONE PROCESSING ALL LINES
        ; WRITE CTRL-Z TO END FILE
        MVI     A,CTRLZ
        CALL    ADDBUF
        
        ; NOW WRITE OUTPUT TO FILE
        CALL    WRFILE          ; WRITE OUTPUT FILE
        
        CALL    CCRLF
        CALL    SPMSG
        DB      'RESULTS WRITTEN TO RESULT.TXT',0
        CALL    CCRLF
        
DONE:   LDA     DRSAV           ; RESTORE INITIAL DRIVE
        STA     DRIVE
        JMP     RBOOT

; SKIP WHITESPACE AND DELIMITERS
; INPUT: HL = pointer to buffer
; OUTPUT: HL = pointer to next non-whitespace character
SKIPWS: MOV     A,M             ; GET CHARACTER
        CPI     ' '             ; SPACE?
        JZ      SKIP1
        CPI     CR              ; CR?
        JZ      SKIP1
        CPI     LF              ; LF?
        JZ      SKIP1
        CPI     09H             ; TAB?
        JZ      SKIP1
        RET                     ; NOT WHITESPACE, RETURN
SKIP1:  INX     H               ; SKIP IT
        JMP     SKIPWS          ; CHECK NEXT

; COPY STRING FROM DE TO OUTPUT BUFFER
CPYSTR: LDAX    D               ; GET CHARACTER
        ORA     A               ; END?
        RZ                      ; YES, DONE
        CALL    ADDBUF          ; ADD TO BUFFER
        INX     D               ; NEXT CHARACTER
        JMP     CPYSTR

; ADD CHARACTER IN A TO OUTPUT BUFFER
ADDBUF: PUSH    H
        LHLD    OUTPTR          ; GET OUTPUT POINTER
        MOV     M,A             ; STORE CHARACTER
        INX     H               ; INCREMENT
        SHLD    OUTPTR          ; SAVE POINTER
        POP     H
        RET

; ADD CR/LF TO OUTPUT BUFFER
ADDCR:  MVI     A,CR
        CALL    ADDBUF
        MVI     A,LF
        JMP     ADDBUF

; CONVERT NUMBER IN HL TO STRING IN OUTPUT BUFFER
NUMSTR: PUSH    B
        PUSH    D
        LXI     B,0             ; DIGIT COUNTER
        
NUMS1:  LXI     D,10            ; DIVISOR
        CALL    DIVIDE          ; HL/10, A = rem
        ADI     '0'             ; CONVERT TO ASCII
        PUSH    PSW             ; SAVE DIGIT
        INX     B               ; COUNT DIGITS
        MOV     A,H             ; CHECK IF DONE
        ORA     L
        JNZ     NUMS1           ; CONTINUE IF NOT ZERO
        
NUMS2:  POP     PSW             ; GET DIGIT
        CALL    ADDBUF          ; ADD TO BUFFER
        DCX     B               ; COUNT DOWN
        MOV     A,B
        ORA     C
        JNZ     NUMS2
        
        POP     D
        POP     B
        RET

; WRITE OUTPUT FILE (RESULT.TXT)
WRFILE: LXI     H,OFCB          ; SETUP OUTPUT FCB
        LXI     D,RFNAME        ; POINT TO RESULT.TXT NAME
        MVI     B,12            ; 12 BYTES TO COPY
WRF1:   LDAX    D
        MOV     M,A
        INX     H
        INX     D
        DCR     B
        JNZ     WRF1

        ; INITIALIZE FCB
        XRA     A
        STA     OFCB+12         ; EXTENT
        STA     OFCB+32         ; CURRENT RECORD
        LXI     H,0
        SHLD    OFCB+14         ; S2 AND RC

        ; DELETE IF EXISTS
        LXI     D,OFCB
        MVI     C,DELEF
        CALL    BDOS

        ; CREATE FILE
        LXI     D,OFCB
        MVI     C,MAKEF
        CALL    BDOS
        CPI     BDERR
        JNZ     WRF2
        CALL    WEMSG
        RET

WRF2:   ; CALCULATE HOW MANY RECORDS TO WRITE
        LHLD    OUTPTR          ; GET CURRENT OUTPUT POINTER
        LXI     D,OUTBUF        ; GET START OF BUFFER
        MOV     A,L             ; SUBTRACT TO GET LENGTH
        SUB     E
        MOV     L,A
        MOV     A,H
        SBB     D
        MOV     H,A             ; HL NOW HAS LENGTH

        ; CONVERT LENGTH TO NUMBER OF RECORDS (DIVIDE BY 128)
        ; ADD 127 TO ROUND UP, THEN DIVIDE
        LXI     D,127
        DAD     D               ; ADD 127 FOR ROUNDING

        ; DIVIDE BY 128: SHIFT RIGHT 7 TIMES
        MOV     A,H             ; GET HIGH BYTE
        RRC                     ; SHIFT RIGHT 1
        RRC                     ; SHIFT RIGHT 2
        RRC                     ; SHIFT RIGHT 3
        RRC                     ; SHIFT RIGHT 4
        RRC                     ; SHIFT RIGHT 5
        RRC                     ; SHIFT RIGHT 6
        RRC                     ; SHIFT RIGHT 7
        ANI     01H             ; MASK TO GET ONLY THE LSB
        MOV     B,A             ; SAVE RECORD COUNT IN B

        ; IF B IS ZERO, WRITE AT LEAST ONE RECORD
        MOV     A,B
        ORA     A
        JNZ     WRF3
        MVI     B,1             ; WRITE AT LEAST ONE RECORD

WRF3:   ; WRITE RECORDS TO FILE
        LXI     H,OUTBUF        ; START OF OUTPUT BUFFER
        SHLD    WRTPTR          ; SAVE WRITE POINTER

WRF4:   ; SET DMA ADDRESS FOR CURRENT RECORD
        LHLD    WRTPTR
        XCHG                    ; DE = DMA ADDRESS
        MVI     C,SDMAF
        CALL    BDOS

        ; WRITE ONE RECORD
        LXI     D,OFCB
        MVI     C,WRTF
        CALL    BDOS
        CPI     BDAOK
        JZ      WRF5
        CALL    WEMSG
        CALL    CPDMA           ; RESTORE DMA
        RET

WRF5:   ; ADVANCE TO NEXT RECORD
        LHLD    WRTPTR
        LXI     D,128           ; RECORD SIZE
        DAD     D
        SHLD    WRTPTR

        DCR     B               ; DECREMENT RECORD COUNT
        JNZ     WRF4            ; CONTINUE IF MORE RECORDS

        ; CLOSE FILE
        LXI     D,OFCB
        MVI     C,CLOSF
        CALL    BDOS
        CALL    CPDMA           ; RESTORE DMA
        RET

; PARSE A DECIMAL NUMBER FROM BUFFER POINTED TO BY HL
; INPUT: HL = pointer to buffer (at start of number)
; OUTPUT: HL = parsed number value, DE = pointer to character after number
PRSNUM: PUSH    B
        LXI     B,0             ; CLEAR RESULT IN BC
        
PNUM1:  MOV     A,M             ; GET CHARACTER
        CPI     '0'             ; CHECK IF DIGIT
        JC      PNUM2           ; NOT A DIGIT, DONE
        CPI     '9'+1
        JNC     PNUM2           ; NOT A DIGIT, DONE
        
        ; MULTIPLY BC BY 10
        PUSH    H               ; SAVE POINTER
        MOV     H,B             ; COPY BC TO HL
        MOV     L,C
        DAD     H               ; HL = BC * 2
        DAD     H               ; HL = BC * 4
        DAD     B               ; HL = BC * 5
        DAD     H               ; HL = BC * 10
        MOV     B,H             ; RESULT BACK TO BC
        MOV     C,L
        
        ; ADD DIGIT TO RESULT
        POP     H               ; RESTORE POINTER
        MOV     A,M             ; GET DIGIT CHARACTER
        SUI     '0'             ; CONVERT TO BINARY
        ADD     C               ; ADD TO LOW BYTE
        MOV     C,A
        MVI     A,0
        ADC     B               ; ADD CARRY TO HIGH BYTE
        MOV     B,A
        
        INX     H               ; NEXT CHARACTER
        JMP     PNUM1
        
PNUM2:  ; HL points to first non-digit
        XCHG                    ; Save pointer in DE
        MOV     H,B             ; Move result from BC to HL
        MOV     L,C
        POP     B               ; Restore BC
        RET                     ; Return with number in HL, pointer in DE

; PRINT NUMBER FROM HL 
PRTNUM: PUSH    B
        PUSH    D
        MVI     B,0             ; DIGIT COUNTER
        
PRTN1:  LXI     D,10            ; DIVISOR
        CALL    DIVIDE          ; HL/10, A = rem
        ADI     '0'             ; CONVERT TO ASCII
        PUSH    PSW             ; SAVE DIGIT
        INR     B               ; COUNT DIGITS
        MOV     A,H             ; CHECK IF DONE
        ORA     L
        JNZ     PRTN1           ; CONTINUE IF NOT ZERO
        
PRTN2:  POP     PSW             ; GET DIGIT
        CALL    CO              ; PRINT IT
        DCR     B               ; COUNT DOWN
        JNZ     PRTN2
        
        POP     D
        POP     B
        RET

; DIVIDE HL BY 10, RESULT IN HL, REMAINDER IN A
DIVIDE: PUSH    B
        PUSH    D
        LXI     B,0             ; BC WILL HOLD RESULT
        LXI     D,10            ; DIVISOR
DIV1:   MOV     A,H             ; Check high byte first
        ORA     A               ; Is H zero?
        JNZ     DIV2            ; If not, HL >= 256, continue dividing
        MOV     A,L             ; Check low byte
        CMP     E               ; Compare with 10
        JC      DIV3            ; If L < 10, done
DIV2:   MOV     A,L             ; SUBTRACT 10 FROM HL
        SUB     E
        MOV     L,A
        MOV     A,H
        SBB     D
        MOV     H,A
        INX     B               ; INCREMENT RESULT
        JMP     DIV1
DIV3:   MOV     A,L             ; REMAINDER TO A
        MOV     H,B             ; RESULT TO HL
        MOV     L,C
        POP     D
        POP     B
        RET

; READ A FILE FROM DISK INTO "BUFFR"
GET:    LXI     H,BUFFR         ; GET BUFFER START
        SHLD    NEXT            ; ADDRESS FOR DMA
        LXI     D,TFCB          ; SEE IF FILE IS ON DISK
        MVI     C,OPENF         ; AND OPEN FOR READ
        CALL    BDOS
        CPI     BDERR           ; IS IT THERE?
        JNZ     GET1            ; YES, READ IT IN
        CALL    TWOCR           ; NO, SHOW ERROR
        CALL    SPMSG
        DB      'CAN NOT FIND ',0
        CALL    SHOFN           ; SHOW FILE NAME
ERREX:  CALL    TWOCR           ; ERROR EXIT TO CP/M
        JMP     DONE

GET1:   XRA     A               ; ZERO RECORD COUNTER
        STA     RECCT           ; AND READ A FILE INTO BUFFR
GET2:   LHLD    NEXT            ; SET BUFFER ADDRESS
        XCHG
        MVI     C,SDMAF
        CALL    BDOS
        LXI     D,TFCB          ; READ ONE RECORD INTO
        MVI     C,READF         ; BUFFER
        CALL    BDOS
        CPI     BDAOK           ; READ OK?
        JZ      GET3            ; YES, DO MORE
        CPI     BDER1           ; MAYBE, END OF FILE?
        JZ      GETEX           ; YES, NO PROBLEM
        CALL    REMSG           ; NO, SHOW ERROR
        JMP     ERREX           ; AND ALL DONE

GET3:   LDA     RECCT           ; COUNT THE RECORD
        INR     A
        STA     RECCT
        LHLD    NEXT            ; INCREMENT BUFFER ADDRESS
        LXI     D,128           ; BY RECORD SIZE
        DAD     D
        SHLD    NEXT
        LDA     MEMAX           ; ROOM LEFT IN RAM?
        DCR     A               ; STOP BELOW CCP
        CMP     H               ; COMPARE MSB
        JNZ     GET2            ; CONTINUE IF NOT EQUAL
        CALL    TWOCR           ; ELSE SHOW OUT OF MEMORY
        CALL    SPMSG
        DB      'OUT OF MEMORY',0
        JMP     ERREX           ; AND GIVE UP

GETEX:  CALL    CCRLF           ; NORMAL EXIT
        CALL    CPDMA           ; RESTORE CP/M DMA
        RET

; DISPLAY READ ERROR MESSAGE
REMSG:  CALL    TWOCR
        CALL    SPMSG
        DB      'PERMANENT READ ERROR',CR,LF,0
        RET

; DISPLAY WRITE ERROR MESSAGE
WEMSG:  CALL    TWOCR
        CALL    SPMSG
        DB      'PERMANENT WRITE ERROR',CR,LF,0
        RET

; RESTORE CP/M DMA ADDRESS TO THE TRANSIENT BUFFER
CPDMA:  LXI     D,TBUFF
        MVI     C,SDMAF
        CALL    BDOS
        RET

; DISPLAY FILENAME.TYP FROM TRANSIENT FCB
SHOFN:  PUSH    B               ; SAVE TEMP STORE
        PUSH    H               ; AND INDEX
        LDA     FCBTY           ; SAVE FIRST CHAR OF TYPE
        MOV     C,A             ; IN TEMPORARY STORE
        XRA     A               ; FORCE TWO TERMINATORS
        STA     FCBTY           ; FOR FILE NAME
        STA     FCBEX           ; AND FILE TYPE
        LXI     H,TFCB          ; SHOW DISK DRIVE
        MOV     A,M
        ANI     0FH             ; LIMIT TO 4 BITS
        ORI     40H             ; CONVERT TO ASCII
        CALL    CO
        MVI     A,':'
        CALL    CO              ; SHOW THE COLON
        INX     H               ; AND SHOW THE FILE NAME
        CALL    COMSG
        MOV     A,C
        LXI     H,FCBTY         ; RESTORE TYPE
        MOV     M,A
        MVI     A,'.'           ; SHOW SEPARATOR
        CALL    CO
        CALL    COMSG           ; SHOW TYPE
        POP     H
        POP     B               ; RESTORE AND
        RET                     ; RETURN

; CP/M I/O LIBRARY FUNCTIONS
; CONSOLE CHARACTER INTO REGISTER A MASKED TO 7 BITS
CI:     PUSH    B               ; SAVE REGISTERS
        PUSH    D
        PUSH    H
        MVI     C,RCONF         ; READ FUNCTION
        CALL    BDOS
        ANI     7FH             ; MASK TO 7 BITS
        POP     H               ; RESTORE REGISTERS
        POP     D
        POP     B
        RET

; CHARACTER IN REGISTER A OUTPUT TO CONSOLE
CO:     PUSH    B               ; SAVE REGISTERS
        PUSH    D
        PUSH    H
        MVI     C,WCONF         ; SELECT FUNCTION
        MOV     E,A             ; CHARACTER TO E
        CALL    BDOS            ; OUTPUT BY CP/M
        POP     H               ; RESTORE REGISTERS
        POP     D
        POP     B
        RET

; CARRIAGE RETURN, LINE FEED TO CONSOLE
TWOCR:  CALL    CCRLF           ; DOUBLE SPACE LINES
CCRLF:  MVI     A,CR
        CALL    CO
        MVI     A,LF
        JMP     CO

; MESSAGE POINTED TO BY HL OUT TO CONSOLE
COMSG:  MOV     A,M             ; GET A CHARACTER
        ORA     A               ; ZERO IS THE TERMINATOR
        RZ                      ; RETURN ON ZERO
        CALL    CO              ; ELSE OUTPUT THE CHARACTER
        INX     H               ; POINT TO THE NEXT ONE
        JMP     COMSG           ; AND CONTINUE

; MESSAGE POINTED TO BY STACK OUT TO CONSOLE
SPMSG:  XTHL                    ; GET "RETURN ADDRESS" TO HL
        XRA     A               ; CLEAR FLAGS AND ACCUMULATOR
        ADD     M               ; GET ONE MESSAGE CHARACTER
        INX     H               ; POINT TO NEXT
        XTHL                    ; RESTORE STACK FOR
        RZ                      ; RETURN IF DONE
        CALL    CO              ; ELSE DISPLAY CHARACTER
        JMP     SPMSG           ; AND DO ANOTHER

; INPUT CONSOLE MESSAGE INTO BUFFER
CIMSG:  PUSH    B               ; SAVE REGISTERS
        PUSH    D
        PUSH    H
        LXI     H,INBUF+1       ; ZERO CHARACTER COUNTER
        MVI     M,0
        DCX     H               ; SET MAXIMUM LINE LENGTH
        MVI     M,80
        XCHG                    ; INBUF POINTER TO DE REGISTERS
        MVI     C,RBUFF         ; SET UP READ BUFFER FUNCTION
        CALL    BDOS            ; INPUT A LINE
        LXI     H,INBUF+1       ; GET CHARACTER COUNTER
        MOV     E,M             ; INTO LSB OF DE REGISTER PAIR
        MVI     D,0             ; ZERO MSB
        DAD     D               ; ADD LENGTH TO START
        INX     H               ; PLUS ONE POINTS TO END
        MVI     M,0             ; INSERT TERMINATOR AT END
        POP     H               ; RESTORE ALL REGISTERS
        POP     D
        POP     B
        RET

; GET YES OR NO FROM CONSOLE
GETYN:  CALL    SPMSG
        DB      ' (Y/N)?: ',0
        CALL    CIMSG           ; GET INPUT LINE
        CALL    CCRLF           ; ECHO CARRIAGE RETURN
        LDA     INBUF+2         ; FIRST CHARACTER ONLY
        ANI     01011111B       ; CONVERT LOWER CASE TO UPPER
        CPI     'Y'             ; RETURN WITH ZERO = YES
        RZ
        CPI     'N'             ; NON-ZERO = NO
        JNZ     GETYN           ; ELSE TRY AGAIN
        CPI     0               ; RESET ZERO FLAG
        RET                     ; AND ALL DONE

; MESSAGES FOR OUTPUT FILE
MSG1:   DB      'NUMBER 1: ',0
MSG2:   DB      'NUMBER 2: ',0
MSG3:   DB      'SUM: ',0

; OUTPUT FILE NAME (RESULT.TXT)
RFNAME: DB      0,'RESULT  ','TXT'

; OUTPUT FCB
OFCB:   DS      36              ; OUTPUT FILE CONTROL BLOCK

; STORAGE FOR NUMBERS
NUM1:   DW      0
NUM2:   DW      0
RESULT: DW      0
NUMBUF: DS      6
OUTPTR: DW      0               ; OUTPUT BUFFER POINTER

; RAM VARIABLES AND BUFFERS
INBUF:  DS      83              ; LINE INPUT BUFFER
DRSAV:  DS      1               ; CURRENT DRIVE AT ENTRY
RECCT:  DS      1               ; TOTAL RECORDS READ/TO WRITE
CTSAV:  DS      1               ; SAVE LOCATION FOR COUNT
NEXT:   DS      2               ; NEXT DMA ADDRESS
LINEPTR:DS      2               ; CURRENT LINE POINTER IN BUFFER
WRTPTR: DS      2               ; WRITE POINTER FOR OUTPUT

; OUTPUT BUFFER (LARGE ENOUGH FOR MULTIPLE RESULTS)
; EACH RESULT IS ABOUT 50 BYTES, SO 1024 BYTES GIVES US ~20 RESULTS
OUTBUF: DS      1024

; STACK
        DS      64              ; 40H LOCATIONS
STAK:   DB      0               ; TOP OF STACK

; SIGN-ON MESSAGE
SINON:  DB      CR,LF
        DB      'DISKMULT - ADD THREE DIGIT NUMBERS FROM FILE',CR,LF
        DB      'READS NUMBERS FROM INPUT FILE AND WRITES RESULTS TO RESULT.TXT',CR,LF
        DB      0

; BUFFER

BUFFR:  END
