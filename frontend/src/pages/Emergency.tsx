import React, { useState } from 'react';
import { Phone, MessageSquare, Heart, Clock, Globe, MapPin, X, AlertTriangle, Shield } from 'lucide-react';

interface Hotline {
  name: string;
  number: string;
  hours: string;
  description: string;
  language: string;
  whatsapp?: string;
  category: 'emergency' | 'crisis' | 'counseling';
}

const EmergencyPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const indianHotlines: Hotline[] = [
    {
      name: "National Emergency",
      number: "112",
      hours: "24/7",
      description: "Unified emergency number for police, fire, ambulance",
      language: "Multiple languages",
      category: "emergency"
    },
    {
      name: "Tele-MANAS",
      number: "14416",
      hours: "24/7",
      description: "Government mental health support helpline",
      language: "20+ languages",
      category: "crisis"
    },
    {
      name: "Vandrevala Foundation",
      number: "+919999666555",
      hours: "24/7",
      description: "Crisis intervention & mental health support",
      language: "Multiple languages",
      whatsapp: "919999666555",
      category: "crisis"
    },
    {
      name: "KIRAN",
      number: "1800-599-0019",
      hours: "24/7",
      description: "Mental health rehabilitation helpline",
      language: "Multiple languages",
      category: "counseling"
    },
    {
      name: "NIMHANS Helpline",
      number: "080-46110007",
      hours: "Daily",
      description: "Medical advice, counseling & rehabilitation",
      language: "English, Kannada, Hindi",
      category: "counseling"
    },
    {
      name: "Aasra",
      number: "+919820466728",
      hours: "24/7",
      description: "Emotional support & suicide prevention",
      language: "Hindi, English",
      category: "crisis"
    },
    {
      name: "One Life",
      number: "78930-78930",
      hours: "24/7",
      description: "Suicide prevention & crisis support",
      language: "Multiple languages",
      category: "crisis"
    },
    {
      name: "iCALL",
      number: "022-25521111",
      hours: "Mon-Sat: 8AM-10PM",
      description: "TISS psycho-social support helpline",
      language: "Hindi, English, Marathi",
      category: "counseling"
    }
  ];

  const globalHotlines: Hotline[] = [
    {
      name: "USA - 988 Lifeline",
      number: "988",
      hours: "24/7",
      description: "National Suicide Prevention Lifeline",
      language: "English, Spanish",
      category: "crisis"
    },
    {
      name: "UK - Samaritans",
      number: "116123",
      hours: "24/7",
      description: "Free emotional support helpline",
      language: "English",
      category: "crisis"
    },
    {
      name: "Australia - Lifeline",
      number: "131114",
      hours: "24/7",
      description: "Crisis support & suicide prevention",
      language: "English",
      category: "crisis"
    },
    {
      name: "Canada - Talk Suicide",
      number: "1-833-456-4566",
      hours: "24/7",
      description: "National suicide prevention service",
      language: "English, French",
      category: "crisis"
    },
    {
      name: "Germany - Telefonseelsorge",
      number: "0800-111-0-111",
      hours: "24/7",
      description: "Telephone counseling service",
      language: "German",
      category: "counseling"
    },
    {
      name: "Japan - TELL Lifeline",
      number: "03-5774-0992",
      hours: "Daily: 9AM-11PM",
      description: "English-speaking crisis support",
      language: "English, Japanese",
      category: "crisis"
    }
  ];

  const handleEmergencyCall = () => {
    // Primary emergency number for India
    window.location.href = 'tel:14416';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'from-red-50 to-rose-50 border-red-200';
      case 'crisis': return 'from-orange-50 to-amber-50 border-orange-200';
      case 'counseling': return 'from-green-50 to-emerald-50 border-green-200';
      default: return 'from-stone-50 to-gray-50 border-stone-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'crisis': return <Heart className="w-5 h-5 text-orange-600" />;
      case 'counseling': return <Shield className="w-5 h-5 text-green-600" />;
      default: return <Phone className="w-5 h-5 text-stone-600" />;
    }
  };

  const HotlineCard: React.FC<{ hotline: Hotline; location: 'india' | 'global' }> = ({ hotline, location }) => (
    <div className={`p-4 rounded-lg border-2 bg-gradient-to-br ${getCategoryColor(hotline.category)} hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start gap-3 mb-3">
        {getCategoryIcon(hotline.category)}
        <div className="flex-1">
          <h3 className="font-semibold text-stone-800 text-sm mb-1">{hotline.name}</h3>
          <p className="text-stone-600 text-xs mb-2">{hotline.description}</p>

          <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{hotline.hours}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{hotline.language}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => window.location.href = `tel:${hotline.number}`}
          className="flex-1 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
        >
          <Phone className="w-3 h-3" />
          Call Now
        </button>

        {hotline.whatsapp && (
          <button
            onClick={() => window.open(`https://wa.me/${hotline.whatsapp}`, '_blank')}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <MessageSquare className="w-3 h-3" />
            Chat
          </button>
        )}
      </div>

      <div className="mt-2 text-center">
        <span className="text-stone-700 font-mono text-sm">{hotline.number}</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Emergency Page Content */}
      <div className="min-h-screen bg-orange-50 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}
          ></div>
        </div>

        <div className="relative z-10 p-4 max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 pt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-stone-800">Emergency Support</h1>
            </div>
            <p className="text-stone-600 text-lg mb-6">
              You're not alone. Help is available 24/7. Reach out now.
            </p>

            {/* Big Emergency Button */}
            <button
              onClick={handleEmergencyCall}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 mb-8 flex items-center gap-3 mx-auto"
            >
              <Phone className="w-6 h-6" />
              HELP NOW - Call 14416
            </button>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-8 text-left">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 mb-1">In Immediate Danger?</p>
                  <p className="text-amber-700">
                    Call <strong>112</strong> (National Emergency) or go to your nearest emergency room. 
                    These numbers are free and available 24/7.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* India Helplines */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-stone-700" />
              <h2 className="text-2xl font-bold text-stone-800">India Helplines</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {indianHotlines.map((hotline, index) => (
                <HotlineCard key={index} hotline={hotline} location="india" />
              ))}
            </div>
          </div>

          {/* Global Helplines */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-stone-700" />
              <h2 className="text-2xl font-bold text-stone-800">Global Helplines</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {globalHotlines.map((hotline, index) => (
                <HotlineCard key={index} hotline={hotline} location="global" />
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 mb-8">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Important Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-600">
              <div>
                <h4 className="font-medium text-stone-800 mb-2">What to Expect</h4>
                <ul className="space-y-1">
                  <li>• Confidential and non-judgmental support</li>
                  <li>• Trained counselors available to listen</li>
                  <li>• Free services - no cost to call</li>
                  <li>• Multi-language support available</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-stone-800 mb-2">Before You Call</h4>
                <ul className="space-y-1">
                  <li>• Find a quiet, private space</li>
                  <li>• Have water nearby</li>
                  <li>• It's okay to take your time</li>
                  <li>• You can hang up and call back anytime</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Remember</span>
            </div>
            <p className="text-green-700 text-sm">
              Seeking help is a sign of strength, not weakness. You deserve support and care. 
              Your life has value and meaning.
            </p>
          </div>
        </div>
      </div>

      {/* Modal can be added here if needed for routing */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stone-800">Emergency Support</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-stone-100 rounded-full"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <p className="text-stone-600 mb-4">This is a modal version of the emergency page.</p>
            <button
              onClick={handleEmergencyCall}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
            >
              Call Emergency Helpline
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EmergencyPage;