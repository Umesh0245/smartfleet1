from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Telemetry(BaseModel):
    vehicleId: str
    speed: float | None = None
    fuel: float | None = None
    engineTemp: float | None = None
    lat: float | None = None
    lon: float | None = None
    timestamp: int | None = None

@app.post('/predict/anomaly')
def predict_anomaly(t: Telemetry):
    if t.speed and t.speed > 120:
        return {'anomaly': True, 'reason': 'overspeed', 'severity': 0.9}
    return {'anomaly': False, 'severity': 0.0}

@app.get('/alerts')
def alerts():
    return [{'vehicleId':'VH001', 'type':'rul', 'severity':'medium'}]
