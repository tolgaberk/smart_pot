#include <Arduino.h>
#include <WiFiManager.h>
#include <DHTesp.h>

#include "Sensor/Sensor.h"
#include "PotData/PotData.h"
#include "Api/Api.h"
#include "Pump/Pump.h"
#include "Lights/Lights.h"

Api api{"http://cuaracilar.tk:5555"};

PotData globalPotData{&api};

Sensor soilMoistureSensor{A0, D1, &globalPotData};
Sensor tankWaterLevelSensor{A0, D3, &globalPotData};
Sensor closeLightSensor{A0, D2, &globalPotData};

// Pump pump{D6, &globalPotData};

Lights lights;

DHTesp envTempHumidSensor;
WiFiManager wifiManager;

void setup()
{
  pinMode(A0, INPUT);
  Serial.begin(9600);
  wifiManager.autoConnect("Smava_Smart_Pot");

  //
  lights.setup(D5, &globalPotData);
  globalPotData.setPotId(api.registerDevice());

  envTempHumidSensor.setup(D0, DHTesp::DHT11);
}

void loop()
{
  globalPotData.soil_moisture = *soilMoistureSensor.readValue();
  globalPotData.tank_filled_ratio = *tankWaterLevelSensor.readValue();
  globalPotData.close_light_density = *closeLightSensor.readValue();

  float envHumid = envTempHumidSensor.getHumidity();
  if (isnan(envHumid) == false)
  {
    globalPotData.environment_humidity = envHumid;
  }

  float envTemp = envTempHumidSensor.getTemperature();
  if (isnan(envTemp) == false)
  {
    globalPotData.environment_temp = envTemp;
  }

  // pump.work();
  lights.work();
  globalPotData.print();
  globalPotData.sendPotData();
  delay(1000);
}
