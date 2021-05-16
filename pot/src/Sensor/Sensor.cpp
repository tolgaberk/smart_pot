#include "Sensor.h"

Sensor::Sensor(int pinNumberOnMp, PotData *pot_data, Multiplexer *mp)
{
    this->pinNumberOnMp = pinNumberOnMp;
    this->potData = pot_data;
    this->mp = mp;
    this->value = -1;
    this->last_read = millis();
}

float *Sensor::readValue()
{
    unsigned long fromStart = millis();
    if ((fromStart - last_read) > SAMPLING_INTERVAL)
    {
        this->setActive();
        delayMicroseconds(50);
        last_read = fromStart;
        value = analogRead(A0);
        delayMicroseconds(50);
    }
    return &value;
}

void Sensor::setActive()
{
    if (this->pinNumberOnMp == 0)
    {
        return this->mp->setControlPins(0, 0);
    }
    if (this->pinNumberOnMp == 1)
    {
        return this->mp->setControlPins(1, 0);
    }
    if (this->pinNumberOnMp == 2)
    {
        return this->mp->setControlPins(0, 1);
    }
    if (this->pinNumberOnMp == 3)
    {
        return this->mp->setControlPins(1, 1);
    }
}

int Sensor::getPinOnMp()
{
    return pinNumberOnMp;
}

Sensor::~Sensor()
{
}
