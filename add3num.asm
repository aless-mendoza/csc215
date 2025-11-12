; ADD 3 DIGIT NUMBERS
; BY ALESSANDRA MENDOZA & DYLAN CHEN

;setup
CR	EQU	0DH
LF	EQU	0AH

RCONF	EQU	1
WCONF	EQU	2
RBUFF	EQU	10
BDOS	EQU	5
TPA	EQU	100H

        ORG TPA

START:	LXI	SP,STAK        ; Initialize stack pointer

MAINLOOP:
	CALL	CCRLF
	LXI	H,PROMPT       ; Display prompt message
	CALL	COMSG

	CALL	CIMSG          ; Get user input (into INBUF)

	CALL	CCRLF
	LXI	H,OUTMSG        ; Display confirmation message
	CALL	COMSG

        ; Print user input back	
	LXI	H,INBUF+2       ; Skip length bytes
ECHO_LOOP:
	MOV	A,M
        CPI	CR              ; Stop at carriage return
	JZ	DONE
	CALL	CO             ; Print character
        INX	H
	JMP	ECHO_LOOP

DONE:
	CALL	CCRLF
	JMP	MAINLOOP

; console i & o
PROMPT:	DB	'Enter a 3-digit number: ',0
OUTMSG: DB	'You entered: ',0

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
	CALL CO
	INX H
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
	POP	H
	POP	D
	POP	B
	RET

;memory areas
INBUF:	DS	83
	DS	64
STAK:	DB	0
	END
