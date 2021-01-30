#include <Arduino.h>
#include <WiFiManager.h>
#include <ESP8266HTTPClient.h>
#include <DHTesp.h>

WiFiManager wifiManager;
WiFiClient wfClient;
HTTPClient http;
DHTesp dht;

String pot_url = "http://192.168.1.109:3030/pot-data";

void setup()
{

  Serial.begin(9600);
  // put your setup code here, to run once:
  wifiManager.autoConnect("Smava_Smart_Pot");
  pinMode(A0, INPUT);
  pinMode(D0, OUTPUT);
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D5, INPUT);
  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);

  dht.setup(D5, DHTesp::DHT11);
}

void requestData(void);
void createPotData(String pot_data);
void getTemperatureData(void);
void getDirtMoisture(int number);
void getLightData(int number);
void turnOffAll(void);
void testMotor(void);

void loop()
{
  digitalWrite(LED_BUILTIN, LOW);
  delay(25);
  digitalWrite(LED_BUILTIN, HIGH);

  turnOffAll();
  digitalWrite(D0, HIGH);
  delay(25);
  getLightData(1);

  turnOffAll();

  digitalWrite(D1, HIGH);
  delay(25);
  getLightData(2);
  turnOffAll();

  digitalWrite(D2, HIGH);
  delay(25);
  getDirtMoisture(1);
  turnOffAll();

  digitalWrite(D3, HIGH);
  delay(25);
  getDirtMoisture(2);
  testMotor();
  turnOffAll();
  Serial.println("");
  // getTemperatureData();
}

void testMotor()
{
  float val = analogRead(A0);
  float calcVal = ((1024 - val) / 1024) * 100;
  Serial.print("\n MOTOR VALUE => ");
  Serial.print(calcVal);

  if (calcVal < 40)
  {
    Serial.print("\t\t MOTOR RUNNING");
    digitalWrite(D6, HIGH);
  }
  else
  {
    Serial.print("\t\t MOTOR STOPPED");
    digitalWrite(D6, LOW);
  }
  Serial.println("");
}

void turnOffAll()
{
  digitalWrite(D0, LOW);
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
}

void getLightData(int number)
{
  float val = analogRead(A0);
  Serial.print("\tLight ");
  Serial.print(number);
  Serial.print("=> \t");
  Serial.print(((1024 - val) / 1024) * 100);
}

void getDirtMoisture(int number)
{
  float val = analogRead(A0);
  Serial.print("\tDirt ");
  Serial.print(number);
  Serial.print("=> \t");
  Serial.print(((1024 - val) / 1024) * 100);
}

void getTemperatureData()
{

  float humidity = dht.getHumidity();
  float temperature = dht.getTemperature();

  Serial.print(dht.getStatusString());
  Serial.print("\t");
  Serial.print(humidity, 1);
  Serial.print("\t\t");
  Serial.print(temperature, 1);
  Serial.print("\t\t");
  Serial.print(dht.computeHeatIndex(temperature, humidity, false), 1);
  Serial.println("");
}

void createPotData(String pot_data)
{
  http.begin(wfClient, pot_url);
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(pot_data);
  if (httpCode == HTTP_CODE_OK)
  {
    String data = http.getString();
    Serial.println(data);
  }
  http.end();
}

void requestData()
{
  http.begin(wfClient, pot_url);
  int httpCode = http.GET();
  if (httpCode > 0)
  {
    String data = http.getString();
    Serial.println(data);
  }
  http.end();
}