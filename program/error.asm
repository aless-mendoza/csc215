; ADD 3 DIGIT LONG NUMBERS
; BY ALESSANDRA MENDOZA AND DYLAN CHEN
; INSPIRED BY ELEANOR MAHSHEI AND ALEX HAMILL
;
; ASCII CHARACTERS
CR      EQU     0DH             
LF      EQU     0AH             
CTRLZ   EQU     1AH            
; CP/M BDOS FUNCTIONS
OPENF   EQU     15              ; open file
CLOSEF  EQU     16              ; close file
READF   EQU     20              ; read next record
WRITEF  EQU     21              ; write sequential
CREATEF EQU     22              ; create file
RCONF   EQU     1               
WCONF   EQU     2              
RBUFF   EQU     10              
; CP/M ADDRESSES
RBOOT   EQU     0               
BDOS    EQU     5               
TPA     EQU     100H            
        ORG     TPA      
       
; define input and output
INFCB:  DB      0
        DB      'INPUT   TXT'
        DS      20
OUTFCB: DB      0
        DB      'OUTPUT  TXT'
        DS      20
BUFFER: DS      128

START:  LXI     SP,STAK         
    ;open input file
        LXI     D,INFCB
        MVI     C,OPENF
        CALL    BDOS
    ;read first record
        LXI     D,INFCB
        MVI     C,READF
        CALL    BDOS
    ;parse 2 numbers
        LXI     H,BUFFER
        CALL    READNUM
        SHLD    NUM1
        CALL    SKIPCRLF
        CALL    READNUM
        SHLD    NUM2
    ;add numbers
        LHLD    NUM1            ; LOAD FIRST NUMBER
        XCHG                    ; MOVE TO DE
        LHLD    NUM2            ; LOAD SECOND NUMBER
        DAD     D               ; HL = HL + DE
        SHLD    RESULT          ; SAVE RESULT
    ; create output file
        LXI     D,OUTFCB
        MVI     C,CREATEF
        CALL    BDOS
    ;format output text
        LXI     H,BUFFER
        
        ;write first number
        LHLD    NUM1
        CALL    PRTNUM
        CALL    WRCRLF

        LHLD    NUM2
        CALL    PRTNUM
        CALL    WRCRLF

        ; seperator
        MVI     M,'-'
        INX     H
        MVI     M,'-'
        INX     H
        MVI     M,'-'
        INX     H
        CALL    WRCRLF

    ;write result
        LHLD    RESULT
        CALL    PRTNUM
        CALL    WRCRLF
        MVI     M,CTRLZ                 ;end of file marker
    ;write the record
        LXI     D,OUTFCB
        MVI     C,WRITEF
        CALL    BDOS

        LXI     D,OUTFCB
        MVI     C,CLOSEF
        CALL    BDOS

        RET

; RETURNS VALUE IN HL
READNUM:
        LXI     D,0             ; CLEAR RESULT IN DE
        
RN1:    MOV     A,M             ; GET CHARACTER
        CPI     '0'             ; CHECK IF DIGIT
        JC      RNEND          ; SKIP IF NOT
        CPI     '9'+1
        JNC     RNEND          ; SKIP IF NOT
        
        ; MULTIPLY DE BY 10
        PUSH    H               ; SAVE POINTER
        PUSH    D               ; SAVE CURRENT RESULT
        MOV     H,D             ; COPY DE TO HL
        MOV     L,E
        DAD     H               ; HL = DE * 2
        DAD     H               ; HL = DE * 4
        POP     D               ; RESTORE ORIGINAL DE
        PUSH    D               ; SAVE IT AGAIN
        DAD     D               ; HL = DE * 5
        DAD     H               ; HL = DE * 10
        POP     D               ; CLEAN UP STACK
        XCHG                    ; RESULT TO DE
        
        ; ADD DIGIT TO RESULT
        POP     H               ; RESTORE POINTER
        MOV     A,M             ; GET DIGIT CHARACTER
        SUI     '0'             ; CONVERT TO BINARY
        ADD     E               ; ADD TO LOW BYTE
        MOV     E,A
        MVI     A,0
        ADC     D               ; ADD CARRY TO HIGH BYTE
        MOV     D,A
        
        INX     H               ; NEXT CHARACTER
        JMP     RN1
        
RNEND:  XCHG                    ; RESULT TO HL
        RET

; skip CR/LF
SKIPCRLF:
        MOV     A,M
        CPI     CR
        JNZ     SKDONE
        INX     H
        MOV     A,M
        CPI     LF
        JNZ     SKDONE
        INX     H
SKDONE: RET


; PRINT  FROM HL 
PRTNUM:
        PUSH    D
        PUSH    H
        LXI     D,NUMBUF+5      ; POINT TO END OF BUFFER
        MVI     B,0             ; DIGIT COUNTER
        
PN1:    LXI     D,10            ; DIVISOR
        CALL    DIVIDE          ; HL/ 10, A = rem
        ADI     '0'             ; CONVERT TO ASCII
        PUSH    PSW             ; SAVE DIGIT
        INR     B               ; COUNT DIGITS
        MOV     A,H             ; CHECK IF DONE
        ORA     L
        JNZ     PN1           ; CONTINUE IF NOT ZERO
        
PN2:    POP     PSW             ; GET DIGIT
        POP     H
        MOV     M,A
        INX     H
        PUSH    H
        DCR     B               ; COUNT DOWN
        JNZ     PN2
        POP     H
        POP     D
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

WRCRLF:
        MVI     M,CR
        INX     H
        MVI     M,LF
        INX     H
        RET

; STORAGE FOR NUMBERS
NUM1:   DW      0
NUM2:   DW      0
RESULT: DW      0
TEMPBUF:DS      6

STAK:  DS      64
        END
