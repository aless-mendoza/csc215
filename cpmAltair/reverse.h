reverse(s)
char *s;
{
    char *p, *i, *j, temp;
    while (*p !=0){
        *p++;
    }
    if (*p >0 && *(p-1) =='\n'){
        *(p-1)='\0';
        *p--;
    }
    for (i = s, j = p - 1; i < j; i++, j--) {
        temp = *i;
        *i = *j;
        *j = temp;
    }
}
