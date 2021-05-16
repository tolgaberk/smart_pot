#include <Arduino.h>
#include "PotData/PotData.h"
class Pump
{
private:
    int pin;
    PotData *potData;
    bool isWorking;
    unsigned long last_watered_at;

    void turnOn();
    void turnOff();

public:
    Pump();
    void setup(int pin, PotData *potData);
    void forceWork();
    void work();
    ~Pump();
};
