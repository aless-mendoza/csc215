char *itoa(n, s)
int n;
char *s;
{
    char *p;
    p=s;

    while (n>0) {
        *p++ = '0' + (n % 10);
        n /= 10;
    }
    if (n < 0){
        *p++ = '-';
    }
    return (s) ;
}
