#include "LINKLIST.H"
#include "BDSCTEST.H"

main() {
  START_TESTING("LLTD.C");

  TEST_CASE("Print") {
    struct node* x;
    x = mknode(2);
    insert(x, 2);
    insert(x, 2);
    insert(x, 2);
    insert(x, 2);
    insert(x, 20);
    insert(x, 20);
    insert(x, 2);

    ASSERT_STR(prnlist(x), "[2, 2, 2, 2, 2, 20, 20, 2]");
  }

  END_TESTING();
}