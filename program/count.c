#include <stdio.h>

#define SEEK_CUR 1

int main(argc, argv)
int argc;
char* argv[];
{
    FILE *infp, *outfp;
    int len, c, lineno;
    char chr;
    char linbuf[MAXLINE];
    if (argc != 3) {
        printf("Usage: copy <infile> <outfile>\n");
        return;
    }
    printf("\nADDING VALUES TO %s...\n\n", argv[2]);
    if ((infp = fopen(argv[1], "r")) == NULL) {
        printf("Can’t open %s\n", argv[1]);
        exit();
    }
    if ((outfp = fopen(argv[2], "w")) == NULL) {
        printf("Can’t open %s\n", argv[2]);
        exit();
    }
    while((c = fgetc(infp)) != EOF) {
        while (fgets(linbuf, MAXLINE, infp)){
            if (c == '\n') {
                fprintf(outfp, "%d: ", len);
            }
            fprintf(outfp, "%3d: %s", lineno++, linbuf);
            len++;
        }

    }

    fclose(infp);
    fclose(outfp);
}
