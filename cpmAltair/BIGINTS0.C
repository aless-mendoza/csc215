#include <stdio.h>
/*
This is a test program for bigint struct.
*/

struct bigint {
    char negative;
    char numdigits;
    char* digits;
};

int main()
{
    struct bigint bint1, bint2, bint3;
    set_bigint("1234567", &bint1);
    printf("bint1 is: %s\n", get_bigint(bint1));
    printf("bint1.negative is %d\n", bint1.negative);
    printf("bint1.numdigits is %d\n", bint1.numdigits);
    set_bigint("424", &bint2);
    printf("bint2 is: %s\n", get_bigint(bint2));
    set_bigint("-17", &bint3);
    printf("bint3 is: %s\n", get_bigint(bint3));
    set_bigint("65536", &bint3);
    printf("bint3 is: %s\n", get_bigint(bint3));
}

void set_bigint(numstr, num)
char *numstr;
struct bigint *num;
{

    num->negative = (numstr[0] == '-');
    num->numdigits = strlen(numstr) - num->negative;

    printf("\n------------\n");
    printf("first char is %c\n", numstr[0]);
    printf("numstr length is %d\n", strlen(numstr));
    printf("numstr[0] == '-' is %d\n", numstr[0] == '-');
    printf("num->negative is %d\n", num->negative);
    printf("num->numdigits is %d\n", num->numdigits);

}

char* get_bigint(num)
struct bigint *num;
{
   char *numstr;
   char start_pos, i;
   numstr = alloc(num->numdigits + (num->negative ? 2 : 1));
   start_pos = num->negative;
   if (start_pos == 1) numstr[0] = '-';
   for (i = 0; i < num->numdigits; i++) {
       numstr[i+start_pos] = num->digits[num->numdigits-(i+1)];
       /* printf("numstr[%d] is %c\n", i, numstr[i+start_pos]); */
   }
   numstr[num->numdigits+start_pos] = '\0';
   return numstr;
}
