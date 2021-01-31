#include <Arduino.h>
#include "PotData/PotData.h"
class Lights
{
private:
    int pin;
    PotData *potData;
    bool isWorking;

public:
    Lights(int pin, PotData *potData);
    void work();
    ~Lights();
};
