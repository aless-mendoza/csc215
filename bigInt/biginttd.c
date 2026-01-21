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
        /* TEST 1: 1234567 + 9999999 = 11234566 */
        struct bigint bi1;
        struct bigint bi2;
        struct bigint biout;

        set_bigint("1234567", &bi1);
        set_bigint("9999999", &bi2);

        add_bigint(bi1,bi2,biout);

        ASSERT_STR(get_bigint(biout), "11234566");

        /* TEST 2: 987654321 + 123456789 = 1111111110 */
        set_bigint("987654321", &bi1);
        set_bigint("123456789", &bi2);

        add_bigint(bi1,bi2,biout);

        ASSERT_STR(get_bigint(biout), "1111111110");
    }

    TEST_CASE("Subtraction Test"){
        /* TEST 1: 1234567 - 9999999 = -8765432 */
        set_bigint("1234567", &bi1);
        set_bigint("-9999999", &bi2);
        
        add_bigint(bi1,bi2,biout);

        ASSERT_STR(get_bigint(biout), "-8765432");

        /* TEST 2: 987654321 - 123456789 = 864197532 */
        set_bigint("987654321", &bi1);
        set_bigint("-123456789", &bi2);

        add_bigint(bi1,bi2,biout);

        ASSERT_STR(get_bigint(biout), "864197532");
    }

    END_TESTING();
}

