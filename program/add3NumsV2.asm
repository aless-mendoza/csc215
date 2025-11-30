; ADD 3 DIGIT LONG NUMBERS
; BY ALESSANDRA MENDOZA AND DYLAN CHEN
; INSPIRED BY ELEANOR MAHSHEI AND ALEX HAMILL
; Library from Gabe <3

CR	EQU	0DH
LF	EQU	0AH

RCONF	EQU	1
WCONF	EQU	2
RBUFF	EQU	10

INITF	EQU	13
OPENF	EQU	15
CLOSF	EQU	16
FINDF	EQU	17
DELEF	EQU	19
READF	EQU	20
WRITF	EQU	21
MAKEF	EQU	22
SDMAF	EQU	26

RBOOT	EQU	0
BDOS	EQU	5
DRIVE	EQU	0
MEMAX	EQU	7
TFCB	EQU	5CH
FCBTY	EQU	TFCB+9
FCBEX	EQU	TFCB+12
FCBS2	EQU	TFCB+14
FCBRC	EQU	TFCB+15
FCBCR	EQU	TFCB+32
TBUFF	EQU	80H

BDAOK	EQU	0
BDER1	EQU	1
BDER2	EQU	2
BDERR	EQU	255

TPA	EQU	100H
ORG	0100H

START:  LXI     SP,STAK

; MAIN PROGRAM - ADD TWO 3-DIGIT NUMBERS
MAIN:   CALL    TWOCR           ; DOUBLE SPACE
        CALL    SPMSG
        DB      'ADD 3 Digit Numbers',0
        CALL    TWOCR

        ; GET FIRST NUMBER
        CALL    SPMSG
        DB      'ENTER NUMBER: ',0
        CALL    GETNUM          ; GET NUMBER INTO HL
        SHLD    NUM1            ; SAVE FIRST NUMBER

        ; GET SECOND NUMBER
        CALL    SPMSG
        DB      'ENTER SECOND NUMBER: ',0
        CALL    GETNUM          ; GET NUMBER INTO HL
        SHLD    NUM2            ; SAVE SECOND NUMBER

        ; ADD THE NUMBERS
        LHLD    NUM1            ; LOAD FIRST NUMBER
        XCHG                    ; MOVE TO DE
        LHLD    NUM2            ; LOAD SECOND NUMBER
        DAD     D               ; HL = HL + DE
        SHLD    RESULT          ; SAVE RESULT

        ; DISPLAY RESULT
        CALL    CCRLF
        CALL    SPMSG
        DB      'SUM: ',0
        LHLD    RESULT
        CALL    PRTNUM          ; PRINT THE NUMBER

        ; ASK TO CONTINUE
        CALL    CCRLF
        CALL    SPMSG
        DB      'AGAIN?',0
        CALL    GETYN
        JZ      MAIN            ; IF YES, DO ANOTHER

        ; EXIT TO CP/M
        JMP     RBOOT

; GET A DECIMAL NUMBER FROM CONSOLE (0-999)
; RETURNS VALUE IN HL
GETNUM: CALL    CIMSG           ; GET INPUT LINE
        CALL    CCRLF
        LXI     H,INBUF+2       ; POINT TO FIRST CHARACTER
        LXI     D,0             ; CLEAR RESULT IN DE

GNUM1:  MOV     A,M             ; GET CHARACTER
        ORA     A               ; CHECK FOR END
        JZ      GNUM2           ; DONE IF ZERO
        CPI     '0'             ; CHECK IF DIGIT
        JC      GNUM1X          ; SKIP IF NOT
        CPI     '9'+1
        JNC     GNUM1X          ; SKIP IF NOT

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

GNUM1X: INX     H               ; NEXT CHARACTER
        JMP     GNUM1

GNUM2:  XCHG                    ; RESULT TO HL
        RET

; PRINT  FROM HL 
PRTNUM: LXI     D,NUMBUF+5      ; POINT TO END OF BUFFER
        MVI     B,0             ; DIGIT COUNTER

PRTN1:  LXI     D,10            ; DIVISOR
        CALL    DIVIDE          ; HL/ 10, A = rem
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

; STORAGE FOR NUMBERS
NUM1:   DW      0
NUM2:   DW      0
RESULT: DW      0
NUMBUF: DS      6

SHOFN:	PUSH	B
	PUSH	H
	LDA	FCBTY
	MOV	C,A
	XRA	A
	STA	FCBTY
	STA	FCBEX
	LXI	H,TFCB
	MOV	A,M
	ANI	0FH
	ORI	40H
	CALL	CO
	MVI	A,':'
	CALL	CO
	INX	H
	CALL	COMSG
	MOV	A,C
	LXI	H,FCBTY
	MOV	M,A
	MVI	A,'.'
	CALL	CO
	CALL	COMSG
	POP	H
	POP	B
	RET

REMSG:	CALL	TWOCR
	LXI	H,RERROR
	CALL	COMSG
	RET

WEMSG:	CALL	TWOCR
	LXI	H,WERROR
	CALL	COMSG
	RET

WROPN:	CALL	TWOCR
	LXI	H,OPERROR
	CALL	COMSG
	RET

CPDMA:	LXI	D,TBUFF
	MVI	C,SDMAF
	CALL	BDOS
	RET

DRSEL:	CALL	CIMSG
	LDA	INBUF+2
	ANI	01011111B
	SUI	'@'
	JM	DRERR
	SUI	17
	JP	DRERR
	ADI	17
	RET

DRERR:	XRA	A
	RET

