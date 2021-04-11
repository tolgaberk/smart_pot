#include "Sensor.h"

Sensor::Sensor(int pinNumber, int controlPinNumber, PotData *pot_data)
{
    pin = pinNumber;
    controlPin = controlPinNumber;
    pinMode(controlPin, OUTPUT);
    potData = pot_data;
    value = -1;
    last_read = millis();
}

float *Sensor::readValue()
{
    if ((millis() - last_read) > SAMPLING_INTERVAL)
    {
        digitalWrite(controlPin, HIGH);
        delay(500);
        last_read = millis();
        value = analogRead(pin);
        delay(500);
        digitalWrite(controlPin, LOW);
    }
    return &value;
}

Sensor::~Sensor()
{
}
