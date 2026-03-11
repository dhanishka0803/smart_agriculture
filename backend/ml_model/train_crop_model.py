"""
Real Crop Recommendation Model Training
Uses Kaggle Crop Recommendation Dataset
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import pickle
import json

def train_crop_model(dataset_path='Crop_recommendation.csv'):
    """
    Train crop recommendation model with real dataset
    
    Dataset features:
    - N: Nitrogen content ratio in soil
    - P: Phosphorous content ratio in soil
    - K: Potassium content ratio in soil
    - temperature: Temperature in degree Celsius
    - humidity: Relative humidity in %
    - ph: pH value of the soil
    - rainfall: Rainfall in mm
    - label: Crop name (target)
    """
    
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    
    print(f"Dataset shape: {df.shape}")
    print(f"Crops in dataset: {df['label'].nunique()}")
    print(f"\nCrop distribution:\n{df['label'].value_counts()}")
    
    # Features and target
    X = df[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
    y = df['label']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("\nTraining Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"\nTraining Accuracy: {train_score * 100:.2f}%")
    print(f"Testing Accuracy: {test_score * 100:.2f}%")
    
    # Cross-validation
    cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    print(f"Cross-validation scores: {cv_scores}")
    print(f"Mean CV Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print(f"\nFeature Importance:\n{feature_importance}")
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    print(f"\nClassification Report:\n{classification_report(y_test, y_pred)}")
    
    # Save model and scaler
    with open('crop_recommendation_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save crop list
    crops = sorted(df['label'].unique().tolist())
    with open('crops_list.json', 'w') as f:
        json.dump(crops, f)
    
    print("\nModel saved successfully!")
    print("Files created:")
    print("  - crop_recommendation_model.pkl")
    print("  - scaler.pkl")
    print("  - crops_list.json")
    
    return model, scaler, crops

def predict_crop(model, scaler, N, P, K, temperature, humidity, ph, rainfall):
    """
    Predict suitable crop based on soil and climate conditions
    """
    features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
    features_scaled = scaler.transform(features)
    
    # Get prediction
    prediction = model.predict(features_scaled)[0]
    
    # Get probabilities
    probabilities = model.predict_proba(features_scaled)[0]
    
    # Get top 3 recommendations
    top_3_idx = np.argsort(probabilities)[-3:][::-1]
    top_3_crops = [(model.classes_[idx], probabilities[idx]) for idx in top_3_idx]
    
    return {
        'recommended_crop': prediction,
        'confidence': float(probabilities[np.where(model.classes_ == prediction)[0][0]]),
        'top_3_recommendations': [
            {'crop': crop, 'confidence': float(conf)} 
            for crop, conf in top_3_crops
        ]
    }

# Crop information database
CROP_INFO = {
    'rice': {'days': 120, 'water': 'high', 'yield': 4500, 'price': 20},
    'wheat': {'days': 110, 'water': 'medium', 'yield': 3500, 'price': 25},
    'maize': {'days': 90, 'water': 'medium', 'yield': 5000, 'price': 18},
    'cotton': {'days': 150, 'water': 'medium', 'yield': 2000, 'price': 60},
    'jute': {'days': 120, 'water': 'high', 'yield': 2500, 'price': 35},
    'coffee': {'days': 180, 'water': 'medium', 'yield': 800, 'price': 150},
    'coconut': {'days': 365, 'water': 'medium', 'yield': 12000, 'price': 25},
    'papaya': {'days': 270, 'water': 'medium', 'yield': 40000, 'price': 20},
    'orange': {'days': 365, 'water': 'medium', 'yield': 15000, 'price': 40},
    'apple': {'days': 365, 'water': 'medium', 'yield': 10000, 'price': 60},
    'muskmelon': {'days': 90, 'water': 'medium', 'yield': 20000, 'price': 25},
    'watermelon': {'days': 90, 'water': 'medium', 'yield': 25000, 'price': 15},
    'grapes': {'days': 180, 'water': 'medium', 'yield': 8000, 'price': 80},
    'mango': {'days': 365, 'water': 'medium', 'yield': 12000, 'price': 50},
    'banana': {'days': 365, 'water': 'high', 'yield': 35000, 'price': 20},
    'pomegranate': {'days': 180, 'water': 'low', 'yield': 10000, 'price': 70},
    'lentil': {'days': 110, 'water': 'low', 'yield': 1500, 'price': 60},
    'blackgram': {'days': 90, 'water': 'low', 'yield': 1200, 'price': 70},
    'mungbean': {'days': 70, 'water': 'low', 'yield': 1000, 'price': 75},
    'mothbeans': {'days': 90, 'water': 'low', 'yield': 1100, 'price': 65},
    'pigeonpeas': {'days': 150, 'water': 'low', 'yield': 1800, 'price': 55},
    'kidneybeans': {'days': 90, 'water': 'medium', 'yield': 2000, 'price': 80},
    'chickpea': {'days': 120, 'water': 'low', 'yield': 1600, 'price': 65},
}

if __name__ == '__main__':
    print("Crop Recommendation Model Training")
    print("=" * 50)
    print("\nTo train:")
    print("1. Download 'Crop Recommendation Dataset' from Kaggle")
    print("2. Place 'Crop_recommendation.csv' in this directory")
    print("3. Run: python train_crop_model.py")
    print("\n" + "=" * 50)
    
    # Uncomment to train
    # model, scaler, crops = train_crop_model('Crop_recommendation.csv')
    
    # Example prediction
    # result = predict_crop(model, scaler, N=90, P=42, K=43, temperature=20.8, humidity=82, ph=6.5, rainfall=202)
    # print(f"\nPrediction: {result}")
