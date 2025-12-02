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

        ; GET FILE
        CALL    SPMSG
        DB      'ENTER FILENAME: ',0
        CALL    CIMSG
        CALL    CCRLF
        CALL    LOADFCBFROMINPUT
        CALL    SHOFN
        CALL    GET

        ; GET TWO LINES
        ; LINE ONE
        LXI     H,BUFFER
        CALL    READLINE        
        SHLD    NUM1STR            ; SAVE FIRST NUMBER
        XCHG

        ; LINE TWO
        XCHG
        CALL    READLINE
        SHLD    NUM2STR            ; SAVE SECOND NUMBER

        ; CONVERT STR TO INT
        LHLD    NUM1STR
        CALL    ATOI
        SHLD    NUM1

        LHLD    NUM2STR
        CALL    ATOI
        SHLD    NUM2

        ; ADD THE NUMBERS
        LHLD    NUM1            ; LOAD FIRST NUMBER
        XCHG                    ; MOVE TO DE
        LHLD    NUM2            ; LOAD SECOND NUMBER
        DAD     D               ; HL = HL + DE
        SHLD    RESULT          ; SAVE RESULT

        ; DISPLAY RESULT - BUILDING OUTPUT FILE
        ;clear outbuf first
        LXI     H,OUTBUF
        LXI     D,1024
CLROUT:
        MVI     M,0
        INX     H
        DCX     D
        MOV     A,D
        ORA     E
        JNZ     CLROUT

        LXI     H,OUTBUF
        SHLD    OUTPTR
        CALL    SPMSG
        DB      'out',0

        ; COPY INPUTTED LINES
        LHLD    NUM1STR
        MOV     D,H
        MOV     E,L
        CALL    APPENDLINE
        CALL    SPMSG
        DB      ' - append lines',0

        LHLD    NUM2STR
        MOV     D,H
        MOV     E,L
        CALL    APPENDLINE
        CALL    SPMSG
        DB      ' - append line 2',0

        ; ADD "---" FOR AESTHETICS
        LXI     D,DASHES
        CALL    APPENDLINE
        CALL    SPMSG
        DB      ' - format before result',0

        ; APPEND RESULTS
        LHLD    RESULT
        CALL    ITOATOTMP
        LXI     D,TMPNUM
        CALL    APPENDLINE
        CALL    SPMSG
        DB      ' - append result',0

        ;NULL-TERMINATE
        LHLD    OUTPTR
        MVI     M,0
        CALL    SPMSG
        DB      ' - before filename prompt',0

        ;WRITE OUTPUT FILE
        CALL    SPMSG
        DB      'OUTPUT FILENAME: ',0
        CALL    CIMSG
        CALL    CCRLF
        CALL    LOADFCBFROMINPUT
        CALL    BUILDOUTPUTFILE

        JMP     RBOOT

READLINE:
        ;HL = ADDRESS IN BUFFER
        MOV     D,H
        MOV     E,L

RL1:
        MOV     A,M
        ORA     A
        JZ      RLEND
        CPI     CR
        JZ      RLCR
        CPI     LF
        JZ      RLCR
        INX     H
        JMP     RL1

RLCR:
        MVI     M,0
        INX     H
RLEND:
        PUSH    H
        MOV     H,D
        MOV     L,E
        XTHL
        POP     D
        RET

;CONVERT ASCII STRING TO HL
; RETURNS VALUE IN HL
ATOI:
        LXI     D,0             ; CLEAR RESULT IN DE

A1:     MOV     A,M             ; GET CHARACTER
        ORA     A               ; CHECK FOR END
        JZ      A2           ; DONE IF ZERO
        CPI     '0'             ; CHECK IF DIGIT
        JC      A3          ; SKIP IF NOT
        CPI     '9'+1
        JNC     A3          ; SKIP IF NOT

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

A3:     INX     H               ; NEXT CHARACTER
        JMP     A1

A2:     XCHG                    ; RESULT TO HL
        RET

; CONVERT INT IN HL TO TMPNUM (NULL-TERMINATED) 
; DIVIDE HL BY 10, RESULT IN HL, REMAINDER IN A
ITOATOTMP:
        PUSH    B
        PUSH    D
        LXI     B,TMPNUM
        PUSH    B
ITOA1:
        ;DIVIDDE HL BY 10
        PUSH    B
        LXI     B,0             ; BC WILL HOLD RESULT
ITOA2:  
        MOV     A,H             ; Check high byte first
        ORA     A
        JNZ     ITOASUB
        MOV     A,L
        CPI     10
        JC      ITOA3
ITOASUB:
        LXI     D,10
        MOV     A,L
        SUB     E
        MOV     L,A
        MOV     A,H
        SBB     D
        MOV     H,A

        INX     B
        JMP     ITOA2
