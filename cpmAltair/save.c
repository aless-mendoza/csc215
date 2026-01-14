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
        /* 1234567 + 9999999 = 11234566 */
        struct bigint bi1;
        struct bigint bi2;
        struct bigint biout;

        set_bigint("1234567", &bi1);
        set_bigint("9999999", &bi2);

        add_bigint(bi1,bi2,biout);

        ASSERT_STR(get_bigint(biout), "11234566");

        /* 987654321 + 123456789 = 1111111110 */
        struct bigint bi3;
        struct bigint bi4;
        struct bigint biout2;

        set_bigint("987654321", &bi3);
        set_bigint("123456789", &bi4);

        add_bigint(bi3,bi4,biout2);

        ASSERT_STR(get_bigint(biout2), "1111111110");
    }

    TEST_CASE("Subtraction Test"){
        /* 1234567 - 9999999 = -8765432 */
        struct bigint bi5;
        struct bigint bi6;
        struct bigint biout3;

        set_bigint("1234567", &bi5);
        set_bigint("-9999999", &bi6);
        
        add_bigint(bi5,bi6,biout3);

        ASSERT_STR(get_bigint(biout3), "-8765432");

        /* 987654321 - 123456789 = 864197532 */
        struct bigint bi7;
        struct bigint bi8;
        struct bigint biout4;

        set_bigint("987654321", &bi7);
        set_bigint("-123456789", &bi8);

        add_bigint(bi7,bi8,biout4);

        ASSERT_STR(get_bigint(biout4), "864197532");
    }

    END_TESTING();
}

