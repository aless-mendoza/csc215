; ADD 3 DIGIT NUMBERS
; BY ALESSANDRA MENDOZA & DYLAN CHEN

; setup till start
CR	EQU	0DH
LF	EQU	0AH
CTRLZ	EQU	1AH

RCONF	EQU	1
WCONF	EQU	2
RBUFF	EQU	10

RBOOT	EQU	0
BDOS	EQU	5
TPA	EQU	100H

	ORG	TPA

; main loop
START:	LXI	SP,STAK ;makes the stack
START1:	CALL	CCRLF ;makes newline
	LXI	H,SINON
; print
	CALL	COMSG
START2:
	CALL	CCRLF
	LXI	H,PROMPT
	CALL	COMSG
	CALL	CIMSG       ; get input into INBUF

	CALL	ASC2BIN     ; convert to binary (result in HL)

    ; print confirmation
	CALL	CCRLF
	LXI	H,OUTMSG
	CALL	COMSG
	MOV	A,H
	CALL	PRINTNUM    ; print number back to user

	JMP	START2

PROMPT:	DB	'Enter a 3-digit number: ',0
OUTMSG:	DB	'You entered: ',0

; functions
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

CCRLF:	MVI	A,CR
	CALL	CO
	MVI	A,LF
	JMP	CO

COMSG:	MOV	A,M
	ORA	A
	RZ
	CALL	CO
	INX	H
	JMP	COMSG

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

INBUF:	DS	83

	DS	64
STAK:	DB	0

; Functions for the program
ASC2BIN:
    LXI	H,0         ; HL = 0
    LXI	D,INBUF+2    ; DE points to first char typed

    MVI	B,3          ; expect 3 digits
ASC_LOOP:
    LDAX	D           ; get next character
    CPI	'0'
    JC	DONE_CONV     ; stop if not a digit
    CPI	'9'+1
    JNC	DONE_CONV
    SUI	'0'          ; convert ASCII to binary digit (0–9)

    ; HL = HL * 10
    MOV	A,H
    MOV	C,L
    MVI	B,10
MUL10:
    DAD	H
    DCR	B
    JNZ	MUL10

    ; HL = HL + A
    MOV	E,A
    MVI	D,0
    DAD	D

    INX	D
    DCR	B
    JNZ	ASC_LOOP
DONE_CONV:
    RET

; helper strings
PRINTNUM:
    ; HL contains the number
    ; convert to decimal ASCII and print
    PUSH	H
    LXI	D,OUTBUF+5   ; end of buffer
    MVI	B,0
PRN_LOOP:
    LXI	B,0
    MVI	C,10
    CALL	DIV10
    DCR	D
    MVI	M,	'0'
    ADD	A
    JNZ	PRN_LOOP
    INX	D
    CALL	COMSG
    POP	H
    RET

OUTBUF:	DS	6


	END
