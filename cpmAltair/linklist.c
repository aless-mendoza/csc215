#include <stdio.h>
#include "LINKLIST.H"
#define NULL 0

struct node *mknode(n) int n; {
    struct node* x;
    x = alloc(4);
    x->num = n;
    x->next = NULL;
    return x;
}
