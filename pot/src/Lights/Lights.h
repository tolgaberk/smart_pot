#include <Arduino.h>
#include "PotData/PotData.h"

#define MILISECONDS_IN_DAY 86400000
class Lights
{
private:
    int pin;
    PotData *potData;
    bool isWorking;
    bool forced;
    unsigned long force_start_time;

    void turnOn();
    void turnOff();

public:
    Lights();
    void setup(int pin, PotData *potData);
    void work();
    void toggle();
    ~Lights();
};
