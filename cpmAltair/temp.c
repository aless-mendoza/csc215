#include "LINKLIST.H"

main() {
  struct node* yournode;
  yournode = mknode(42);
  printf(prnlist(yournode));
  return 0;
}
