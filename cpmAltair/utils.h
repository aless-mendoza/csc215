strcpy(d, s)
    char* d;
    char* s;
{
  while (*s) *d++ = *s++;
  *d = '\0';
}

strcat(s, t)
    char *s;
    char *t;
{
    while (*s != '\0') {
      s++;
    }
    while ((*s = *t) != '\0') {
      s++;
      t++;
    }
}

atoi(s)
    char *s;
{
    int i, n;
    n = 0;
    while (*s >= '0' && *s <= '9') {
      n = n * 10 + *s - '0';
      s++;
    }
    return (n) ;
}

reverse(str)
	char *str;
{
    char *e, temp;

    e = str;

    while (*e != '\0') {
        e++;
    }
    e--;

    while (str < e) {
        temp = *str;
        *str = *e;
        *e = temp;
        str++;
        e--;
    }
}

itoa(n, s)
    int n;
    char *s;
{
  int sn;
  char* start;

  start = s;

  if ((sn = n) < 0) {
    n = -n;
  }

  do {
    *s = n % 10 + '0';
    s++;
  } while ((n /= 10) != 0);

  if (sn < 0) {
    *s = '-';
    s++;
  }

  *s = '\0';
  reverse(start);
}
