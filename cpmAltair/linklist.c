#include <stdio.h>
#include "LINKLIST.H"
#include "utils.h"
#define NULL 0

struct node *mknode(n) int n; {
    struct node* x;
    x = alloc(4);
    x->num = n;
    x->next = NULL;
    return x;
}

char* prnlist (list)
struct node* list;
{
    char* str;
    char* str2;
    int mem;
    mem = 1;
    str2 = "[";
    while (list->next != 0){
        char str3[7];
        sprintf(str3, "%d", list->num);
        printf("Str3: \n");
        printf(str3);
        mem += strlen(str3)+2;
        str = alloc(mem);
        strcpy(str, str2);
        strcat(str, str3);
        strcat(str, ">>");
        printf(str);
        str2=alloc(mem);
        strcpy(str2, str);
    }
    strcat(str, "]");
    return str;
}
