struct bigint {
    char negative;
    char numdigits;
    char* digits;
};

void set_bigint();
char* get_bigint();
