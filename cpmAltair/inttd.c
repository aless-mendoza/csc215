#include "BIGINT.H"
#include "BDSCTEST.H"

main() {
    START_TESTING("BIGINTTD.C");

    TEST_CASE("Read and write bigint 1234567") {
        struct bigint bi;
        set_bigint("1234567", &bi);
        ASSERT_STR(get_bigint(bi), "1234567");
    }

    TEST_CASE("Addition Test"){
        struct bigint bi1;
        struct bigint bi2;
        struct bigint biout;

        set_bigint("1234567", &bi1);
        set_bigint("9999999", &bi2);

        ASSERT_STR(get_bigint(bi1), "1234567");
        ASSERT_STR(get_bigint(bi2), "9999999");

        add_bigint(bi1,bi2,biout);

        ASSERT_STR(get_bigint(biout), "11234566");
    }

    END_TESTING();
}

