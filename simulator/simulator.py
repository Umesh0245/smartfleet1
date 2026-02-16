import os
import json
import time
import random
from datetime import datetime
import numpy as np
import pandas as pd
from kafka import KafkaProducer

# ---- ENV CONFIG ----
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
TOPIC = os.getenv("KAFKA_TOPIC", "scania-telemetry")
NUM_VEHICLES = int(os.getenv("NUM_VEHICLES", 20))
SEND_INTERVAL = float(os.getenv("SEND_INTERVAL", 2.0))  # seconds
ANOMALY_PROB = float(os.getenv("ANOMALY_PROB", 0.02))

# ---- Load Dataset Metadata ----
spec_df = pd.read_csv("train_specifications.csv")
op_sample = pd.read_csv("train_operational_readouts.csv", nrows=1000)
signal_cols = [c for c in op_sample.columns if c not in ["id", "timestamp"]]

# Compute signal statistics
signal_stats = {
    c: {
        "mean": float(op_sample[c].mean()),
        "std": float(op_sample[c].std()),
        "min": float(op_sample[c].min()),
        "max": float(op_sample[c].max())
    }
    for c in signal_cols
}

# ---- Kafka Producer ----
producer = KafkaProducer(
    bootstrap_servers=[KAFKA_BROKER],
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

def simulate_signals(anomaly=False):
    signals = {}
    for c, stats in signal_stats.items():
        val = np.random.normal(stats["mean"], stats["std"])
        val = max(stats["min"], min(stats["max"], val))
        if anomaly and random.random() < 0.2:
            val += 3 * stats["std"]  # Inject drift
        signals[c] = round(float(val), 3)
    return signals

def simulate_specs():
    row = spec_df.sample(n=1).iloc[0].to_dict()
    return {k: (str(v) if not isinstance(v, (int, float)) else v) for k, v in row.items()}

if __name__ == "__main__":
    print("🚀 Starting SCANIA Telemetry Simulator...")
    while True:
        for vid in range(1, NUM_VEHICLES + 1):
            anomaly = random.random() < ANOMALY_PROB
            msg = {
                "vehicleId": f"COMPX-{vid}",
                "timestamp": datetime.utcnow().isoformat(),
                "specs": simulate_specs(),
                "signals": simulate_signals(anomaly),
                "status": "ANOMALY" if anomaly else "NORMAL"
            }
            producer.send(TOPIC, value=msg)
        time.sleep(SEND_INTERVAL)
