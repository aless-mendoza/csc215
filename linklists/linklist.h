#ifndef LINKLIST_H
#define LINKLIST_H

struct node {
  int num;
  struct node* next;
};

struct node* mknode(int n);

char* prnlist(struct node* list);
int lsize(struct node* list);
int isempty(struct node* list);
struct node* insert(struct node* list, int data);
int remove(struct node* list, int data);
void dellst(struct node* list);

#endif //LINKLIST_H