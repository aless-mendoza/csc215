; ADD 3 DIGIT NUMBERS
; BY ALESSANDRA MENDOZA & DYLAN CHEN

CR	EQU	0DH
LF	EQU	0AH


RCONF	EQU	1
WCONF   EQU	2
RBUFF	EQU	10
BDOS	EQU	5
TPA	EQU	100H


	ORG	TPA


START:	LXI	SP,STAK


MAINLOOP:
	CALL	CCRLF
        LXI	H,PROMPT1
	CALL	COMSG
	CALL	CIMSG          ; Read first number
	CALL	ASC2BIN        ; Convert input -> binary (HL = value)
	SHLD	NUM1           ; Store result


	CALL	CCRLF
	LXI	H,PROMPT2
	CALL	COMSG
	CALL	CIMSG          ; Read second number
	CALL	ASC2BIN        ; Convert input -> binary (HL = value)
	SHLD	NUM2           ; Store result


        ; Add the two numbers: HL = NUM1 + NUM2
	LHLD	NUM1
	XCHG
	LHLD	NUM2
	DAD	D               ; HL = NUM1 + NUM2


	CALL	CCRLF
	LXI	H,OUTMSG
	CALL	COMSG
	CALL	PRINTDEC       ; Print sum in decimal


	CALL	CCRLF
	JMP	MAINLOOP


;------------------------------------------------------------
; Strings
;------------------------------------------------------------
PROMPT1:	DB	'Enter first 3-digit number: ',0
PROMPT2:	DB	'Enter second 3-digit number: ',0
OUTMSG:		DB	'The sum is: ',0


;------------------------------------------------------------
; Conversion: ASCII -> Binary (HL)
;------------------------------------------------------------
ASC2BIN:
	LXI	H,0
	LXI	D,INBUF+2
	MVI	B,3
CONV_LOOP:
	LDAX	D
        CPI	CR
	JZ	CONV_DONE
	SUI	'0'
	MOV	A,L
	MVI	C,10
	CALL	MUL_HL_10
	MOV	A,E
	ADD	L
	MOV	L,A
	MOV	A,D
	ADC	H
	MOV	H,A
	INX	D
	DCR	B
	JNZ	CONV_LOOP
CONV_DONE:
	RET


; Multiply HL by 10 (simple loop)
MUL_HL_10:
	MOV	E,L
	MOV	D,H
	LXI	H,0
	MVI	B,10
MUL10_LOOP:
	DAD	H
	DCR	B
	JNZ	MUL10_LOOP
	RET


;------------------------------------------------------------
; Print HL as decimal
;------------------------------------------------------------
PRINTDEC:
	PUSH	H
	LXI	D,OUTBUF+5
	MVI	M,0
	DCX	D
PD_LOOP:
	MVI	B,10
	CALL	DIV10
	ADI	'0'
	MOV	M,A
	DCX	D
	MOV	A,H
	ORA	L
	JNZ	PD_LOOP
	INX	D
	LXI	H,OUTBUF
	CALL	COMSG
	POP	H
	RET


;------------------------------------------------------------
; Divide HL by 10 (returns quotient in HL, remainder in A)
;------------------------------------------------------------
DIV10:
	LXI	B,0
	MVI	A,0
	RET



;------------------------------------------------------------
; BDOS I/O Routines
;------------------------------------------------------------
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
	POP	H
	POP	D
	POP	B
	RET


;------------------------------------------------------------
; Storage
;------------------------------------------------------------
NUM1:	DW	0
NUM2:	DW	0
INBUF:	DS	83
OUTBUF:	DS	6
	DS	64
STAK:	DB	0
	END
