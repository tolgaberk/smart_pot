#include <Arduino.h>

#ifndef MultiH
#define MultiH
class Multiplexer
{
private:
    int c1, c2;
    int activePin;

public:
    void setControlPins(bool c1, bool c2);
    Multiplexer(int c1, int c2);
    ~Multiplexer();
    void setup();
    void test();
    int readValue();
};
#endif
/*
c1 => d5
c2 => d6

3=>?
2=>?
1=> moisture sensor
0=> light sensor



D0  => 16;
D1  => 5;
D2  => 4;
D3  => 0;
D4  => 2;
D5  => 14;
D6  => 12;
D7  => 13;
D8  => 15;
D9  => 3;
D10 => 1;
*/