#include "./PotData/PotData.h"
#include <Arduino.h>

#define SAMPLING_INTERVAL 2000

class Sensor
{
protected:
    float value;
    int pin;
    int controlPin;
    unsigned long last_read;
    PotData *potData;

public:
    Sensor(int pin, int controlPin, PotData *pot_data);
    Sensor();
    ~Sensor();
    virtual float *readValue();
};
