// ADD 3 NUMBERS
// BY ALESSANDRA AND DYLAN

#include <stdio.h>

int main(argc, argv)
int argc;
char* argv[];
{
    FILE *infp, *outfp;
    int num1, num2, sum;
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
    while(fscanf(infp, "%d", &num1)==1) {
        if (fscanf(infp, "%d", &num2)==1) {
        sum = num1 + num2;
        fprintf(outfp, "%d\n", sum);
        }
    }

    fclose(infp);
    fclose(outfp);
}
