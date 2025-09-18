# Negativity Presentation
# By Dylan and Alessandra
# returns 1 for an odd number and 2 for an even
3A # 00 LDA 40      Load A from 0040
40 # 01 (address)
00 # 02 (address)
21 # 03 LXI
50 # 04 (address)
00 # 05 (address)
96 # 06 SUB M      Subtract the value pointed by HL -> store in A
FA # 07 JM
10 # 08 (address)
00 # 09 (address)
3E # 0A MVI        A = 02 (positive)
02 # 0B 02
32 # 0C STA        Store A at 0060
60 # 0D (address)        
00 # 0E (address)
76 # 0F HLT
3E # 10 MVI        A = 01 (negative)
01 # 11 01
32 # 12 STA        Store A at 0060
60 # 13 (address)        
00 # 14 (address)
76 # 15 HLT        Halt
===
40:03
50:01
