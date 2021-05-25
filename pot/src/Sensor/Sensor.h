#include "./PotData/PotData.h"
#include "./Multiplexer/Multiplexer.h"
#include <Arduino.h>

#define SAMPLING_INTERVAL 1

class Sensor
{
protected:
    float value;
    int pinNumberOnMp;
    unsigned long last_read;
    PotData *potData;
    Multiplexer *mp;
    void setActive();

public:
    Sensor(int pinNumberOnMp, PotData *pot_data, Multiplexer *mp);
    Sensor();
    ~Sensor();
    int getPinOnMp();
    float *readValue();
};
