# Even or Odd Presentation
# By Noah and Alessandra
# returns 1 for an odd number and 2 for an even
3A # 00 LDA 40      Load A from 0040
40 # 01
00 # 02
E6 # 03 ANI 01     A=A and 01 (tests bit 0)
01 # 04
CA # 05 JZ 000C    Jump to 000C (Only if even)
0E # 06
00 # 07
3E # 08 MVI A, 02  A=01 (Odd)
01 # 09 
32 # 0A STA 0050   Store at 0050
50 # 0B
00 # 0C
76 # 0D HLT        Halt
3E # 0D MVI A, 01  A=02 (Even)
02 # 0F
32 # 10 STA 0050   Store are 0050
50 # 11
00 # 12
76 # 13 HLT        Halt
