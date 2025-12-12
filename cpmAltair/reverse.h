reverse(s)
char *s;
{
    int i,j,len;
    char temp;
    len = 0;
    while (s[len] !=0){
        len++;
    }
    if (len >0 && s[len-1] =='\n'){
        s[len-1]='\0';
        len--;
    }
    for (i = 0, j = len - 1; i < j; i++, j--) {
        temp = s[i];
        s[i] = s[j];
        s[j] = temp;
    }
}
