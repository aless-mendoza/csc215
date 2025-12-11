#include <stdio.h>
#include <atoi.h>
#include <itoa.h>
#include <reverse.h>

#define MAXLINE 1024

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
        \*
        itoa(linbuf);
        printf("---\nITOA: %s", linbuf);
        fprintf(outfp, "---\nITOA: %s", linbuf);
        *\
        atoi(linbuf);
        printf("\nATOI: %s", linbuf);
        fprintf(outfp, "\nATOI: %s", linbuf);
        reverse(linbuf);
        printf("\nREVERSE: %s\n---\n", linbuf);
        fprintf(outfp, "\nREVERSE: %s\n---\n", linbuf);
    }
    fclose(infp);
    fclose(outfp);
}
