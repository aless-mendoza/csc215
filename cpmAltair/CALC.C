#include <stdio.h>
#define BAD_OP  '\0'
/*
This program implements a three function calculator as the first step to a
test program for bignum struct.
*/
int main()
{
    int accumulator, input, op;
    accumulator = 0;
    /* Set op to '+' so first entered value is added to zero. */
    op = '+';
    while (op != '=')
    {
        printf("Enter value: ");
        scanf("%d", &input);
        switch (op)
        {
            case '+':
                accumulator += input;
                break;
            case '-':
                accumulator -= input;
                break;
            case '*':
                accumulator *= input;
                break;
            default:
                printf("Error with operator\n");
       }
       printf("--> %d\n", accumulator);
       op = get_operator();
    }
}

char string_to_op(s)
char* s;
{
    if (s[0] == '=' || s[0] == '+' || s[0] == '-' || s[0] == '*')
        return s[0];
    return BAD_OP;
}

char get_operator() {
    char* op_str;
    char op;

    do {
        printf("Enter + - * ( = to quit) ");
        scanf("%s", op_str);
    } while ((op = string_to_op(op_str)) == BAD_OP);

    return op;
}
