#include "Multiplexer.h"
#include "./Sensor/Sensor.h"

Multiplexer::Multiplexer(int c1, int c2)
{
    this->c1 = c1;
    this->c2 = c2;
}

void Multiplexer::setup()
{
    pinMode(c1, OUTPUT);
    pinMode(c2, OUTPUT);
}
void Multiplexer::test()
{
    this->setControlPins(0, 0);
    Serial.println("listening to pin 0");
    for (int i = 0; i < 10; i++)
    {
        int value = analogRead(A0);
        Serial.println(value);
        delay(100);
    }
    this->setControlPins(1, 0);
    Serial.println("listening to pin 1");
    for (int i = 0; i < 10; i++)
    {
        int value = analogRead(A0);
        Serial.println(value);
        delay(100);
    }
    this->setControlPins(0, 1);
    Serial.println("listening to pin 2");
    for (int i = 0; i < 10; i++)
    {
        int value = analogRead(A0);
        Serial.println(value);
        delay(100);
    }
    this->setControlPins(1, 1);
    Serial.println("listening to pin 3");
    for (int i = 0; i < 10; i++)
    {
        int value = analogRead(A0);
        Serial.println(value);
        delay(100);
    }
}

void Multiplexer::setControlPins(bool c1, bool c2)
{
    digitalWrite(this->c1, c1 == 1 ? HIGH : LOW);
    digitalWrite(this->c2, c2 == 1 ? HIGH : LOW);
}

Multiplexer::~Multiplexer() {}