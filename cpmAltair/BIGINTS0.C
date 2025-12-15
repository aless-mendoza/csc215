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
    printf("bint1.negative is %d\n", bint1.negative);
    printf("bint1.numdigits is %d\n", bint1.numdigits);
    set_bigint("424", &bint2);
    set_bigint("-17", &bint3);
}

void set_bigint(numstr, num)
char *numstr;
struct bigint *num;
{

    num->negative = (numstr[0] == '-');
    num->numdigits = strlen(numstr) - num->negative;

    printf("first char is %c\n", numstr[0]);
    printf("numstr length is %d\n", strlen(numstr));
    printf("numstr[0] == '-' is %d\n", numstr[0] == '-');
    printf("num->negative is %d\n", num->negative);
    printf("num->numdigits is %d\n", num->numdigits);
}
