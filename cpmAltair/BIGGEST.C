#include <stdio.h>

main() {
    int biggest;
    unsigned ubiggest;
    unsigned n, m, prod;
    printf("--------------\nJeffTest\n");
    biggest = 32767;
    ubiggest = 65535;
    printf("The value of biggest is now %d.\n", biggest);
    printf("The value of ubiggest is now %u.\n", ubiggest);
    biggest++;
    ubiggest++;
    printf("Add 1 to it and we get %u!\n", biggest);
    printf("Add 1 to it and we get %d!\n", ubiggest);
    printf("--------------\nJeffTest\n");
    n =  65000;
    m = 3;
    prod = n * m;
    printf("%u * %u = %u -- Why?\n", m, n, prod);

    printf("--------------\nTest 1\n");
    biggest = 0;
    ubiggest = 0;
    printf("The value of biggest is now %d.\n", biggest);
    printf("The value of ubiggest is now %u.\n", ubiggest);
    biggest--;
    ubiggest--;
    printf("Minus 1 to it and we get %u!\n", biggest);
    printf("Minus 1 to it and we get %d!\n", ubiggest);
}
