#include "linklist.h"
#include <stdio.h>

int lsize(list) /* stolen from other ppl, required to make prn work */
struct node* list;
{
  int length;
  length = 0;

  while (list != NULL) {
    length++;
    list = list->next;
  }

  return length;
}

struct node* mknode(n)
int n;
{
  struct node* x;
  x = alloc(4);
  x->num = n;
  x->next = NULL;
  return x;
}

struct node* insert(list, data) /* stolen from other ppl, required to test properly */
struct node* list;
int data;
{
  struct node* current;
  struct node* node;

  node = mknode(data);

  if (list == NULL) {
    return node;
  }

  current = list;
  while (current->next != NULL) {
    current = current->next;
  }

  current->next = node;
  return list;
}

char* prnlist(list)
struct node* list;
{
  char *buffer;
  char *node;
  int i;

  buffer = alloc(lsize(list) * 7);
  sprintf(buffer, "%s", "[");
  do {
    sprintf(buffer, "%s%d", buffer, list->num);
    if (list->next != NULL) {
      sprintf(buffer, "%s%s", buffer, ", ");
    }
  } while ((list = list->next) != NULL);
  sprintf(buffer, "%s]", buffer);
  return (buffer);
}