GET:	LXI	H,BUFFR
	SHLD	NEXT
	LXI	D,TFCB
	MVI	C,OPENF
	CALL	BDOS
	CPI	BDERR
	JNZ	GET1
	CALL	TWOCR
	LXI	H,OPERROR
	CALL	COMSG
	CALL	SHOFN
ERREX:	CALL	TWOCR
	CALL	CO
	JMP	DONE

GET1:	XRA	A
	STA	RECCT

GET2:	LHLD	NEXT
	XCHG
	MVI	C,SDMAF
	CALL	BDOS
	LXI	D,TFCB
	MVI	C,READF
	CALL	BDOS
	CPI	BDAOK
	JZ	GET3
	CPI	BDER1
	JZ	GETEX
	LXI	H,RERROR
	CALL	COMSG
	JMP	ERREX

GET3:	LDA	RECCT
	INR	A
	STA	RECCT
	LHLD	NEXT
	LXI	D,128
	DAD	D
	SHLD	NEXT
	LDA	MEMAX
	DCR	A
	CMP	H
	JNZ	GET2
	CALL	TWOCR
	LXI	H,MEMERROR
	CALL	COMSG
	JMP	ERREX

GETEX:	CALL	CCRLF
	CALL	CPDMA
	RET

PUT:	LXI	H,BUFFR
	SHLD	NEXT
	LDA	RECCT
	STA	CTSAV
	LDA	TFCB
	ORA	A
	JNZ	PUT1
	LXI	H,OPERROR
	CALL	COMSG
	JMP	PUTEX

PUT1:	MVI	C,INITF
	CALL	BDOS
	XRA	A
	STA	FCBCR
	LXI	H,0
	SHLD	FCBEX
	SHLD	FCBS2
	LXI	D,TFCB
	MVI	C,FINDF
	CALL	BDOS
	CPI	BDERR
	JZ	PUT2
	CALL	CCRLF
	LXI	H,ERAMSG
	CALL	COMSG
	CALL	SHOFN
	CALL	GETYN
	JNZ	PUTEX
	LXI	D,TFCB
	MVI	C,DELEF
	CALL	BDOS

PUT2:	LXI	D,TFCB
	MVI	C,MAKEF
	CALL	BDOS
	CPI	BDERR
	JNZ	PUT3
	LXI	H,OPERROR
	CALL	COMSG
	JMP	PUTEX

PUT3:	LHLD	NEXT
	XCHG
	MVI	C,SDMAF
	CALL	BDOS
	LHLD	NEXT
	LXI	D,128
	DAD	D
	SHLD	NEXT
	LXI	D,TFCB
	MVI	C,WRITF
	CALL	BDOS
	CPI	BDAOK
	JZ	PUT4
	LXI	H,WERROR
	CALL	COMSG
	JMP	PUTEX

PUT4:	LDA	RECCT
	DCR	A
	STA	RECCT
	JNZ	PUT3
	CALL	CPDMA
	LXI	D,TFCB
	MVI	C,CLOSF
	CALL	BDOS
	LDA	CTSAV
	STA	RECCT

PUTEX:	CALL	CCRLF
	CALL	CPDMA
	RET

CI:	PUSH	B
	PUSH	D
	PUSH	H
	MVI	C,RCONF
	CALL	BDOS
	ANI	7FH
	POP	H
	POP	D
	POP	B
	RET

CO:	PUSH	B
	PUSH	D
	PUSH	H
	MVI	C,WCONF
	MOV	E,A
	CALL	BDOS
	POP	H
	POP	D
	POP	B
	RET

TWOCR:	CALL	CCRLF

CCRLF:	MVI	A,CR
	CALL	CO
	MVI	A,LF
	CALL	CO
	RET

COMSG:	MOV	A,M
	ORA	A
	RZ
	CALL	CO
	INX	H
	JMP	COMSG

; MESSAGE POINTED TO BY STACK OUT TO CONSOLE
SPMSG:  XTHL                    ; GET "RETURN ADDRESS" TO HL
        XRA     A               ; CLEAR FLAGS AND ACCUMULATOR
        ADD     M               ; GET ONE MESSAGE CHARACTER
        INX     H               ; POINT TO NEXT
        XTHL                    ; RESTORE STACK FOR
        RZ                      ; RETURN IF DONE
        CALL    CO              ; ELSE DISPLAY CHARACTER
        JMP     SPMSG           ; AND DO ANOTHER

CIMSG:	PUSH	B
	PUSH	D
	PUSH	H
	LXI	H,INBUF+1
	MVI	M,0
	DCX	H
	MVI	M,80
	XCHG
	MVI	C,RBUFF
	CALL	BDOS
	LXI	H,INBUF+1
	MOV	E,M
	MVI	D,0
	DAD	D
	INX	H
	MVI	M,0
	POP	H
	POP	D
	POP	B
	RET

GETYN:	
	LXI	H,YNMSG
	CALL	COMSG
	CALL	CIMSG
	CALL	CCRLF
	LDA	INBUF+2
	ANI	01011111B
	CPI	'Y'
	RZ
	CPI	'N'
	JNZ	GETYN
	CPI	0
	RET

INBUF:	DS	83
DRSAV:	DS	1
RECCT:	DS	1
CTSAV:	DS	1
NEXT:	DS	2

	DS	64
STAK:	DB	0

SINON:	DB	'YOUR SIGN ON MESSAGE',0

BUFFR:	DS	1024

RERROR:	DB	'READ ERROR',0
WERROR:	DB	'WRITE ERROR',0
OPERROR:	DB	'CANNOT_OPEN',0
MEMERROR:	DB	'OUT OF MEMORY',0
ERAMSG:	DB	'OK TO ERASE',0
YNMSG:	DB	'Y/N?: ',0

    END
