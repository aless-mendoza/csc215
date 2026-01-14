#include <stdio.h>
#include "BIGINT.H"

void set_bigint(numstr, num)
char *numstr;
struct bigint *num;
{
    char last_pos, i;
    num->negative = (numstr[0] == '-');
    num->numdigits = strlen(numstr) - num->negative;
    num->digits = alloc(num->numdigits);
    last_pos = num->numdigits + (num->negative ? 0 : -1);

    for (i = 0; i < num->numdigits; i++) {
        num->digits[i] = numstr[last_pos-i];
        /* printf("numstr[%d] is %c\n", last_pos-i, numstr[last_pos-i]); */
    }
}

void add_bigint(a, b, res)
struct bigint *a;
struct bigint *b;
struct bigint *res;
{
    int i, maxd, carry, da, db, s;
    /* same sign -> add magnitudes, keep sign */
    if (a->negative == b->negative) {
        maxd = (a->numdigits > b->numdigits) ? a->numdigits : b->numdigits;
        carry = 0;
        res->digits = alloc(maxd + 1); /* possible extra digit for carry */
        for (i = 0; i < maxd; i++) {
            da = (i < a->numdigits) ? (a->digits[i] - '0') : 0;
            db = (i < b->numdigits) ? (b->digits[i] - '0') : 0;
            s = da + db + carry;
            res->digits[i] = '0' + (s % 10);
            carry = s / 10;
        }
        if (carry) {
            res->digits[maxd] = '0' + carry;
            res->numdigits = maxd + 1;
        } else {
            res->numdigits = maxd;
        }
        res->negative = a->negative;
    } else {
        int cmp, borrow, dl, ds, diff, nd;
        /* different signs -> subtraction of magnitudes */
        struct bigint *larger, *smaller;
        if (cmp == 0) {
            /* result is zero */
            res->numdigits = 1;
            res->digits = alloc(1);
            res->digits[0] = '0';
            res->negative = 0;
            return;
        } else if (cmp > 0) {
            larger = a;
            smaller = b;
            res->negative = a->negative; /* sign of larger magnitude */
        } else {
            larger = b;
            smaller = a;
            res->negative = b->negative;
        }
        res->digits = alloc(larger->numdigits);
        borrow = 0;
        for (i = 0; i < larger->numdigits; i++) {
            dl = (larger->digits[i] - '0');
            ds = (i < smaller->numdigits) ? (smaller->digits[i] - '0') : 0;
            diff = dl - ds - borrow;
            if (diff < 0) {
                diff += 10;
                borrow = 1;
            } else {
                borrow = 0;
            }
            res->digits[i] = '0' + diff;
        }
        /* trim leading zeros from the most-significant side */
        nd = larger->numdigits;
        while (nd > 1 && res->digits[nd - 1] == '0') nd--;
        res->numdigits = nd;
    }
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
