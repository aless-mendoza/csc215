#include <stdio.h>

main (argc, argv)
int argc;
char **argv;
{
    int i;
    int j;
    int sum;
    sum = 0;
    printf("ADDING INPUTS \n \n");
    for (i = 1; i < argc; i++) {
        for (j = 0; argv[i][j] != '\0'; j++){
            if (argv[i][j] < '0' || argv[i][j] > '9'){
                printf("%s IS NOT A NUMBER SILLY!", argv[i]);
                return -1;
            }
        }
        sum += atoi(argv[i]);
    }
    printf("YOUR SUM IS: %u", sum);
    return 0;
}
