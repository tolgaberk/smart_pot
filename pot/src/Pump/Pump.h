#include <Arduino.h>
#include "PotData/PotData.h"
class Pump
{
private:
    int pin;
    PotData *potData;
    bool isWorking;
    unsigned long last_watered_at;

public:
    Pump(int pin, PotData *potData);
    void work();
    ~Pump();
};
