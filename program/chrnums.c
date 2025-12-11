#include <stdio.h>

#define MAXLINE 1024

int main(argc, argv)
int argc;
char* argv[];
{
    FILE *infp, *outfp;
    int charnum, c;
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
        charnum = 0;
        for (c = 0; linbuf[c] != '\0'; c++)
            charnum++;
        printf("%d: %s", charnum, linbuf);
        fprintf(outfp, "%d: %s", charnum, linbuf);
    }

    fclose(infp);
    fclose(outfp);
}
