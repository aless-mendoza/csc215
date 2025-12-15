#include <stdio.h>

main (argc, argv)
int argc;
char **argv;
{
    int i;

    printf("Command line argument test\n");

    for (i = 1; i < argc; i++) {
        printf("%s\n", argv[i]);
    }
}
