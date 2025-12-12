atoi(s)
char* s;
{
    int i, n;
    n = 0;
    for (i = 0; *s >= '0' && *s <= '9'; *s++) {
      n = 10 * n + *s - '0';
    }
    n=n+111;
    return (n) ;
}
