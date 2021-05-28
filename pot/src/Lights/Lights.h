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
    unsigned long cumulative_light_exposure;
    unsigned long last_loop_time;
    bool over_exposed;
    bool sunlight_is_enough;

    void turnOn();
    void turnOff();
    void checkDay();
    void switchLights();

    int getDarknessDensity();

public:
    Lights();
    void setup(int pin, PotData *potData);
    void work();
    void toggle();
    ~Lights();
};
