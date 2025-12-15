#include <stdio.h>

#define MAXLINE 1024

reverse(s)
char s[];
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


int main(argc, argv)
int argc;
char* argv[];
{
    FILE *infp, *outfp;
    char linbuf[MAXLINE];
    if (argc != 3) {
        printf("Usage: copy <infile> <outfile>\n");
        return;
    }
    if ((infp = fopen(argv[1], "r")) == NULL) {
        printf("Can’t open %s\n", argv[1]);
        exit();
    }
    if ((outfp = fopen(argv[2], "w")) == NULL) {
        printf("Can’t open %s\n", argv[2]);
        exit();
    }
    while (fgets(linbuf, MAXLINE, infp)) {
        reverse(linbuf);
        printf("%s\n", linbuf);
        fprintf(outfp, "%s\n", linbuf);
    }
    fclose(infp);
    fclose(outfp);
}
