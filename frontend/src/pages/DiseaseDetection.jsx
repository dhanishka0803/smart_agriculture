import { useState } from 'react';
import { Upload, Camera, AlertTriangle, CheckCircle, Leaf, Shield } from 'lucide-react';

function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('https://smart-agriculture-4pz4.onrender.com/api/disease-detection', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setResult({
        success: false,
        error: 'Failed to analyze image'
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="gradient-bg text-white rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">AI Disease Detection</h2>
        <p className="text-green-100">Upload crop images for instant disease identification and treatment recommendations</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Camera className="w-6 h-6 mr-2 text-primary" />
            Upload Crop Image
          </h3>

          <div className="space-y-4">
            <div className="border-4 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                ) : (
                  <div>
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 font-semibold mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </label>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedImage || loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent inline-block mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Leaf className="w-5 h-5 inline mr-2" />
                  Analyze Disease
                </>
              )}
            </button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Tips for Best Results:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Take clear, well-lit photos</li>
                <li>• Focus on affected leaves or parts</li>
                <li>• Avoid blurry or dark images</li>
                <li>• Include multiple angles if possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-primary" />
            Analysis Results
          </h3>

          {!result ? (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Upload an image to see disease analysis</p>
            </div>
          ) : result.success ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary to-primary-light text-white p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold">{result.disease}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{(result.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <h5 className="font-bold text-red-800 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Symptoms
                </h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {result.symptoms.map((symptom, idx) => (
                    <li key={idx}>• {symptom}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h5 className="font-bold text-green-800 mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Treatment
                </h5>
                <ul className="text-sm text-green-700 space-y-1">
                  {result.treatment.map((step, idx) => (
                    <li key={idx}>• {step}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h5 className="font-bold text-blue-800 mb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Prevention
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {result.prevention.map((tip, idx) => (
                    <li key={idx}>• {tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">{result.error || 'Failed to analyze image'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sample Images */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Sample Disease Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" alt="Plant Disease 1" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80" alt="Plant Disease 2" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80" alt="Plant Disease 3" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
          <img src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" alt="Plant Disease 4" className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;
