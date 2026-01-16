#include "LINKLIST.H"
#include "BDSCTEST.H"
#define NULL 0

main() {
  START_TESTING("LINKLIST.C");

  TEST_CASE("Test can create node") {
      struct node* mynode;
      mynode = mknode(42);
      ASSERT(mynode->num == 42);
      ASSERT(mynode->next == NULL);
  }

  TEST_CASE("print list test"){
      struct node* yournode;
      yournode = mknode(42);
      printf("\n");
      printf(prnlist(yournode));
      printf("\n");
      ASSERT_STR(prnlist(yournode) == "[]");
  }

  END_TESTING();
}