ITOA3:
        MOV     A,L
        ADI     '0'
        POP     D
        STAX    D
        INX     D
        PUSH    D

        MOV     H,B
        MOV     L,C

        MOV     A,H
        ORA     L

        POP     B
        JNZ      ITOA1
        
ITOA4:
        MVI     A,0
        STAX    B

        POP     D
        DCX     B
REV1:
        MOV     A,C
        SUB     E
        JC      REV2
        JZ      REV2

        MOV     A,B
        CMP     D
        JC      REV2

        LDAX    D
        MOV     H,A
        LDAX    B
        STAX    D
        MOV     A,H
        STAX    B

        INX     D
        DCX     B
        JMP     REV1
REV2:
        POP     D
        POP     B
        RET

;APPEND STRING AT DE TO OUTBUF
;OUTPTR UPDATED
APPENDLINE:
        LHLD    OUTPTR
AL1:
        LDAX    D
        ORA     A
        JZ      AL2
        MOV     M,A
        INX     H
        INX     D
        JMP     AL1
AL2:
        MVI     M,CR
        INX     H
        MVI     M,LF
        INX     H
        SHLD    OUTPTR
        RET

;READ FILENAME FROM INBUFF
LOADFCBFROMINPUT:
        LXI     H,INBUF+2
        LXI     D,TFCB+1
        MVI     C,8
COPYNAME:
        MOV     A,M
        ORA     A
        JZ      PADNAME
        CPI     '.'
        JZ      SKIPDOT
        MOV     A,M
        STAX    D
        INX     H
        INX     D
        DCR     C
        JNZ     COPYNAME
        JMP     NAMEDONE
PADNAME:
        MVI     A,' '
PADNAMELOOP:
        STAX    D
        INX     D
        DCR     C
        JNZ     PADNAMELOOP
NAMEDONE:
        MOV     A,M
        CPI     '.'
        JNZ     STARTEXT
SKIPDOT:
        INX     H
STARTEXT:
        MVI     C,3
COPYEXT:
        MOV     A,M
        ORA     A
        JZ      PADEXT
        CPI     CR
        JZ      PADEXT
        CPI     LF
        JZ      PADEXT

        MOV     A,M
        STAX    D
        INX     H
        INX     D
        DCR     C
        JNZ     COPYEXT
        JMP     EXTDONE
PADEXT:
        MVI     A,' '
PADEXTLOOP:
        STAX    D
        INX     D
        DCR     C
        JNZ     PADEXTLOOP
EXTDONE:
        RET


;WRITE OUTBUF TO OUTPUT FILE
BUILDOUTPUTFILE:
        LHLD    OUTPTR
        LXI     D,OUTBUF
        MOV     A,L
        SUB     E
        MOV     C,A
        MOV     A,H
        SBB     D
        MOV     B,A

        LXI     H,OUTBUF
        DAD     B

PADLOOP:
        MOV     A,L
        ANI     7FH
        JZ      PADDONE
        MVI     M,1AH
        INX     H
        JC      PADLOOP
PADDONE:
        LXI     H,OUTBUF
        SHLD    NEXT
        LXI     D,TFCB
        MVI     C,MAKEF
        CALL    BDOS
        
        LHLD    NEXT
        XCHG
        MVI     C,SDMAF
        CALL    BDOS
        
        LXI     D,TFCB
        MVI     C,WRITF
        CALL    BDOS

        MVI     C,CLOSF
        LXI     D,TFCB
        CALL    BDOS

        RET

DONE:   RET


; STORAGE FOR NUMBERS
TMPNUM: DS      8
TMPPTR: DS      2

NUM1STR:    DW  0
NUM2STR:    DW  0

NUM1:   DW      0
NUM2:   DW      0
RESULT: DW      0
OUTPTR: DW      0

NUM1TXT:    DW  0
NUM2TXT:    DW  0

ITOACNT:    DW  0
HLTEMP:     DW  0

DASHES: DB '-', '-', '-', '-', 0

INBUF:  DS  128
BUFFER: DS  1024
OUTBUF: DS  1024

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

GET:	LXI	H,BUFFER
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

PUT:	LXI	H,BUFFER
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

DRSAV:	DS	1
RECCT:	DS	1
CTSAV:	DS	1
NEXT:	DS	2

	DS	64
STAK:	DB	0

SINON:	DB	'YOUR SIGN ON MESSAGE',0

RERROR:	DB	'READ ERROR',0
WERROR:	DB	'WRITE ERROR',0
OPERROR:	DB	'CANNOT_OPEN',0
MEMERROR:	DB	'OUT OF MEMORY',0
ERAMSG:	DB	'OK TO ERASE',0
YNMSG:	DB	'Y/N?: ',0

    END
