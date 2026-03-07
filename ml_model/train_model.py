import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle

# Generate synthetic training data
np.random.seed(42)

crops = ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Groundnut', 'Soybean', 'Tomato', 'Potato', 'Onion']
soil_types = ['loamy', 'clayey', 'sandy', 'black', 'red']

data = []

# Rice - high water, warm, clayey/loamy
for _ in range(100):
    data.append(['Rice', np.random.uniform(22, 35), np.random.uniform(60, 85), 
                 np.random.uniform(1000, 2000), np.random.choice(['clayey', 'loamy'])])

# Wheat - cool, moderate water
for _ in range(100):
    data.append(['Wheat', np.random.uniform(15, 25), np.random.uniform(50, 70), 
                 np.random.uniform(400, 800), np.random.choice(['loamy', 'clayey'])])

# Cotton - warm, black soil
for _ in range(100):
    data.append(['Cotton', np.random.uniform(25, 35), np.random.uniform(50, 70), 
                 np.random.uniform(600, 1200), np.random.choice(['black', 'loamy'])])

# Maize - versatile
for _ in range(100):
    data.append(['Maize', np.random.uniform(20, 30), np.random.uniform(55, 75), 
                 np.random.uniform(500, 1000), np.random.choice(soil_types)])

# Groundnut - low water, sandy
for _ in range(100):
    data.append(['Groundnut', np.random.uniform(22, 32), np.random.uniform(45, 65), 
                 np.random.uniform(400, 700), np.random.choice(['sandy', 'red', 'loamy'])])

# Tomato - moderate
for _ in range(100):
    data.append(['Tomato', np.random.uniform(18, 28), np.random.uniform(60, 80), 
                 np.random.uniform(400, 800), np.random.choice(['loamy', 'red'])])

df = pd.DataFrame(data, columns=['crop', 'temperature', 'humidity', 'rainfall', 'soil_type'])

# Encode categorical variables
le_crop = LabelEncoder()
le_soil = LabelEncoder()

df['crop_encoded'] = le_crop.fit_transform(df['crop'])
df['soil_encoded'] = le_soil.fit_transform(df['soil_type'])

# Features and target
X = df[['temperature', 'humidity', 'rainfall', 'soil_encoded']]
y = df['crop_encoded']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model and encoders
with open('crop_model.pkl', 'wb') as f:
    pickle.dump({
        'model': model,
        'crop_encoder': le_crop,
        'soil_encoder': le_soil
    }, f)

print("Model saved successfully!")
