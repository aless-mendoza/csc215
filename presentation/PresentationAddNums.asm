; ADD 3 DIGIT LONG NUMBERS
; BY ALESSANDRA MENDOZA AND DYLAN CHEN
; INSPIRED BY ELEANOR MAHSHEI AND ALEX HAMILL
;
; SETUP
CR      EQU     0DH             
LF      EQU     0AH             
CTRLZ   EQU     1AH            
RCONF   EQU     1               
WCONF   EQU     2              
RBUFF   EQU     10              
RBOOT   EQU     0               
BDOS    EQU     5               
TPA     EQU     100H            
        ORG     TPA             
START:  LXI     SP,STAK    

; Storage for nums - like variables
NUM1:   DW      0
NUM2:   DW      0
RESULT: DW      0
NUMBUF: DS      6

; Main Program
START1:

;Get first 3 digit num        
        CALL    SPMSG
        DB      'Enter a 3 digit num: ',0
        CALL    GETNUM          ; Put number into HL
        SHLD    NUM1            ; Save first num
        
; Get second 3 digit num
        CALL    SPMSG
        DB      'Enter second digit num: ',0
        CALL    GETNUM          ; Put number into HL
        SHLD    NUM2            ; Save second num
        
; Add numbers
        LHLD    NUM1            ; Load first num
        XCHG                    ; Move to DE (Different register pair)
        LHLD    NUM2            ; Load second num
        DAD     D               ; HL = HL + DE (Add kinda accumulator to register DE)
        SHLD    RESULT          ; Save
        
; Output
        CALL    CCRLF           ; Newline
        CALL    SPMSG           ; Prints following message
        DB      'SUM: ',0       ; Output
        LHLD    RESULT          ; Pulls the sum
        CALL    PRTNUM          ; Prints the number
        
; Repeat???
        CALL    CCRLF
        CALL    SPMSG
        DB      'AGAIN?',0
        CALL    GETYN
        JZ      MAIN            ; Jumps to top to repeat if yes
        
; Exit program
        JMP     RBOOT           ; quits program if no

; Get decimal number
; Gets user input and puts value into HL
GETNUM: 
        CALL    CIMSG           ; Get num
        CALL    CCRLF
        LXI     H,INBUF+2       ; Point to first character from console
        LXI     D,0             ; Clear DE

; For looping within function
NUM1:  
; Checks if user input is a number
        MOV     A,M             ; Get character
        ORA     A               ; Checks if end
        JZ      NUM2           ; Done if end of input (0)
        CPI     '0'             ; Check if digit
        JC      NUM1X          ; Skip if not
        CPI     '9'+1           ; checks that value isn't greater than 9
        JNC     NUM1X          ; Skip if not
        
; Multiply DE by 10 to break up number ("67" becomes 6*10 + 7)
        PUSH    H               ; Save value in HL
        PUSH    D               ; Save value in DE (current result)
        MOV     H,D             ; Copy DE to HL
        MOV     L,E
        ; Multiplication has to be done through addition
        DAD     H               ; HL = DE * 2
        DAD     H               ; HL = DE * 4
        POP     D               ; Restore orginial DE
        PUSH    D               ; Save value in DE
        DAD     D               ; HL = DE * 5
        DAD     H               ; HL = DE * 10
        POP     D               ; Clean stack
        XCHG                    ; Put sum in DE
        
; Add digit to result
        POP     H               ; Restore HL
        MOV     A,M             ; Get digit
        SUI     '0'             ; Convert to bin
        ADD     E               ; Add to low byte
        MOV     E,A
        MVI     A,0
        ADC     D               ; Add carry to high byte
        MOV     D,A
        
NUM1X: 
        INX     H               ; Next character
        JMP     NUM1
        
NUM2:  
        XCHG                    ; Store result in HL
        RET

; Print HL
PRTNUM: 
        LXI     D,NUMBUF+5      ; Point to end of buffer (Output digits will be stored in reverse order in NUMBUF)
        MVI     B,0             ; Digit counter (a counter for how many digits are pushed during conversion)
        
; helpers to PRTNNUM (it never returns so it keeps going)

; Extracts and stores digits in reverse order for later printing
; if you feed in 123 (in hex) it will output 321 in binary
PRTN1:  
        LXI     D,10            ; load divisor
        CALL    DIVIDE          ; HL/ 10, A = HL%10
        ADI     '0'             ; Convert remainder to ASCII
        PUSH    PSW             ; Save digit to stack
        INR     B               ; Incriment digit counter
; Checks if quotient reached 0, if not keep converting
        MOV     A,H             ; CHECK IF DONE
        ORA     L
        JNZ     PRTN1           ; CONTINUE IF NOT ZERO
        
; Prints digits in the correct order
; this then takes that 321 and flips it to the proper 123
PRTN2:  
        POP     PSW             ; Get digit
        CALL    CO              ; Print digit
        DCR     B               ; Deincriment counter
        JNZ     PRTN2           ; Continue till stack is empty
        RET

; DIVIDE HL BY 10, RESULT IN HL, REMAINDER IN A
DIVIDE: 
        PUSH    B
        PUSH    D
        LXI     B,0             ; BC WILL HOLD RESULT
        LXI     D,10            ; DIVISOR
DIV1:   
        MOV     A,H             ; Check high byte first
        ORA     A               ; Is H zero?
        JNZ     DIV2            ; If not, HL >= 256, continue dividing
        MOV     A,L             ; Check low byte
        CMP     E               ; Compare with 10
        JC      DIV3            ; If L < 10, done
DIV2:   
        MOV     A,L             ; SUBTRACT 10 FROM HL
        SUB     E
        MOV     L,A
        MOV     A,H
        SBB     D
        MOV     H,A
        INX     B               ; INCREMENT RESULT
        JMP     DIV1
DIV3:   
        MOV     A,L             ; REMAINDER TO A
        MOV     H,B             ; RESULT TO HL
        MOV     L,C
        POP     D
        POP     B
        RET

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

INBUF:  DS      83              ; LINE INPUT BUFFER

; SET UP STACK SPACE
        DS      64              ; 40H LOCATIONS
STAK:   DB      0               ; TOP OF STACK

        END

