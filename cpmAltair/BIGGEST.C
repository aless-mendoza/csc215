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
    printf("\n^This has to do with byte overflow\n");
    
    printf("--------------\nJeffTest\n");
    n =  65000;
    m = 3;
    prod = n * m;
    printf("%u * %u = %u -- Why?\n", m, n, prod);
    printf("\n^This has to do with byte overflow\n");

    printf("--------------\nTest 1 - Negativity\n");
    biggest = 0;
    ubiggest = 0;
    printf("The value of biggest is now %d.\n", biggest);
    printf("The value of ubiggest is now %u.\n", ubiggest);
    biggest--;
    ubiggest--;
    printf("Minus 1 to it and we get %u!\n", biggest);
    printf("Minus 1 to it and we get %d!\n", ubiggest);
    printf("\n^This has to do with how the bytes that identify negativity are interpretted\n");

    printf("--------------\nTest 2 - Adding Part two\n");
    biggest = 65535;
    printf("The value of biggest is now %d.\n", biggest);
    biggest++;
    printf("Add 1 to it and we get %u!\n", biggest);
    biggest = 65534;
    printf("The value of biggest is now %d.\n", biggest);
    biggest++;
    printf("Add 1 to it and we get %u!\n", biggest);
    printf("\n^This has to do with the bytes that identify numbers are negative\n");

}
