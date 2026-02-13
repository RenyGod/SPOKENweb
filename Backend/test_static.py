import requests
import random

fake_landmarks = [random.random() for _ in range(42)]

response = requests.post(
    "http://127.0.0.1:5000/api/static",
    json={"landmarks": fake_landmarks}
)

print("STATUS CODE:", response.status_code)
print("RAW RESPONSE:")
print(response.text)
