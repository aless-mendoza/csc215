int atoi(s)
char *s;
{
    char *p;
    p=s;
    int n, sign, digit;
    n=0;
    sign=1;
    digit=0;

    if (*p == '+' || *p == '-') {
        if (*p == '-') sign = -1;
        p++;
    }

    while (*p >= '0' && *p <= '9') {
        n = n * 10 + (*p - '0');
        p++;
        digit = 1;
    }

    if (!digit){
        printf("!THIS ISN'T AN INT!");
        return 0;
    }
    return (n) ;
}
